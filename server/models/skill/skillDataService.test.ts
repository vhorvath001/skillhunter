import { Sequelize } from 'sequelize-typescript'
import ProgLangModel from '../progLang/progLangModel'
import { updateSkillTree } from './skillDataService'
import { SkillModel } from './skillModel'
import { ExtractionModel, ExtractionProgLangModel } from '../extraction/extractionModel'
import RepositoryModel from '../repository/repositoryModel'
import { saveExtractionSkillFindingModel } from '../extractionSkillFinding/extractionSkillFindingDataService'
import TreeNode from '../../schema/treeNode'

jest.mock('../extractionSkillFinding/extractionSkillFindingDataService', () => { return {
    saveExtractionSkillFindingModel: jest.fn()
}});

const projectId: number = 43
const extractionId: number = 734
const progLangId: number = 753
let progLangModel: ProgLangModel

beforeAll(async () => {
    const sequelize = new Sequelize('sqlite::memory:', {
        logging: console.log
    })
    sequelize.addModels([ ProgLangModel, ExtractionModel , RepositoryModel, SkillModel, ExtractionProgLangModel ])
    await sequelize.sync()

    progLangModel = ProgLangModel.build({
        id: progLangId,
        name: '-', sourceFiles: '-', patterns: '-', scopePattern: '-', removingTLDPackages: false
    })
})


afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
});

test.only('testing to update the skill tree - no skill in the database yet', async () => {
    const skillTree: TreeNode[] = buildSkillTree(progLangId)

    const springframeworkModel: SkillModel = SkillModel.build({
        id:35, name: 'springframework', progLangRef: progLangModel, enabled: true
    })

    const spySkillModelFindAll = jest
        .spyOn(SkillModel, 'findAll')
        .mockReturnValueOnce(Promise.resolve([]))
        .mockReturnValueOnce(Promise.resolve([]))

    const spySkillModelCreate = jest
        .spyOn(SkillModel, 'create')
        .mockReturnValueOnce(SkillModel.build({
            id:34, name: 'projectlombok', progLangRef: progLangModel, enabled: true
        })) // returning the saved 'projectlombok' skill
        .mockReturnValueOnce(springframeworkModel) // returning the saved 'springframework' skill
        .mockReturnValueOnce(SkillModel.build({
            id:36, name: 'boot', progLangRef: progLangModel, enabled: true
        })) // returning the saved 'boot' skill
        .mockReturnValueOnce(SkillModel.build({
            id:37, name: 'security', progLangRef: progLangModel, enabled: true
        })) // returning the saved 'security' skill

    await updateSkillTree(null, skillTree, projectId, extractionId)

    expect(spySkillModelCreate).toHaveBeenCalledTimes(4)
    expect(saveExtractionSkillFindingModel).toHaveBeenCalledTimes(4)
    // expectation at 'projectlombok'
    expect(spySkillModelCreate).toHaveBeenNthCalledWith(1, {
        name: 'projectlombok',
        enabled: true,
        parentId: null,
        progLangId: progLangId
    }, expect.anything())
    expect(saveExtractionSkillFindingModel).toHaveBeenNthCalledWith(1, [
        { score: 3.0, developerId: 34 },
        { score: 23.45, developerId: 35 }
    ], extractionId, 34, projectId)
    // expectation at 'springframework'
    expect(spySkillModelCreate).toHaveBeenNthCalledWith(2, {
        name: 'springframework',
        enabled: true,
        parentId: null,
        progLangId: progLangId
    }, expect.anything())
    expect(saveExtractionSkillFindingModel).toHaveBeenNthCalledWith(2, [
        { score: 8.1, developerId: 34 },
        { score: 7.9, developerId: 35 }], extractionId, 35, projectId)
    // expectation at 'boot'
    expect(spySkillModelCreate).toHaveBeenNthCalledWith(3, {
        name: 'boot',
        enabled: true,
        parentId: 35,
        progLangId: progLangId
    }, expect.anything())
    expect(saveExtractionSkillFindingModel).toHaveBeenNthCalledWith(3, [
        { score: 2.1, developerId: 34 }
    ], extractionId, 36, projectId)
    // expectation at 'security'
    expect(spySkillModelCreate).toHaveBeenNthCalledWith(4, {
        name: 'security',
        enabled: true,
        parentId: 35,
        progLangId: progLangId
    }, expect.anything())
    expect(saveExtractionSkillFindingModel).toHaveBeenNthCalledWith(4, [
        { score: 6.1, developerId: 34 }
    ], extractionId, 37, projectId)
})

test('testing to update the skill tree - there is one matching skill in the database already', async () => {
    const skillTree: TreeNode[] = buildSkillTree(progLangId)

    const springframeworkModel: SkillModel = await SkillModel.create({
        id: 35, name: 'springframework', progLangRef: progLangModel, enabled: true
    }, {
        include: ProgLangModel
    })

    const spySkillModelFindAll = jest
        .spyOn(SkillModel, 'findAll')
        .mockReturnValueOnce(Promise.resolve([springframeworkModel]))
        .mockReturnValueOnce(Promise.resolve([]))

    const spySkillModelCreate = jest
        .spyOn(SkillModel, 'create')
        .mockReturnValueOnce(SkillModel.build({
            id:34, name: 'projectlombok', progLangRef: progLangModel, enabled: true
        })) // returning the saved 'projectlombok' skill
        .mockReturnValueOnce(SkillModel.build({
            id:36, name: 'boot', progLangRef: progLangModel, enabled: true
        })) // returning the saved 'boot' skill
        .mockReturnValueOnce(SkillModel.build({
            id:37, name: 'security', progLangRef: progLangModel, enabled: true
        })) // returning the saved 'security' skill

    await updateSkillTree(null, skillTree, projectId, extractionId)

    expect(spySkillModelCreate).toHaveBeenCalledTimes(3)
    expect(saveExtractionSkillFindingModel).toHaveBeenCalledTimes(4)
    // expectation at 'projectlombok'
    expect(spySkillModelCreate).toHaveBeenNthCalledWith(1, {
        name: 'projectlombok',
        enabled: true,
        parentRef: undefined,
        progLangRef: progLangModel
    }, expect.anything())
    expect(saveExtractionSkillFindingModel).toHaveBeenNthCalledWith(1, 13.3, extractionId, 34, projectId)
    // expectation at 'springframework'
    expect(saveExtractionSkillFindingModel).toHaveBeenNthCalledWith(2, 10, extractionId, 35, projectId)
    // expectation at 'boot'
    expect(spySkillModelCreate).toHaveBeenNthCalledWith(2, {
        name: 'boot',
        enabled: true,
        parentRef: springframeworkModel,
        progLangRef: progLangModel
    }, expect.anything())
    expect(saveExtractionSkillFindingModel).toHaveBeenNthCalledWith(3, 11.1, extractionId, 36, projectId)
    // expectation at 'security'
    expect(spySkillModelCreate).toHaveBeenNthCalledWith(3, {
        name: 'security',
        enabled: true, 
        parentRef: springframeworkModel,
        progLangRef: progLangModel
    }, expect.anything())
    expect(saveExtractionSkillFindingModel).toHaveBeenNthCalledWith(4, 12.2, extractionId, 37, projectId)
})

const buildSkillTree = (progLangId: number): TreeNode[] => {
    //  projectlombok
    //  springframework
    //      boot
    //      security
    const springframeworkNode = new TreeNode('springframework', null, [
        { score: 8.1, developerId: 34 },
        { score: 7.9, developerId: 35 }], progLangId)
    const bootNode = new TreeNode('boot', springframeworkNode, [
        { score: 2.1, developerId: 34 }
    ], progLangId)
    const securityNode = new TreeNode('security', springframeworkNode, [
        { score: 6.1, developerId: 34 }
    ], progLangId)
    
    const projectlombokNode = new TreeNode('projectlombok', null, [
        { score: 3.0, developerId: 34 },
        { score: 23.45, developerId: 35 }
    ], progLangId)

    return [projectlombokNode, springframeworkNode]
}
