const ProgLangModel = require('../models/progLang/progLangModel');
const { getGitLabFolders } = require('./versionControlService');
const isInPackageExclusionList = require('../config/packageExclusion');
const similarity = require('../utils/stringSimilarity');

class TreeNode {
    constructor(name, parent, score, progLangId) {
        this.name = name;
        this.score = score;
        this.children = [];
        this.parent = parent;
        this.progLangId = progLangId;
    }

    hasPackage(packageName) {
        return this.children.find(e => e === packageName) ? true : false;
    }

    addToChildren(node) {
        this.children.push(node);
    }

    getChild(packageName) {
        return this.children.find(e => e === packageName);
    }

    addScore(score) {
        this.score = this.score + score;
    }

    get getChildren() {
        return this.children;
    }
}

// finding the progLang from passed progLangIds whose sourceFile (e.g. *.java) matches the file path coming from commit's diff
const findProgLangByPath = (progLangIds, filePath) => {
    const fileName = filePath.split('/').pop();
    for(const progLangId of progLangIds) {
        const progLang = ProgLangModel.findByPk(progLangId);
        for(const sourceFile of progLang.sourceFiles.split(',')) {
            const regExp = new RegExp(sourceFile.trim().replace('*', '.*'), 'gi');
            if (fileName.match(regExp))
                return progLang;
        }
    }
    return null;
}

// check if the passed package is local i.e. the package declaration is inside the project => it cannot be a skill
const checkIfPackageLocal = (pckg, folders, packageSeparator) => {
    if (packageSeparator)
        pckg = pckg.replace(packageSeparator, '/');
    for(const folder of folders) {
        if (pckg.endsWith(folder))
            return true;
    }
    return false;
}

const addToSkillTree = (explodedPackage, skillTree, score, progLangId) => {
    let skillJourney = skillTree;
    for(const pckg of explodedPackage) {
        if (!skillJourney.hasPackage(pckg)) {
            const treeNode = new TreeNode(pckg, skillJourney, score, progLangId);
            skillJourney.addToChildren(treeNode);
        } else {
            skillJourney.getChild(pckg).addScore(score);
        }
        skillJourney = skillJourney.getChild(pckg);
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
const populateSkillsFromContent = async (skillTree, content, score, filePath, progLangIds, projectId, commitId) => {
    const progLang = findProgLangByPath(progLangIds, filePath);
    const folders = await getGitLabFolders(projectId, commitId);
    const contentRows = content.split('\n');
    // for scope=FIRST_OCCURRENCE it is allowed not the find matching text at the beginning but if one was found then the first non-matching text will make to stop the searching 
    let hasPatternFound = false;
    for(const contentRow of contentRows) {
        for(const pattern of progLang.patterns) {
            const regExp = new RegExp(pattern, 'g');
            if (contentRow.match(regExp)) {
                hasPatternFound = true;
                const pckg = regExp.exec(contentRow).slice(1);
                if (!checkIfPackageLocal(pckg, folders, progLang.packageSeparator)) {
                    if (progLang.packageSeparator) {
                        let explodedPackage = pckg.split(progLang.packageSeparator);
                        if (progLang.removingTLDPackages)
                            explodedPackage = explodedPackage.filter(p => !isInPackageExclusionList(p));
                        if (progLang.level)
                            explodedPackage = explodedPackage.slice(0, progLang.level);
                        addToSkillTree(explodedPackage, skillTree, score, progLang.id);
                    } else {
                        if (!skillTree.hasPackage(pckg)) {
                            const treeNode = new TreeNode(pckg, skillTree, score, progLang.id);
                            skillTree.addToChildren(treeNode); 
                        } else {
                            skillTree.getChild(pckg).addScore(score);
                        }
                    }
                }
            }
        }
    }
}

const calculateCumulatedScore = (diff) => {
    let score = 0;
    let minusLines = [];
    let plusLines = [];
    for(const lineDiff of diff.diff.split('\n')) {
        if (lineDiff.startsWith('+') || lineDiff.startsWith('-')) {
            if (lineDiff.startsWith('+'))
                plusLines.push(lineDiff);
            else 
                minusLines.push(lineDiff);
        } else {
            score = score + calculateScore(minusLines, plusLines);
            minusLines = [];
            plusLines = [];
        }
    }
}

const calculateScore = (minusLines, plusLines) => {
    let score = 0.0;
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
            const closestMinusLine = minusLines.reduce((prev, curr) => similarity(plusLine, prev) < similarity(plusLine, curr) ? curr : prev);
            score = score + (1 - similarity(plusLine, closestMinusLine));
            minusLines = minusLines.filter(v => v !== closestMinusLine);
        }
    }
    // if there were more '-' lines than '+' then minusLines is not empty here so add the rest of them to the score: : nr of minus lines * 0.5
    if (minusLines.length !== 0)
        score = score + minusLines.length * 0.5;
    return score;
}

module.exports = { populateSkillsFromContent, calculateCumulatedScore, TreeNode };