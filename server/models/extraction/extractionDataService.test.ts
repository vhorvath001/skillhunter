import { Sequelize } from 'sequelize-typescript'
import RepositoryModel from '../repository/repositoryModel';
import { getExtractionModels, saveExtraction } from './extractionDataService'
import { ExtractionModel, ExtractionProgLangModel } from './extractionModel'
import { SelectedProjectBranchesType } from '../../schema/appTypes';
import ProgLangModel from '../progLang/progLangModel'
import { Op } from 'sequelize'

beforeAll( async () => {
    const sequelize = new Sequelize('sqlite::memory:', {
        logging: console.log
    })
    sequelize.addModels([ ExtractionModel, RepositoryModel, ExtractionProgLangModel, ProgLangModel ])
    await sequelize.sync()
})

afterEach(() => {
    jest.clearAllMocks()
})

describe('testing saveExtraction()', () => {

    test('checking if all the extraction data is saved correctly', async () => { 
        const repoId: number = 422;
        const path: string = '/acme';
        const progLangs: number[] = [1,2];
        const projectsBranches: SelectedProjectBranchesType[] = [
            { projectId: '11', projectName: 'acme-ui', branch: 'master' },
            { projectId: '54', projectName: 'acme-server', branch: 'release/8.34' }
        ]
        const extractionId: number = 0
    
        const spyExtractionModel = jest
            .spyOn(ExtractionModel, 'create')
            .mockImplementation(() => { return { id: extractionId }} )
    
        const spyExtractionProgLangModel = jest
            .spyOn(ExtractionProgLangModel, 'create')
            .mockImplementation(() => {})
    
        const result: number = await saveExtraction(repoId, projectsBranches, path, progLangs)
    
        expect(result).toBe(extractionId)
        expect(spyExtractionModel).toHaveBeenCalledTimes(1)
        expect(spyExtractionModel).toHaveBeenCalledWith({
            repositoryId: repoId,
            projectsBranches: JSON.stringify(projectsBranches),
            path: path,
            status: 'IN PROGRESS'
        })
    
        expect(spyExtractionProgLangModel).toHaveBeenCalledTimes(2);
        expect(spyExtractionProgLangModel).toHaveBeenNthCalledWith(1, {
            extractionId: extractionId,
            progLangId: progLangs[0]
        });
        expect(spyExtractionProgLangModel).toHaveBeenNthCalledWith(2, {
            extractionId: extractionId,
            progLangId: progLangs[1]
        })
    })

})

describe('testing getExtractionModels()', () => {

    test('when neither repoId nor status is passed', async () => {
        const dateFrom: Date = new Date()
        const dateTo: Date = new Date()

        const spyExtractionModel = jest
            .spyOn(ExtractionModel, 'findAll')

        await getExtractionModels(null, null, dateFrom, dateTo)

        expect(spyExtractionModel).toHaveBeenCalledTimes(1)
        expect(spyExtractionModel).toHaveBeenCalledWith({
            include: [ RepositoryModel, ProgLangModel ],
            where: { 
                startDate: {
                    [Op.between]: [dateFrom, dateTo]
                }
            }
        }, )
    })

    test('when only repoId is passed', async () => {
        const dateFrom: Date = new Date()
        const dateTo: Date = new Date()
        const repoId: number = 4

        const spyExtractionModel = jest
            .spyOn(ExtractionModel, 'findAll')

        await getExtractionModels(repoId, null, dateFrom, dateTo)

        expect(spyExtractionModel).toHaveBeenCalledTimes(1)
        expect(spyExtractionModel).toHaveBeenCalledWith({
            include: [ RepositoryModel, ProgLangModel ],
            where: { 
                startDate: {
                    [Op.between]: [dateFrom, dateTo]
                },
                'repositoryId': repoId
            }
        }, )
    })

    test('when only status is passed', async () => {
        const dateFrom: Date = new Date()
        const dateTo: Date = new Date()
        const status: string = 'COMPLETED'

        const spyExtractionModel = jest
            .spyOn(ExtractionModel, 'findAll')

        await getExtractionModels(null, status, dateFrom, dateTo)

        expect(spyExtractionModel).toHaveBeenCalledTimes(1)
        expect(spyExtractionModel).toHaveBeenCalledWith({
            include: [ RepositoryModel, ProgLangModel ],
            where: { 
                startDate: {
                    [Op.between]: [dateFrom, dateTo]
                },
                'status': status
            }
        }, )
    })

    test('when repoId and status are passed', async () => {
        const dateFrom: Date = new Date()
        const dateTo: Date = new Date()
        const status: string = 'COMPLETED'
        const repoId: number = 4

        const spyExtractionModel = jest
            .spyOn(ExtractionModel, 'findAll')

        await getExtractionModels(repoId, status, dateFrom, dateTo)

        expect(spyExtractionModel).toHaveBeenCalledTimes(1)
        expect(spyExtractionModel).toHaveBeenCalledWith({
            include: [ RepositoryModel, ProgLangModel ],
            where: { 
                startDate: {
                    [Op.between]: [dateFrom, dateTo]
                },
                'repositoryId': repoId,
                'status': status
            }
        }, )
    })

})