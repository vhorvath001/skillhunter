import ProgLangModel from '../models/progLang/progLangModel'
import { GitLabDiff, getGitLabFolders } from './versionControlService'
import isInPackageExclusionList from  '../config/packageExclusion'
import logger from '../init/initLogger'
import TreeNode, { ScoreType } from '../schema/treeNode'
import GitlabAPI from '../init/gitlabAPI'
import { PackageRemovalPatternType } from '../schema/appTypes'
const similarity = require('../utils/stringSimilarity')

// finding the progLang from passed progLangIds whose sourceFile (e.g. *.java) matches the file path coming from commit's diff
const findProgLangByPath = (progLangs: ProgLangModel[], filePath: string): ProgLangModel | null => {
    logger.debug(`Finding prog lang by path [progLangIds=${progLangs.map(pl => pl.id).join(', ')}, filePath=${filePath}] ...`)

    let progLangModel: ProgLangModel | null = null
    const fileName: string = filePath.split('/').pop()!

    for(const progLang of progLangs) {
        for(const sourceFile of progLang.sourceFiles.split(',')) {

            const regExp: RegExp = new RegExp(escapeRegExpr(sourceFile.trim()).replace('*', '.*'), 'gi')
            if (fileName.match(regExp))
                progLangModel = progLang
        }
    }
    return progLangModel
}

// check if the passed package is local i.e. the package declaration is inside the project => it cannot be a skill
const checkIfPackageLocal = (pckg: string, folders: string[], packageSeparator: string): boolean => {
    logger.debug(`Checking if package is local [pckg=${pckg}, packageSeparator=${packageSeparator}] ...`)

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

const addToSkillTree = (explodedPackage: string[], skillTree: TreeNode, score: number, progLangId: number, developerId: number): void => {
    logger.debug(`Adding the skill to the tree [explodedPackage=${explodedPackage}, score=${score}, progLangId=${progLangId}, developerId=${developerId}] ...`)
    logger.silly(`Skill tree:\n${logSkillTree(skillTree.children, '')}`)

    let skillJourney: TreeNode = skillTree
    for(const pckg of explodedPackage) {
        if (!skillJourney.hasPackage(pckg)) {
            const scoreType: ScoreType = {
                score: score,
                developerId: developerId
            }

            const treeNode: TreeNode = new TreeNode(pckg, skillJourney, [scoreType], progLangId)
        } else {
            skillJourney.getChild(pckg)!.addScore(score, developerId)
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
const populateSkillsFromContent = async (gitlabAPI: GitlabAPI, skillTree: TreeNode, content: string, score: number, filePath: string, 
                                         progLangs: ProgLangModel[], projectId: number, commitId: string, developerId: number) => {
    logger.debug(`Populating skills from code content [score=${score}, filePath=${filePath}, progLangIds=${progLangs.map(pl => pl.id).join(', ')}, projectId=${projectId}, commitId=${commitId}, developerId=${developerId}] ...`)
    logger.silly(`Incoming skill tree:\n${logSkillTree(skillTree.children, '')}`)
    logger.silly(`Incoming code content:\n${content}`)

    const progLang: ProgLangModel | null = findProgLangByPath(progLangs, filePath)
    if (!progLang) {
        logger.warn(`No matching programming language has been found for the file '${filePath}' in the progLang array '${progLangs.map(pl => pl.id).join(', ')}'! This file will be ignored.`)
        return
    }

    const folders: string[] = await getGitLabFolders(gitlabAPI, projectId, commitId)
    
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
                logger.silly(`The content row [${contentRow}] matches the pattern [${pattern}].`)
                hasPatternFound = true

                const regExpOutput: RegExpExecArray | null = regExp.exec(contentRow)
                if (regExpOutput === null)
                    continue

                const pckgArray: string [] = regExpOutput.slice(1)
                if (!(pckgArray instanceof Array) || pckgArray.length === 0)
                    continue

                let pckg: string | null = pckgArray[0]
                logger.silly(`The extracted package is [${pckg}].`)
                
                if (!checkIfPackageLocal(pckg, folders, progLang.packageSeparator)) {
                    pckg = removeUnnecessaryPackage(pckg, progLang)
                    if (!pckg)
                        continue contentLoop

                    if (progLang.packageSeparator) {
                        let explodedPackage: string[] = pckg.split(progLang.packageSeparator)

                        if (progLang.removingTLDPackages)
                            explodedPackage = explodedPackage.filter(p => !isInPackageExclusionList(p))

                        if (progLang.level)
                            explodedPackage = explodedPackage.slice(0, progLang.level)

                        addToSkillTree(explodedPackage, skillTree, score, progLang.id, developerId)
                    } else {
                        if (!skillTree.hasPackage(pckg)) {
                            const scoreType: ScoreType = {
                                score: score,
                                developerId: developerId
                            }                
                            const treeNode: TreeNode = new TreeNode(pckg, skillTree, [scoreType], progLang.id)
                            skillTree.addToChildren(treeNode)
                        } else {
                            skillTree.getChild(pckg)!.addScore(score, developerId)
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
    logger.silly(`The generated skill tree:\n${logSkillTree(skillTree.children, '')}`)
}

const logSkillTree = (childNodes: TreeNode[], indentation: string): string => {
    let logg: string = ''
    for(const childNode  of childNodes) {
        logg = logg + `${indentation}${childNode.name}[score = ${JSON.stringify(childNode.score)}, progLangId = ${childNode.progLangId}]\n`
        logg = logg + logSkillTree(childNode.children, indentation + '    ')
    }
    return logg
}

const calculateCumulatedScore = (diff: GitLabDiff, ignoringLinesPatterns: string[]): number => {
    logger.debug(`Calculating cumulated score ...`)
    logger.silly(`\n${JSON.stringify(diff)}`)

    let score: number = 0;
    let minusLines: string[] = [];
    let plusLines: string[] = [];
    
    for(const lineDiff of diff.diff.split('\n')) {
        if (lineDiff.startsWith('+'))
            plusLines.push(lineDiff.slice(1).trim())
        else if (lineDiff.startsWith('-'))
            minusLines.push(lineDiff.slice(1).trim())
        else {
            score = score + calculateScore(minusLines, plusLines, ignoringLinesPatterns)
            minusLines = []
            plusLines = []
        }
    }
    if (minusLines.length + plusLines.length > 0)
        score = score + calculateScore(minusLines, plusLines, ignoringLinesPatterns)
    return score
}

const calculateScore = (minusLines: string[], plusLines: string[], ignoringLinesPatterns: string[]): number => {
    logger.debug(`Calculating score ...`)
    ignoreLinesIfNecessary(minusLines, plusLines, ignoringLinesPatterns)
    
    let score: number = 0.0
    if (minusLines.length > 0 || plusLines.length > 0) {
        logger.silly(`minusLines = [${minusLines}]\nplusLines = [${plusLines}]`)
        // 1. if the number of minusLines and plusLines are equal then they will be matched by order (1st plusLine belongs to 1st minusLine, etc)
        // 2. else will check the lines starting with '+' -> will find a '-' line which has the least text difference and use this '-' line to calculate the similarity score
        //    will remove this '-' line at the end of iteration
        // For example:
        // -private el = list.get(i+1);
        // -@Autowired private Context context;
        // +@Autowired private Context beanContext;
        // in this case the 2nd '-' line will match with the '+' line

        // 1st rule: applying by order
        if (minusLines.length === plusLines.length) {
            for (let i = 0; i < plusLines.length; i++) {
                score = score + computeScore(plusLines[i], minusLines[i])
            }
        }
        // 2nd rule: closest match
        else {
            sortPlusLinesByLeastDifferenceFromMinusLine(plusLines, minusLines)
            for(const plusLine of plusLines) {
                // if there is no line starting with '-' left then the score is: nr of plus lines * 1
                if (minusLines.length === 0)
                    score = score + computeScore(plusLine, null)
                else {
                    const closestMinusLine: string = minusLines.reduce((prev, curr) => computeScore(plusLine, prev) < computeScore(plusLine, curr) ? curr : prev)
                    logger.silly(`The closest minus line is '${closestMinusLine}'.`)
                    score = score + computeScore(plusLine, closestMinusLine)
                    minusLines = minusLines.filter(v => v !== closestMinusLine)
                }
            }
            // if there were more '-' lines than '+' then minusLines is not empty here so add the rest of them to the score: : nr of minus lines * 0.5
            if (minusLines.length !== 0)
                score = score + computeScore(null, 'NOTIMPORTANTASNOTUSED')
        }
        logger.debug(`The calculated score is '${score}'.`)
    }
    return score
}

// - both + and - lines are passed: the computed difference score (-> similarity(...) function) is weighted with the lenght of the + line
// - only the + line is passed: the score is 1 weighted with ....
// - only the - line is passed: the score is 0.5
const computeScore = (plusLine: string | null, minusLine: string | null): number => {
    let score: number = 0.0
    // if there are - and + lines
    if (minusLine && plusLine) {
        // similarity -> 0.0 (different) - 1.0 (identical)
        const [x, i] = toInt(similarity(plusLine, minusLine))
        score = ((1*i - x) / i) * plusLine.trim().length
    }
    // if there is only + line
    else if (plusLine)
        score = plusLine.trim().length
    else if (minusLine)
        score = 0.5
    return score
}

const toInt = (v: number) => {
    if (v === 1)
        return [1, 1]
    else if (v === 0)
        return [0, 1]
    else {
        const d = v.toString().split('.')[1].length
        const p = Math.pow(10, d)
        const r = v * p
        return [r, p]    
    }
}

const ignoreLinesIfNecessary = (minusLines: string[], plusLines: string[], ignoringLinesPatterns: string[]): void => {
    logger.silly(`ignoreLinesIfNecessary [minusLines: ${minusLines}\nplusLines: ${plusLines}\nignoringLinesPatterns: ${ignoringLinesPatterns}`)
    const equalLength: boolean = minusLines.length === plusLines.length
    outerLoop: for (let i = 0; i < plusLines.length; i++) {
        for(const pattern of ignoringLinesPatterns) {
            const regExp: RegExp = new RegExp(pattern, 'gi')
            if (plusLines[i].match(regExp)) {
                logger.silly(`The '+' line [${plusLines[i]}] will be removed.`)
                plusLines.splice(i, 1)
                if (equalLength) {
                    logger.silly(`The '-' line [${minusLines[i]}] will be also removed.`)
                    minusLines.splice(i, 1)
                }
                continue outerLoop
            }
        }
    }
}

const escapeRegExpr = (regExprText: string): string => {
    return regExprText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const removeUnnecessaryPackage = (pckg: string, progLang: ProgLangModel): string | null => {
    logger.debug(`Removing unnecessary package [pckg=${pckg}, prog lang id=${progLang.id}] ...`)
    const packageRemovalPatterns: PackageRemovalPatternType[] = JSON.parse(progLang.packageRemovalPatterns ?? '{"patternList":[]}').patternList
    let updatedPckg: string | null = pckg
    
    for(const packageRemovalPattern of packageRemovalPatterns) {
        const regExp: RegExp = new RegExp(packageRemovalPattern.value, 'g')
        if (pckg.match(regExp)) {
            if (packageRemovalPattern.type === 'IGNORING_PACKAGE') {
                updatedPckg = null
            }
            else {
                updatedPckg = pckg.replace(regExp, '')
            }
        }
    }
    logger.debug(`updatedPckg = ${updatedPckg}`)
    return updatedPckg
}

/*
-@Autowired private Context beanContext;
+@Autowired public MyContext myBeanContext;
+@Autowired private Context beanContext;

In the example above the logic would have taken the 1st + line and look for the least different - line ->
however it is wrong as the 1st - and 2nd + line are equal so they should be 'ignored' (their score wil be 0) 
and just the 1st + line should be calculated =>
looping through - lines -> find the least different + line and move this + line to the index in plusLines where 
the currently - line is (for example: the - line is in position 0, the found least different + line is in position 1 =>
the 1st and 2nd plus line will be swapped)
*/
const sortPlusLinesByLeastDifferenceFromMinusLine = (plusLines: string[], minusLines: string[]) => {
    minusLines.forEach((minusLine, posMinus) => {
        if (posMinus < plusLines.length) {
            const posPlus = getPosOfLeastDifferentPlusLine(minusLine, plusLines, posMinus)
            swap(plusLines, posPlus, posMinus)
        }
    })
}
const getPosOfLeastDifferentPlusLine = (minusLine: string, plusLines: string[], posMinus: number): number => {
    let pos: number = 0
    let minScore: number = 1
    plusLines.forEach((plusLine, posPlus) => {
        const currentScore: number = computeScore(plusLine, minusLine)
        if (currentScore < minScore) {
            pos = posPlus
            minScore = currentScore
        }
    })
    return pos
}
const swap = (plusLines: string[], pos1: number, pos2: number): void => {
    const val: string = plusLines[pos1]
    plusLines[pos1] = plusLines[pos2]
    plusLines[pos2] = val 
}

export { populateSkillsFromContent, calculateCumulatedScore, findProgLangByPath, logSkillTree }
