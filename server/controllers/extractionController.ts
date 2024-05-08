import { Request, Response } from 'express'
import { start } from '../services/extractionService'
import logger from '../init/initLogger'
import { parseISO } from 'date-fns'
import { getExtractionModels } from '../models/extraction/extractionDataService'
import { ExtractionModel } from '../models/extraction/extractionModel'
import { ExtractionType, ProgLangType } from '../schema/appTypes'
import { toProgLangType } from './progLangController'
import { toRepositoryType } from './repositoryController'
import { getErrorMessage, logError } from './commonFunctions'

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

    if (!req?.body?.repoId || typeof req.body.repoId !== 'number')
        resp.status(422).json({ 'message': 'Repository ID is not provided or invalid.' })  // Unprocessable Entity
    else if (!req?.body?.path) 
        resp.status(422).json({ 'message': 'Path is not provided.' });
    else if (!req?.body?.progLangs) 
        resp.status(422).json({ 'message': 'Programming langague array is not provided.' });
    else if (!req?.body?.branches) 
        resp.status(422).json({ 'message': 'The project - branch assignments are not provided.' });
    else {
        const errorMessage: string | null = await start(Number(req.body.repoId), 
            req.body.branches as Object, 
            req.body.path as string, 
            req.body.progLangs as number[])

        if (errorMessage) resp.status(500).send({'message': `Error occurred when trying to start an extraction! - ${errorMessage}`})
        else resp.sendStatus(201)
    }
}

export const getExtractions = async (req: Request, resp: Response): Promise<void> => {
    logger.info(`Request has arrived to get extractions. - ${JSON.stringify(req.query)}`)

    try {
        const repoId: number = Number(req.query.repoId as string)
        const dateTo: string = req.query.dateTo as string
        const dateFrom: string = req.query.dateFrom as string
        const status: string = req.query.status as string

        const extractionModels: ExtractionModel[] = await getExtractionModels(repoId, status, parseISO(dateFrom), parseISO(dateTo))
        const extractions: ExtractionType[] = extractionModels.map(m => toExtractionType(m))

        // const extractions: ExtractionType[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(i => { return {
        //     id: i,
        //     startDate: new Date(),
        //     branches: ['release/1.'+i, 'release/2.'+i],
        //     path: 'path'+i,
        //     status: i % 3 === 0 ? 'COMPLETED' : i % 3 === 1 ? 'FAILED' : 'IN PROGRESS',
        //     repository: {
        //         id: i,
        //         name: 'repo'+i,
        //         desc: 'desc'+i,
        //         url: 'url'+i,
        //         token: 'repositoryModel.token'+i
        //     },
        //     progLangs: [{
        //         id: 1,
        //         name: 'Java',
        //         sourceFiles: '*.java',
        //         level: 2,
        //         removingTLDPackages: true,
        //         patterns: ['import .*;'],
        //         scope: 'EVERYWHERE'
        //     }]
        // }})

        resp.status(200).json(extractions)
    } catch(err) {
        logError(err, `Error occurred when executing 'getBranchesPerProjects'.`)
        resp.status(500).send({'message': `Error occurred when trying to get branches of projects! - ${getErrorMessage(err)}`})
    }


}    

const toExtractionType = (model: ExtractionModel): ExtractionType => {
    const progLangs: ProgLangType[] | undefined = model.progLangs?.map(m => toProgLangType(m))

    return {
        id: model.id,
        startDate: model.startDate,
        branches: JSON.parse(model.branches),
        path: model.path,
        status: model.status,
        repository: toRepositoryType(model.repositoryRef),
        progLangs: progLangs ?? []
    }
}

