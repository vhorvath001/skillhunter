import { populateSkillsFromContent, calculateCumulatedScore } from './skillService'
import log from '../models/progressLog/progressLogDataService'
import saveExtraction from '../models/extraction/extractionDataService'
import { getGitLabProjects, getGitLabCommits, getGitLabDiffList, getGitLabContentByCommitId, GitLabDiff } from './versionControlService'
import updateSkillTree from '../models/skill/skillDataService'
import saveProject from '../models/project/projectDataService'
import createGitLabApi from '../config/initGitLabApi'
import { GitLabProjectType } from './versionControlService'
import { AxiosInstance } from 'axios'
import logger from '../config/initLogger'
import TreeNode from '../schema/treeNode'

const start = async (repoId: number, branches: {}, path: string, progLangs: number[]) => {
    logger.info(`Extraction starting [repoId=${repoId}, branches=${JSON.stringify(branches)}, path=${path}, progLangs=${progLangs}] ...`)
    const extractionId: number = await saveExtraction(repoId, branches, path, progLangs);
    log('Extraction has started.', extractionId);

    const gitLabApi: AxiosInstance = await createGitLabApi(repoId);

    // getting all the projects from repo + path and looping through them
    const projects: GitLabProjectType[] = await getGitLabProjects(gitLabApi, path);
    log(`Found ${projects.length} projects in GitLab to process.`, extractionId);

    for (const project of projects) {
        let skillTree: TreeNode = new TreeNode(null, null, null, null)
        const branch: string = branches[project.id.toString() as keyof typeof branches] as string

        log(`Processing the '${branch}' branch of the '${project.name}' GitLab project...`, extractionId);

        const projectId = await saveProject(project.name, extractionId);

        // getting all the commits of the specific project and looping through them
        const commits = await getGitLabCommits(gitLabApi, project.id, branch);
        log(`Found ${commits.length} commits to process.`, extractionId);
        for(const commit of commits) {
            // getting all the diffs of the commit to decide how heavily the committer modified the file
            const diffList: GitLabDiff[] = await getGitLabDiffList(gitLabApi, project.id, commit.id);

            for(const diff of diffList) {
                // first the diff has to be checked how heavily it was modified
                // a score (integer between 0 and 1) will be calculated which will mirror the size of the alteration on the file by the committer
                const score: number = calculateCumulatedScore(diff);

                // then the whole file conten (in specific revision) has to be retrieved to extract the imported packages which will be the skills                
                const content: string = await getGitLabContentByCommitId(gitLabApi, project.id, diff.path, commit.id);
                await populateSkillsFromContent(gitLabApi, skillTree, content, score, diff.path, progLangs, project.id, commit.id);
            }
        }

        // save/update the skill tree in database and add the score to ExtractionSkillFindingModel
        await updateSkillTree(undefined, skillTree.children, projectId, extractionId);
    }
    log('Extraction finished.', extractionId);
}

export { start }