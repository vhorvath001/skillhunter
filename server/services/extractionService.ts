import { populateSkillsFromContent, calculateCumulatedScore, findProgLangByPath } from './skillService'
import { log } from '../models/progressLog/progressLogDataService'
import { saveExtraction, updateProgressCommits, updateProgressProjects, updateStatus } from '../models/extraction/extractionDataService'
import { getGitLabCommits, getGitLabDiffList, getGitLabContentByCommitId, GitLabDiff, getGitLabProject } from './versionControlService'
import { updateSkillTree } from '../models/skill/skillDataService'
import saveProject from '../models/project/projectDataService'
import logger from '../init/initLogger'
import TreeNode from '../schema/treeNode'
import GitlabAPI from '../init/gitlabAPI'
import { ProgLangType, SelectedProjectBranchesType } from '../schema/appTypes'
import ProgLangModel from '../models/progLang/progLangModel'
import { getProgLangsByIds } from '../models/progLang/progLangDataService'
import config from '../config/skillHunter.config'
import { getOrCreateDeveloper } from '../models/developer/developerDataService'
import { toProgLangType } from '../controllers/progLangController'

const start = async (repoId: number, 
                     projectsBranches: SelectedProjectBranchesType[], 
                     path: string, 
                     progLangIds: number[]): Promise<void> => {
    logger.info(`Extraction starting [repoId=${repoId}, branches=${JSON.stringify(projectsBranches)}, path=${path}, progLangIds=${progLangIds}] ...`)
    let extractionId: number = -1

    try {
        extractionId = await saveExtraction(repoId, projectsBranches, path, progLangIds);
        await log('Extraction has started.', extractionId);

        const gitlabAPI: GitlabAPI = await GitlabAPI.createGitlapAPI(repoId)

        const progLangs: ProgLangModel[] = await getProgLangsByIds(progLangIds)

        // getting all the projects from repo + path and looping through them
        await log(`There are ${projectsBranches.length} Gitlab projects to process.`, extractionId);

        for (const [ind, projectBranches] of projectsBranches.entries()) {
            await updateProgressProjects(extractionId, (ind+1), projectsBranches.length)

            let skillTree: TreeNode = new TreeNode(null, null, [], null)
            const gitlabProjectId = Number(projectBranches.projectId)

            await log(`Project [${ind+1} / ${projectsBranches.length}] - processing the '${projectBranches.branch}' branch of the '${projectBranches.projectName}' GitLab project...`, extractionId);

            const project = await getGitLabProject(gitlabAPI, projectBranches.projectId)
            const projectId = await saveProject(project, extractionId)

            // getting all the commits of the specific project and looping through them
            const commits = await getGitLabCommits(gitlabAPI, gitlabProjectId, projectBranches.branch)
            await log(`Found ${commits.length} commits to process.`, extractionId)

            for(const [indCommit, commit] of commits.entries()) {
                await updateProgressCommits(extractionId, (indCommit+1), commits.length)

                logger.debug(`Processing [${indCommit+1} / ${commits.length}] commit...`)
                // getting all the diffs of the commit to decide how heavily the committer modified the file
                const diffList: GitLabDiff[] = await getGitLabDiffList(gitlabAPI, gitlabProjectId, commit.id)

                const developerId: number = await getOrCreateDeveloper(commit.committer_name ?? 'UNKNOWN', commit.committer_email ?? 'UNKNOWN')

                for(const diff of diffList) {
                    const foundProgLangModel: ProgLangModel | null = findProgLangByPath(progLangs, diff.path)
                    if (foundProgLangModel) {
                        const foundProgLang: ProgLangType = toProgLangType(foundProgLangModel)
                        // first the diff has to be checked how heavily it was modified
                        // a score (integer between 0 and 1) will be calculated which will mirror the size of the alteration on the file by the committer
                        const score: number = calculateCumulatedScore(diff, foundProgLang.ignoringLinesPatterns)

                        // then the whole file conten (in specific revision) has to be retrieved to extract the imported packages which will be the skills                
                        const content: string = await getGitLabContentByCommitId(gitlabAPI, gitlabProjectId, diff.path, commit.id)
                        await populateSkillsFromContent(gitlabAPI, skillTree, content, score, diff.path, progLangs, gitlabProjectId, commit.id, developerId)
                    } else {
                        logger.debug(`The file [${diff.path}] does not belong to any of the selected prog lang(s), it will be ignored.`)
                    }
                }

                if (indCommit % config.appLoggingEveryXCommits === 0 && indCommit >= config.appLoggingEveryXCommits)
                    await log(`Processed [${indCommit} / ${commits.length}] commits.`, extractionId)
            }

            await log(`Updating the Skill tree.`, extractionId)
            // save/update the skill tree in database and add the score to ExtractionSkillFindingModel
            await updateSkillTree(null, skillTree.children, projectId, extractionId)
        }
        await log('Extraction finished successfully.', extractionId)
        await updateStatus(extractionId, 'COMPLETED')
    } catch(err) {
        let errorMessage: string = JSON.stringify(err)
        if (err instanceof Error) {
            logger.error(`${errorMessage} - ${err.stack}`)
        }
        else
            logger.error(`${errorMessage} - ${err}`)            
        await log('Extraction failed! - ' + errorMessage, extractionId)
        await updateStatus(extractionId, 'FAILED')
    }
}

export { start }