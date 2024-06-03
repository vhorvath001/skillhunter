import { deleteExtraction, extract, getExtractions, toExtractionType } from './extractionController'
import { start } from '../services/extractionService'
import { SelectedProjectBranchesType } from '../schema/appTypes';
import { deleteExtractionById, getExtractionModels } from '../models/extraction/extractionDataService';
import { ExtractionModel, ExtractionProgLangModel } from '../models/extraction/extractionModel';
import { parseISO } from 'date-fns';
import { Sequelize } from 'sequelize-typescript'
import RepositoryModel from '../models/repository/repositoryModel';
import ProgLangModel from '../models/progLang/progLangModel';

// https://stackoverflow.com/a/69579630/1269572
jest.mock('../services/extractionService', () => { return {
    start: jest.fn()
}})
jest.mock('../models/extraction/extractionDataService', () => { return {
    getExtractionModels: jest.fn(),
    deleteExtractionById: jest.fn()
}})

beforeAll( async () => {
    const sequelize = new Sequelize('sqlite::memory:', {
        logging: console.log
    })
    sequelize.addModels([ ExtractionModel, RepositoryModel, ExtractionProgLangModel, ProgLangModel ])
    await sequelize.sync()
})

afterEach(() => {
    jest.clearAllMocks();
})

describe('testing extract()', () => {
    
    test('test extraction controller - every params are passed', async () => {
        const projectsBranches: SelectedProjectBranchesType[] = [{
            'projectId': '666',
            'projectName': 'acem-service',
            'branch': 'release/2.1'
        }]

        const req: any = {
            body: {
                repoId: 422,
                path: '/acme',
                progLangs: [1,2],
                projectsBranches: projectsBranches
            }
        };
        const resp: any = {
            sendStatus: jest.fn().mockReturnThis()
        };

        await extract(req, resp);

        expect(resp.sendStatus).toHaveBeenCalledWith(201);
        expect(start).toHaveBeenCalledTimes(1);
        expect(start).toHaveBeenCalledWith(
            422, 
            projectsBranches, 
            '/acme', 
            [1, 2])
    })

    test('test extraction controller - repoId is NOT passed', async () => {
        const req: any = {
            body: {
                path: '/acme',
                progLangs: [1,2],
                projectsBranches: []
            }
        };
        const resp: any = {
            status: jest.fn().mockReturnThis(), 
            json: jest.fn().mockReturnThis(),
        };

        await extract(req, resp);

        expect(resp.status).toHaveBeenCalledWith(422);
        expect(resp.json).toHaveBeenCalledWith({ 'message': 'Repository ID is not provided or invalid.' });
        expect(start).toHaveBeenCalledTimes(0);
    })

    test('test extraction controller - repoId is invalid', async () => {
        const req: any = {
            body: {
                repoId: 'aa',
                path: '/acme',
                progLangs: [1,2],
                projectsBranches: []
            }
        };
        const resp: any = {
            status: jest.fn().mockReturnThis(), 
            json: jest.fn().mockReturnThis(),
        };

        await extract(req, resp);

        expect(resp.status).toHaveBeenCalledWith(422);
        expect(resp.json).toHaveBeenCalledWith({ 'message': 'Repository ID is not provided or invalid.' });
        expect(start).toHaveBeenCalledTimes(0);
    })

    test('test extraction controller - path is NOT passed', async () => {
        const req: any = {
            body: {
                repoId: 422,
                progLangs: [1,2],
                projectsBranches: []
            }
        };
        const resp: any = {
            status: jest.fn().mockReturnThis(), 
            json: jest.fn().mockReturnThis(),
        };

        await extract(req, resp);

        expect(resp.status).toHaveBeenCalledWith(422);
        expect(resp.json).toHaveBeenCalledWith({ 'message': 'Path is not provided.' });
        expect(start).toHaveBeenCalledTimes(0);
    })

    test('test extraction controller - progLangs are NOT passed', async () => {
        const req: any = {
            body: {
                repoId: 422,
                path: '/acme',
                projectsBranches: []
            }
        };
        const resp: any = {
            status: jest.fn().mockReturnThis(), 
            json: jest.fn().mockReturnThis(),
        };

        await extract(req, resp);

        expect(resp.status).toHaveBeenCalledWith(422);
        expect(resp.json).toHaveBeenCalledWith({ 'message': 'Programming langague array is not provided.' });
        expect(start).toHaveBeenCalledTimes(0);
    })

    test('test extraction controller - projectsBranches are NOT passed', async () => {
        const req: any = {
            body: {
                repoId: 422,
                path: '/acme',
                progLangs: [1,2]
            }
        };
        const resp: any = {
            status: jest.fn().mockReturnThis(), 
            json: jest.fn().mockReturnThis(),
        };

        await extract(req, resp);

        expect(resp.status).toHaveBeenCalledWith(422);
        expect(resp.json).toHaveBeenCalledWith({ 'message': 'The project - branch assignments are not provided.' });
        expect(start).toHaveBeenCalledTimes(0);
    })
})


describe('testing getExtractions()', () => {
    
    test('successful', async () => {
        const dateTo: string = '2024-05-29T12:34:37Z'
        const dateFrom: string = '2024-05-29T12:35:37Z'
        const date: Date = new Date()
        const req: any = {
            query: {
                repoId: '422',
                dateTo: dateTo,
                dateFrom: dateFrom,
                status: '-1'
            }
        }
        const resp: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        const mockedGetExtractionModels: jest.Mock = getExtractionModels as jest.Mock

        const em: ExtractionModel = ExtractionModel.build({
            id: 0,
            startDate: date,
            projectsBranches: '[{"projectId":"1","projectName":"acme","branch":"master"}]',
            path: '/',
            status: 'COMPLETED',
            repositoryId: 0,
        })
        em.repositoryRef = RepositoryModel.build({
            id: 12,
            name: 'repo0',
            desc: 'desc0',
            host: 'host',
            token: 'token'
        })
        em.progLangs = [
            ProgLangModel.build({
                id: 0,
                name: 'Java',
                sourceFiles: '*.java',
                level: 3,
                pattern: '.*',
                scopePattern: 'EVERYWHERE',
                removingTLDPackages: true
            }),
            ProgLangModel.build({
                id: 1,
                name: 'Python',
                sourceFiles: '*.py',
                level: 1,
                pattern: '.*',
                scopePattern: 'EVERYWHERE',
                removingTLDPackages: true
            }),
        ]
        mockedGetExtractionModels.mockResolvedValueOnce([em])

        await getExtractions(req, resp)

        expect(resp.status).toHaveBeenCalledWith(200)
        expect(resp.json).toHaveBeenCalledWith([toExtractionType(em)])
        expect(mockedGetExtractionModels).toHaveBeenCalledTimes(1)
        expect(mockedGetExtractionModels).toHaveBeenCalledWith(422, null, parseISO(dateFrom), parseISO(dateTo))
    })

})

describe('testing deleteExtraction', () => {

    test('successful', async () => {
        const req: any = {
            params: {
                id: '12'
            }
        }
        const resp: any = {
            status: jest.fn().mockReturnThis(),
            sendStatus: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        const mockedDeleteExtractionById: jest.Mock = deleteExtractionById as jest.Mock

        mockedDeleteExtractionById.mockReturnValueOnce(true)

        await deleteExtraction(req, resp)

        expect(resp.sendStatus).toHaveBeenCalledWith(200)
        expect(mockedDeleteExtractionById).toHaveBeenCalledTimes(1)
        expect(mockedDeleteExtractionById).toHaveBeenCalledWith(12)
    })

    test('404', async () => {
        const req: any = {
            params: {
                id: '12'
            }
        }
        const resp: any = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        const mockedDeleteExtractionById: jest.Mock = deleteExtractionById as jest.Mock

        mockedDeleteExtractionById.mockReturnValueOnce(false)

        await deleteExtraction(req, resp)

        expect(resp.status).toHaveBeenCalledWith(404)
        expect(resp.send).toHaveBeenCalledWith({ 'message': 'The extraction [12] cannot be found in database!' })
        expect(mockedDeleteExtractionById).toHaveBeenCalledTimes(1)
        expect(mockedDeleteExtractionById).toHaveBeenCalledWith(12)
    })
})