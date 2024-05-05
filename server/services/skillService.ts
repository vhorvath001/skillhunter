import ProgLangModel from '../models/progLang/progLangModel'
import { GitLabDiff, getGitLabFolders } from './versionControlService'
import isInPackageExclusionList from  '../config/packageExclusion'
import { AxiosInstance } from 'axios'
import logger from '../init/initLogger'
import TreeNode from '../schema/treeNode'
const similarity = require('../utils/stringSimilarity')

// finding the progLang from passed progLangIds whose sourceFile (e.g. *.java) matches the file path coming from commit's diff
const findProgLangByPath = async (progLangIds: number[], filePath: string): Promise<ProgLangModel | null> => {
    logger.debug(`Finding prog lang by path [progLangIds=${progLangIds}, filePath=${filePath}] ...`)
    let progLangModel: ProgLangModel | null = null
    const fileName: string = filePath.split('/').pop()!
    for(const progLangId of progLangIds) {
        const progLang: ProgLangModel = (await ProgLangModel.findByPk(progLangId))!
        for(const sourceFile of progLang.sourceFiles.split(',')) {
            const regExp: RegExp = new RegExp(sourceFile.trim().replace('*', '.*'), 'gi')
            if (fileName.match(regExp))
                progLangModel = progLang
        }
    }
    logger.debug(`The found prog lang is [${progLangModel}].`)
    return progLangModel
}

// check if the passed package is local i.e. the package declaration is inside the project => it cannot be a skill
const checkIfPackageLocal = (pckg: string, folders: string[], packageSeparator: string): boolean => {
    logger.debug(`Checking if package is local [pckg=${pckg}, folders=${folders}, packageSeparator=${packageSeparator}] ...`)
    if (packageSeparator)
        pckg = pckg.replace(new RegExp(packageSeparator.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'g'), '/')
    if (!pckg.startsWith('/'))
        pckg = '/' + pckg
    for(const folder of folders) {
        if (pckg.startsWith(folder)) {
            logger.debug('It is local.')
            return true;
        }
    }
    logger.debug('It is not local.')
    return false;
}

const addToSkillTree = (explodedPackage: string[], skillTree: TreeNode, score: number, progLangId: number): void => {
    logger.debug(`Adding the skill to the tree [explodedPackage=${explodedPackage}, score=${score}, progLangId=${progLangId}] ...`)
    logger.debug(`Skill tree:\n${logSkillTree(skillTree.children, '')}`)
    let skillJourney: TreeNode = skillTree
    for(const pckg of explodedPackage) {
        if (!skillJourney.hasPackage(pckg)) {
            const treeNode: TreeNode = new TreeNode(pckg, skillJourney, score, progLangId)
        } else {
            skillJourney.getChild(pckg)!.addScore(score)
        }
        skillJourney = skillJourney.getChild(pckg)!
    }
}

// getting the skill tree from the source file content
// 1. looping throught the content row by row
// 2. getting all the patterns specified in progLang and check if it matches
// 3. if it does then extract the package name
// 4. if the package is local (i.e. it is declared inside this project) then ignore it
// 5. remove the TLD-like package names (e.g. the starting 'com', 'org', 'uk', etc)
// 6. only 'level' number of packages will be taken into 
// 7. add/append the package to the the skill tree
const populateSkillsFromContent = async (gitLabApi: AxiosInstance, skillTree: TreeNode, content: string, score: number, filePath: string, 
                                         progLangIds: number[], projectId: number, commitId: string) => {
    logger.debug(`Populating skills from code content [score=${score}, filePath=${filePath}, progLangIds=${progLangIds}, projectId=${projectId}, commitId=${commitId}] ...`)
    logger.debug(`Incoming skill tree:\n${logSkillTree(skillTree.children, '')}`)
    logger.debug(`Incoming code content:\n${content}`)

    const progLang: ProgLangModel | null = await findProgLangByPath(progLangIds, filePath)
    if (!progLang) {
        logger.warn(`No matching programming language has been found for the file '${filePath}' in the progLang array '${progLangIds}'! This file will be ignored.`)
        return
    }
    const folders: string[] = await getGitLabFolders(gitLabApi, projectId, commitId)
    const patterns = JSON.parse(progLang.patterns ?? '{"patternList":[]}').patternList
    const contentRows: string[] = content.split('\n')
    // for scope=FIRST_OCCURRENCE it is allowed not the find matching text at the beginning but if one was found then the first non-matching text will make to stop the searching 
    let hasPatternFound: boolean = false;
    contentLoop: for(const contentRow of contentRows) {
        if ((contentRow?.trim()?.length || 0) === 0)
            continue
        for(const pattern of patterns) {
            const regExp: RegExp = new RegExp(pattern, 'g')
            if (contentRow.match(regExp)) {
                logger.debug(`The content row [${contentRow}] matches the pattern [${pattern}].`)
                hasPatternFound = true;
                const regExpOutput: RegExpExecArray | null = regExp.exec(contentRow)
                if (regExpOutput === null)
                    continue
                const pckgArray: string [] = regExpOutput.slice(1)
                if (!(pckgArray instanceof Array) || pckgArray.length === 0)
                    continue
                const pckg = pckgArray[0]
                logger.debug(`The extracted package is [${pckg}].`)
                if (!checkIfPackageLocal(pckg, folders, progLang.packageSeparator)) {
                    if (progLang.packageSeparator) {
                        let explodedPackage: string[] = pckg.split(progLang.packageSeparator);
                        if (progLang.removingTLDPackages)
                            explodedPackage = explodedPackage.filter(p => !isInPackageExclusionList(p));
                        if (progLang.level)
                            explodedPackage = explodedPackage.slice(0, progLang.level);
                        addToSkillTree(explodedPackage, skillTree, score, progLang.id);
                    } else {
                        if (!skillTree.hasPackage(pckg)) {
                            const treeNode: TreeNode = new TreeNode(pckg, skillTree, score, progLang.id);
                            skillTree.addToChildren(treeNode); 
                        } else {
                            skillTree.getChild(pckg)!.addScore(score);
                        }
                    }
                } else 
                    logger.debug(`The package is local, it will be ignored.`)
            } else {
                // it is for 'scope=FIRST_OCCURRENCE' (a match has already been found before but now a not-import code is extracted => the search must be stopped)
                if (hasPatternFound && progLang.scopePattern === 'FIRST_OCCURRENCE') {
                    logger.debug('The scope is FIRST_OCCURRENCE, a match has been already found before but the current content line does not match so the search will be stopped for this file.')
                    break contentLoop
                }
            }
        }
    }
    logger.debug(`The generated skill tree:\n${logSkillTree(skillTree.children, '')}`)
}

const logSkillTree = (childNodes: TreeNode[], indentation: string): string => {
    let logg: string = ''
    for(const childNode  of childNodes) {
        logg = logg + `${indentation}${childNode.name}[score = ${childNode.score}, progLangId = ${childNode.progLangId}]\n`
        logg = logg + logSkillTree(childNode.children, indentation + '    ')
    }
    return logg
}

const calculateCumulatedScore = (diff: GitLabDiff): number => {
    logger.debug(`Calculating cumulated score [diff=${diff}] ...`)
    let score: number = 0;
    let minusLines: string[] = [];
    let plusLines: string[] = [];
    for(const lineDiff of diff.diff.split('\n')) {
        if (lineDiff.startsWith('+') || lineDiff.startsWith('-')) {
            if (lineDiff.startsWith('+'))
                plusLines.push(lineDiff.slice(1));
            else 
                minusLines.push(lineDiff.slice(1));
        } else {
            score = score + calculateScore(minusLines, plusLines);
            minusLines = [];
            plusLines = [];
        }
    }
    if (minusLines.length + plusLines.length > 0)
        score = score + calculateScore(minusLines, plusLines)
    return score
}

const calculateScore = (minusLines: string[], plusLines: string[]) => {
    logger.debug(`Calculating score [minusLines=${minusLines}, plusLines=${plusLines}] ...`)
    let score: number = 0;
    // will check the lines starting with '+' -> will find a '-' line which has the least text difference and use this '-' line to calculate the similarity score
    //    will remove this '-' line at the end of iteration
    // For example:
    // -private el = list.get(i+1);
    // -@Autowired private Context context;
    // +@Autowired private Context beanContext;
    // in this case the 2nd '-' line will match with the '+' line
    for(const plusLine of plusLines) {
        // if there is no line starting with '-' left then the score is: nr of plus lines * 1
        if (minusLines.length === 0)
            score = score + 1;
        else {
            // similarity -> 0.0 (different) - 1.0 (identical)
            const closestMinusLine: string = minusLines.reduce((prev, curr) => similarity(plusLine, prev) < similarity(plusLine, curr) ? curr : prev)
            logger.debug(`The closest minus line is '${closestMinusLine}'.`)
            score = score + (1 - similarity(plusLine, closestMinusLine))
            minusLines = minusLines.filter(v => v !== closestMinusLine)
        }
    }
    // if there were more '-' lines than '+' then minusLines is not empty here so add the rest of them to the score: : nr of minus lines * 0.5
    if (minusLines.length !== 0)
        score = score + minusLines.length * 0.5
    logger.debug(`The calculated score is '${score}'.`)
    return score;
}

export { populateSkillsFromContent, calculateCumulatedScore }