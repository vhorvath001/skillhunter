import { Sequelize } from 'sequelize-typescript'
import { ScoreType } from '../../schema/treeNode'
import { saveExtractionSkillFindingModel } from './extractionSkillFindingDataService'
import ExtractionSkillFindingModel from './extractionSkillFindingModel'
import { ExtractionModel, ExtractionProgLangModel } from '../extraction/extractionModel'
import { SkillModel } from '../skill/skillModel'
import { ProjectModel } from '../project/projectModel'
import { DeveloperModel } from '../developer/developerModel'
import RepositoryModel from '../repository/repositoryModel'
import ProgLangModel from '../progLang/progLangModel'

beforeAll( async () => {
    const sequelize = new Sequelize('sqlite::memory:', {
        dialect: "sqlite",
        logging: console.log,
        logQueryParameters: true
    })
    sequelize.addModels([ ExtractionSkillFindingModel, ExtractionModel, SkillModel, ProjectModel, DeveloperModel, RepositoryModel, ExtractionProgLangModel, ProgLangModel ])
    await sequelize.sync()
})

afterEach(() => {
    jest.clearAllMocks()
})

// TODO the tests fail but there isn't any meaningful error message
describe('testing saveExtractionSkillFindingModel()', () => {

    test.skip('the ExtractionSkillFindingModel does not exist -> it will be created', async () => {
        const score: ScoreType[] = [
            { score: 12.34, developerId: 234 }
        ]
        const extractionId: number = 76834
        const skillId: number = 23789
        const projectId: number = 12345

        const spyExtractionSkillFindingModelFindAll = jest
            .spyOn(ExtractionSkillFindingModel, 'findAll')
            .mockReturnValueOnce(Promise.resolve([]))
        const spyExtractionSkillFindingModelCreate = jest
            .spyOn(ExtractionSkillFindingModel, 'create')

        await saveExtractionSkillFindingModel(score, extractionId, skillId, projectId)

        expect(spyExtractionSkillFindingModelFindAll).toHaveBeenCalledTimes(1)
        expect(spyExtractionSkillFindingModelFindAll).toHaveBeenCalledWith({
            where: { 
                extractionId: extractionId,
                skillId: skillId,
                projectId: projectId,
                developerId: score[0].developerId
            }
        })

        expect(spyExtractionSkillFindingModelCreate).toHaveBeenCalledTimes(1)
        expect(spyExtractionSkillFindingModelCreate).toHaveBeenCalledWith({
            score: score[0].score, 
            extractionId: extractionId, 
            skillId: skillId, 
            projectId: projectId,
            developerId: score[0].developerId
        })
    })

    test.skip('the ExtractionSkillFindingModel exists -> it will be updated', async () => {
        const score: ScoreType[] = [
            { score: 12.34, developerId: 234 }
        ]
        const extractionId: number = 76834
        const skillId: number = 23789
        const projectId: number = 12345

        const extractionSkillFindingModel: ExtractionSkillFindingModel = ExtractionSkillFindingModel.build({
            id: 992, score: 1.66, extractionId: extractionId, skillId: skillId, projectId: projectId, developerId: score[0].developerId
        })

        const spyExtractionSkillFindingModelFindAll = jest
            .spyOn(ExtractionSkillFindingModel, 'findAll')
            .mockReturnValueOnce(Promise.resolve([extractionSkillFindingModel]))
        const spyExtractionSkillFindingModelCreate = jest
            .spyOn(ExtractionSkillFindingModel, 'create')
        // const spyExtractionSkillFindingModelSave = jest
        //     .spyOn(ExtractionSkillFindingModel, 'save')

        await saveExtractionSkillFindingModel(score, extractionId, skillId, projectId)

        expect(spyExtractionSkillFindingModelFindAll).toHaveBeenCalledTimes(1)
        expect(spyExtractionSkillFindingModelFindAll).toHaveBeenCalledWith({
            where: { 
                extractionId: extractionId,
                skillId: skillId,
                projectId: projectId,
                developerId: score[0].developerId
            }
        })

        expect(spyExtractionSkillFindingModelCreate).toHaveBeenCalledTimes(0)
        expect(spyExtractionSkillFindingModelCreate).toHaveBeenCalledWith({
            score: score[0].score, 
            extractionId: extractionId, 
            skillId: skillId, 
            projectId: projectId,
            developerId: score[0].developerId
        })
        expect(extractionSkillFindingModel.score).toBe(14)
    })

})