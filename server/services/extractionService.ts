import { populateSkillsFromContent, calculateCumulatedScore, findProgLangByPath } from './skillService'
import { log } from '../models/progressLog/progressLogDataService'
import { queryExtractionById, saveExtraction, updateProgressCommits, updateProgressProjects, updateStatus } from '../models/extraction/extractionDataService'
import { getGitLabCommits, getGitLabDiffList, getGitLabContentByCommitId, GitLabDiff, getGitLabProject } from './versionControlService'
import { updateSkillTree } from '../models/skill/skillDataService'
import saveProject from '../models/project/projectDataService'
import logger from '../init/initLogger'
import TreeNode from '../schema/treeNode'
import GitlabAPI from '../init/gitlabAPI'
import { DeveloperProjectMapType, DeveloperSkillMapType, ProgLangType, RankingType, SelectedProjectBranchesType, ProjectSkillMapType } from '../schema/appTypes'
import ProgLangModel from '../models/progLang/progLangModel'
import { getProgLangsByIds } from '../models/progLang/progLangDataService'
import config from '../config/skillHunter.config'
import { getOrCreateDeveloper } from '../models/developer/developerDataService'
import { toProgLangType } from '../controllers/progLangController'
import { getSumScoreForDeveloperProject, getSumScoreForDeveloperSkill, getSumScoreForProjectSkill } from '../models/extractionSkillFinding/extractionSkillFindingDataService'
import ExtractionSkillFindingModel from '../models/extractionSkillFinding/extractionSkillFindingModel'
import { DeveloperModel } from '../models/developer/developerModel'
import { SkillModel } from '../models/skill/skillModel'
import { ProjectModel } from '../models/project/projectModel'

const start = async (repoId: number, 
                     name: string,
                     projectsBranches: SelectedProjectBranchesType[], 
                     path: string, 
                     progLangIds: number[]): Promise<void> => {
    logger.info(`Extraction starting, repoId=[${repoId}], name=[${name}], branches=[${JSON.stringify(projectsBranches)}], path=[${path}], progLangIds=[${progLangIds}] ...`)
    let extractionId: number = -1

    try {
        extractionId = await saveExtraction(repoId, name, projectsBranches, path, progLangIds);
        await log('Extraction has started.', extractionId);

        const gitlabAPI: GitlabAPI = await GitlabAPI.createGitlapAPI(repoId)

        const progLangs: ProgLangModel[] = await getProgLangsByIds(progLangIds)

        // getting all the projects from repo + path and looping through them
        await log(`There are ${projectsBranches.length} Gitlab projects to process.`, extractionId);

        for (const [ind, projectBranches] of projectsBranches.entries()) {
            if ((await isCancelled(extractionId))) return
            await updateProgressProjects(extractionId, (ind+1), projectsBranches.length)

            let skillTree: TreeNode = new TreeNode(null, null, [], null)
            const gitlabProjectId = Number(projectBranches.projectId)

            await log(`Project [${ind+1} / ${projectsBranches.length}] - processing the '${projectBranches.branch}' branch of the '${projectBranches.projectName}' GitLab project...`, extractionId)

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

                        const [score, nrOfChangedLines]: number[] = calculateCumulatedScore(diff, foundProgLang.ignoringLinesPatterns)

                        // then the whole file conten (in specific revision) has to be retrieved to extract the imported packages which will be the skills                
                        const content: string = await getGitLabContentByCommitId(gitlabAPI, gitlabProjectId, diff.path, commit.id)
                        await populateSkillsFromContent(gitlabAPI, skillTree, content, score, nrOfChangedLines, diff.path, progLangs, gitlabProjectId, commit.id, developerId)
                    } else {
                        logger.debug(`The file [${diff.path}] does not belong to any of the selected prog lang(s), it will be ignored.`)
                    }
                }

                if (indCommit % config.appLoggingEveryXCommits === 0 && indCommit >= config.appLoggingEveryXCommits)
                    await log(`Processed [${indCommit} / ${commits.length}] commits.`, extractionId)
            }

            if ((await isCancelled(extractionId))) return
            await log(`Updating the Skill tree.`, extractionId)
            // save/update the skill tree in database and add the score to ExtractionSkillFindingModel
            await updateSkillTree(null, skillTree.children, projectId, extractionId)
        }
        await log('Extraction finished successfully.', extractionId)
        await updateStatus(extractionId, 'COMPLETED')
    } catch(err) {
        let errorMessage: string = JSON.stringify(err)
        if (err instanceof Error)
            logger.error(`${errorMessage} - ${err.stack}`)
        else
            logger.error(`${errorMessage} - ${err}`)            
        await log('Extraction failed! - ' + errorMessage, extractionId)
        await updateStatus(extractionId, 'FAILED')
    }
}

const buildDeveloperSkillMap = async (extractionId: number, resourceType: string, resourceId: number, skillLevel: number | null): Promise<DeveloperSkillMapType[]> => {
    const esfmList: ExtractionSkillFindingModel[] = await getSumScoreForDeveloperSkill(extractionId, resourceType, resourceId, skillLevel)
    
    const tempDeveloperSkillList = esfmList.map(rec => { return {
        developer: rec.dataValues['developerRef'] as DeveloperModel,
        skill: rec.dataValues['skillRef'] as SkillModel,
        score: rec.dataValues['score'],
        nrOfChangedLines: rec.dataValues['nrOfChangedLines'],
        ranking: JSON.parse(((rec.dataValues['skillRef'] as SkillModel).progLangRef as ProgLangModel).ranking)?.patternList ?? []
    }})

    return tempDeveloperSkillList.map(rec => {
        return {
            developerName: rec.developer.name,
            developerEmail: rec.developer.email,
            developerId: rec.developer.id,
            skillName: rec.skill.name,
            skillId: rec.skill.id,
            score: rec.score,
            ranking: getRanking(rec.score, rec.ranking, rec.developer.id, rec.skill.parentId, tempDeveloperSkillList),
            progLang: rec.skill.progLangRef.name,
            skillLocation: rec.skill.location,
            nrOfChangedLines: rec.nrOfChangedLines
        }
    })
}

const buildDeveloperProjectMap = async (extractionId: number, resourceType: string, resourceId: number): Promise<DeveloperProjectMapType[]> => {
    const esfmList: ExtractionSkillFindingModel[] = await getSumScoreForDeveloperProject(extractionId, resourceType, resourceId)
    
    const tempDeveloperSkillList = esfmList.map(rec => { return {
        developer: rec.dataValues['developerRef'] as DeveloperModel,
        project: rec.dataValues['projectRef'] as ProjectModel,
        score: rec.dataValues['score'],
        nrOfChangedLines: rec.dataValues['nrOfChangedLines']
    }})

    return tempDeveloperSkillList.map(rec => {
        return {
            developerName: rec.developer.name,
            developerEmail: rec.developer.email,
            developerId: rec.developer.id,
            projectName: rec.project.name,
            projectDesc: rec.project.desc,
            projectPath: rec.project.path,
            projectCreatedAt: rec.project.created_at,
            projectHttpUrlToRepo: rec.project.http_url_to_repo,
            projectId: rec.project.id,
            score: rec.score,
            nrOfChangedLines: rec.nrOfChangedLines
        }
    })
}

const buildProjectSkillMap = async (extractionId: number, resourceType: string, resourceId: number, skillLevel: number | null): Promise<ProjectSkillMapType[]> => {
    const esfmList: ExtractionSkillFindingModel[] = await getSumScoreForProjectSkill(extractionId, resourceType, resourceId, skillLevel)

    const tempProjectSkillList = esfmList.map(rec => { return {
        project: rec.dataValues['projectRef'] as ProjectModel,
        skill: rec.dataValues['skillRef'] as SkillModel,
        score: rec.dataValues['score'],
        nrOfChangedLines: rec.dataValues['nrOfChangedLines'],
        ranking: JSON.parse(((rec.dataValues['skillRef'] as SkillModel).progLangRef as ProgLangModel).ranking)?.patternList ?? []
    }})

    return tempProjectSkillList.map(rec => {
        return {
            projectId: rec.project.id,
            projectName: rec.project.name,
            projectDesc: rec.project.desc,
            projectPath: rec.project.path,
            projectCreatedAt: rec.project.created_at,
            projectHttpUrlToRepo: rec.project.http_url_to_repo,
            skillName: rec.skill.name,
            skillId: rec.skill.id,
            score: rec.score,
            ranking: getRanking(rec.score, rec.ranking, rec.project.id, rec.skill.parentId, tempProjectSkillList),
            progLang: rec.skill.progLangRef.name,
            skillLocation: rec.skill.location,
            nrOfChangedLines: rec.nrOfChangedLines
        }
    })
}

/*
- junit       1152        1152 / 22152 = 0.052
- spring     21000       21000 / 22152 = 0.948

on prog lang level:
master: 25000
medium: 10000
novice:     0

master level for spring: 25000 * 0.948 = 23700
master level for junit:  25000 * 0.052 = 1300
*/
// resourceId: developerId or projectId
const getRanking = (score: number, ranking: RankingType[], resourceId: number, skillParentId: number, tempList: any[]): string => {
    if (!ranking || ranking.length === 0) {
        return 'UNKNOWN'
    } else {
        const sumOfScoreOnThisLevel = tempList
            .filter(rec => (rec.developer ? rec.developer.id === resourceId : rec.project.id === resourceId) && ((!rec.skill.parentId && !skillParentId) || rec.skill.parentId === skillParentId))
            .reduce((n, { score }) => n + score, 0)

        // transforming the rankings from prog lang level to the specific skill level
        const transformedRanking = ranking.map(rec => { return {
            name: rec.name,
            rangeStart: score / sumOfScoreOnThisLevel * rec.rangeStart
        }})

        // finding which ranking has to be selected (which is not higher than the score -> the 1st element in the ranking array is the highest and so on...)
        return transformedRanking && transformedRanking.length > 0 ? transformedRanking.find(rec => rec.rangeStart <= score)!.name : 'UNKNOWN'
    }
}

const isCancelled = async (extractionId: number): Promise<boolean> => {
    if ((await queryExtractionById(extractionId)).status === 'CANCELLED') {
        logger.warn(`The extraction [${extractionId}] has been cancelled.`)
        await log(`The exctraction has been cancelled.`, extractionId);
        return true
    } else
        return false

}

export { start, buildDeveloperSkillMap, buildDeveloperProjectMap, buildProjectSkillMap }