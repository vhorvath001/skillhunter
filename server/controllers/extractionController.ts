import { Request, Response } from 'express'
import { buildDeveloperSkillMap, start } from '../services/extractionService'
import logger from '../init/initLogger'
import { parseISO } from 'date-fns'
import { deleteExtractionById, getExtractionModels } from '../models/extraction/extractionDataService'
import { ExtractionModel } from '../models/extraction/extractionModel'
import { DeveloperSkillMapType, DevelopersScoresType, ExtractionType, ProgLangType, ProgressLogType, SelectedProjectBranchesType } from '../schema/appTypes'
import { toProgLangType } from './progLangController'
import { toRepositoryType } from './repositoryController'
import { getErrorMessage, logError } from './commonFunctions'
import ProgressLogModel from '../models/progressLog/progressLogModel'
import { getProgressLogsByExtractionId } from '../models/progressLog/progressLogDataService'
import { queryDevelopersScoresBySkillId } from '../models/extractionSkillFinding/extractionSkillFindingDataService'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* 
incoming body values:
   * repoId: the DB id of the repository
   * path: what to analyse inside the repo specified above (e.g. '/cqs')
   * progLangs: the DB ids of programming languages to examine in GitLab projects
   * branches: which GitLab branch has to be processed per projects
        it contains all the GitLab projects (it contains the GitLab project id) and for each project the GitLab branch is specified which is used to get the commits, ...
        { '464': 'release/1.22.1', '450': 'master, ... }
*/
export const extract = async (req: Request, resp: Response): Promise<void> => {
    // checking the mandatory elements
    logger.info(`Request has arrived to start a repository extraction.`)

    let errorMessage: string | null = null
    if (!req?.body?.repoId || isNaN(Number(req.body.repoId)))
        errorMessage = 'Repository ID is not provided or invalid.'
    else if (!req?.body?.path) 
        errorMessage = 'Path is not provided.'
    else if (!req?.body?.progLangs) 
        errorMessage = 'Programming langague array is not provided.'
    else if (!req?.body?.projectsBranches) 
        errorMessage = 'The project - branch assignments are not provided.'
    
    if (errorMessage) {
        logger.error(`Invalid query parameter! - ${errorMessage}`)
        resp.status(422).json({ 'message': errorMessage })  // Unprocessable Entity
    } else {
        start(Number(req.body.repoId), 
              req.body.projectsBranches as SelectedProjectBranchesType[], 
              req.body.path as string, 
              req.body.progLangs as number[])

        resp.sendStatus(201)
    }
}

export const getExtractions = async (req: Request, resp: Response): Promise<void> => {
    logger.info(`Request has arrived to get extractions. - ${JSON.stringify(req.query)}`)

    try {
        const repoId: number | null = Number(req.query.repoId as string) === -1 ? null : Number(req.query.repoId as string)
        const dateTo: string = req.query.dateTo as string
        const dateFrom: string = req.query.dateFrom as string
        const status: string | null = req.query.status as string === '-1' ? null : req.query.status as string

        const extractionModels: ExtractionModel[] = await getExtractionModels(repoId, status, parseISO(dateFrom), parseISO(dateTo))
        const extractions: ExtractionType[] = extractionModels.map(m => toExtractionType(m))

        resp.status(200).json(extractions)
    } catch(err) {
        logError(err, `Error occurred when executing 'getBranchesPerProjects'.`)
        resp.status(500).send({'message': `Error occurred when trying to get branches of projects! - ${getErrorMessage(err)}`})
    }
}

export const deleteExtraction = async (req: Request, resp: Response): Promise<void> => {
    logger.info(`Request has arrived to delete an extraction. - ${req.params.id}`)

    try {
        const extractionId: number  = Number(req.params.id as string)

        const successful: boolean = await deleteExtractionById(extractionId)
        if (successful)
            resp.sendStatus(200)
        else 
            resp.status(404).send({'message': `The extraction [${extractionId}] cannot be found in database!`})
    } catch(err) {
        logError(err, `Error occurred when executing 'deleteExtraction'.`)
        resp.status(500).send({'message': `Error occurred when trying to delete an extraction! - ${getErrorMessage(err)}`})
    }
}

export const getProgressLogs = async (req: Request, resp: Response): Promise<void> => {
    logger.info(`Request has arrived to get the progress logs of extraction  - ${JSON.stringify(req.params)}.`)

    try {
        const extractionId: number = Number(req.params.id as string)

        const progressLogModels: ProgressLogModel[] = await getProgressLogsByExtractionId(extractionId)
        const progressLogs: ProgressLogType[] = progressLogModels.map(pl => toProgressLogType(pl))

        resp.status(200).json(progressLogs)
    } catch(err) {
        logError(err, `Error occurred when executing 'getProgressLogs'.`)
        resp.status(500).send({'message': `Error occurred when trying to get the progress logs of extraction! - ${getErrorMessage(err)}`})
    }
}

export const getDevelopersScoresBySkill = async (req: Request, resp: Response): Promise<void> => {
    logger.info(`Request has arrived to get the scores of developers by a skill  - ${JSON.stringify(req.params)}.`)

    try {
        const extractionId: number = Number(req.params.id as string)
        const skillId: number = Number(req.params.skillId)

        const rawDevelopersScores: any[] = await queryDevelopersScoresBySkillId(extractionId, skillId)

        resp.status(200).json(toDevelopersScoresType(rawDevelopersScores))
    } catch(err) {
        logError(err, `Error occurred when executing 'getDevelopersScoresBySkill'.`)
        resp.status(500).send({'message': `Error occurred when trying to get the scores of developers by a skill! - ${getErrorMessage(err)}`})
    }
}

export const getDeveloperSkillMap = async (req: Request, resp: Response): Promise<void> => {
    logger.info(`Request has arrived to get the developer-skill map  - ${JSON.stringify(req.params)}.`)

    try {
        const extractionId: number = Number(req.params.id as string)
        const resourceType: string = req.params.resourceType
        const resourceId: number = Number(req.params.resourceId)

        const developerSkillMap: DeveloperSkillMapType[] = await buildDeveloperSkillMap(extractionId, resourceType, resourceId)

        resp.status(200).json(developerSkillMap)
    } catch(err) {
        logError(err, `Error occurred when executing 'getDeveloperSkillMap'.`)
        resp.status(500).send({'message': `Error occurred when trying to get the developer-skill map! - ${getErrorMessage(err)}`})
    }
}

export const toExtractionType = (model: ExtractionModel): ExtractionType => {
    const progLangs: ProgLangType[] | undefined = model.progLangs?.map(m => toProgLangType(m))

    return {
        id: model.id,
        startDate: model.startDate,
        projectsBranches: model.projectsBranches ? JSON.parse(model.projectsBranches) : [],
        path: model.path,
        status: model.status,
        progressProjects: model.progressProjects,
        progressCommits: model.progressCommits,
        repository: toRepositoryType(model.repositoryRef),
        progLangs: progLangs ?? []
    }
}

const toProgressLogType = (model: ProgressLogModel): ProgressLogType => {
    return {
        timestamp: model.timestamp,
        logText: model.logText
    }
}

// // [{"developerId":4,"totalScore":117641.14646024398,"developerRef":{"name":"Ric Flair"}}]
const toDevelopersScoresType = (rawDevelopersScores: any[]): DevelopersScoresType[] => {
    return rawDevelopersScores.map(r => {
        return {
            developerId: r.developerId,
            totalScore: r.score,
            developerName: r.developerRef.name,
        } as DevelopersScoresType
    })
}