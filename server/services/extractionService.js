const log = require('../models/progressLog/progressLogDataService');
const saveExtraction = require('../models/extraction/extractionDataService');
const { getGitLabProjects, getGitLabCommits, getGitLabDiffList, getGitLabContentByCommitId } = require('./versionControlService');
const { populateSkillsFromContent, calculateCumulatedScore, TreeNode } = require('./skillService');
const updateSkillTree = require('../models/skill/skillDataService');
const saveProject = require('../models/project/projectDataService');
const createGitLabApi = require('../config/initGitLabApi');

const start = async (repoId, branches, path, progLangs) => {
    const extractionId = await saveExtraction(repoId, branches, path, progLangs);
    log('Extraction has started.', extractionId);

    const gitLabApi = await createGitLabApi(repoId);

    // getting all the projects from repo + path and looping through them
    const projects = await getGitLabProjects(gitLabApi, path);
    log(`Found ${projects.length} projects in GitLab to process.`, extractionId);

    for (const project of projects) {
        let skillTree = new TreeNode(null, null, null, null);
        const branch = branches[project.id];

        log(`Processing the '${branch}' branch of the '${project.name}' GitLab project...`, extractionId);

        const projectId = await saveProject(project.name, extractionId);

        // getting all the commits of the specific project and looping through them
        const commits = await getGitLabCommits(gitLabApi, project.id, branch);
        log(`Found ${commits.length} commits to process.`, extractionId);
        for(const commit of commits) {
            // getting all the diffs of the commit to decide how heavily the committer modified the file
            const diffList = await getGitLabDiffList(gitLabApi, project.id, commit.id);

            for(const diff of diffList) {
                // a score (integer between 0 and 1) will be calculated which will mirror the size of the alteration on the file by the committer
                const score = calculateCumulatedScore(diff);

                // 1.1.2. getting the file content in specific revision to extract the skills (imported packages)
                const content = await getGitLabContentByCommitId(gitLabApi, project.id, diff.path, commit.id);
                await populateSkillsFromContent(skillTree, content, score, diff.path, progLangs, project.id, commit.id);
            }
        }

        // save/update the skill tree in database and add the score to ExtractionSkillFindingModel
        await updateSkillTree(null, skillTree.getChildren(), projectId, extractionId);
    }
    log('Extraction finished.', extractionId);
}

module.exports = { start };