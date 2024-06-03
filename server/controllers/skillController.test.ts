import { Sequelize } from 'sequelize-typescript'
import { changeSkillsStatus, deleteSkills, getAllSkillsByProgLangAndParent } from '../models/skill/skillDataService'
import { SkillModel } from '../models/skill/skillModel'
import { getSkillTree, handleDelete, handleStatusChange } from './skillController'
import ProgLangModel from '../models/progLang/progLangModel'

jest.mock('../models/skill/skillDataService', () => {
    return {
        getAllSkillsByProgLangAndParent: jest.fn(),
        changeSkillsStatus: jest.fn(),
        deleteSkills: jest.fn()
    }
})

beforeAll(async () => {
    const sequelize = new Sequelize('sqlite::memory:', {
        logging: console.log
    })
    sequelize.addModels([SkillModel, ProgLangModel])
    await sequelize.sync()
})

afterEach(() => {
    jest.clearAllMocks()
})

describe('testing getSkillTree()', () => {

    test('successful - more levels', async () => {
        const req: any = {
            params: {
                progLangId: 7
            }
        }
        const resp: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        const mockedGetAllSkillsByProgLangAndParent: jest.Mock = getAllSkillsByProgLangAndParent as jest.Mock

        mockedGetAllSkillsByProgLangAndParent
            .mockReturnValueOnce([
                SkillModel.build({ id: 0, name: 'springframework', enabled: true })
            ])
            .mockReturnValueOnce([
                SkillModel.build({ id: 1, name: 'boot', enabled: true }),
                SkillModel.build({ id: 2, name: 'integration', enabled: true })
            ])
            .mockReturnValueOnce([
                SkillModel.build({ id: 3, name: 'spring-boot-starter-web', enabled: true }),
            ])
            .mockResolvedValue([])

        await getSkillTree(req, resp)

        expect(mockedGetAllSkillsByProgLangAndParent).toHaveBeenCalledTimes(5)
        expect(mockedGetAllSkillsByProgLangAndParent).toHaveBeenNthCalledWith(1, 7, null)
        expect(mockedGetAllSkillsByProgLangAndParent).toHaveBeenNthCalledWith(2, 7, 0)
        expect(mockedGetAllSkillsByProgLangAndParent).toHaveBeenNthCalledWith(3, 7, 1)
        expect(mockedGetAllSkillsByProgLangAndParent).toHaveBeenNthCalledWith(4, 7, 3)
        expect(mockedGetAllSkillsByProgLangAndParent).toHaveBeenNthCalledWith(5, 7, 2)

        expect(resp.status).toHaveBeenCalledWith(200)
        expect(resp.json).toHaveBeenCalledWith(
            [
                {
                    "enabled": true,
                    "id": 0,
                    "name": "springframework",
                    "children": [
                        {
                            "enabled": true,
                            "id": 1,
                            "name": "boot",
                            "children": [
                                {
                                    "children": [],
                                    "enabled": true,
                                    "id": 3,
                                    "name": "spring-boot-starter-web"
                                }
                            ]
                        },
                        {
                            "children": [],
                            "enabled": true,
                            "id": 2,
                            "name": "integration"
                        }
                    ]
                }
            ]
        )
    })

    test('successful - no result', async () => {
        const req: any = {
            params: {
                progLangId: 7
            }
        }
        const resp: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        const mockedGetAllSkillsByProgLangAndParent: jest.Mock = getAllSkillsByProgLangAndParent as jest.Mock

        mockedGetAllSkillsByProgLangAndParent.mockResolvedValue([])

        await getSkillTree(req, resp)

        expect(mockedGetAllSkillsByProgLangAndParent).toHaveBeenCalledTimes(1)
        expect(mockedGetAllSkillsByProgLangAndParent).toHaveBeenNthCalledWith(1, 7, null)

        expect(resp.status).toHaveBeenCalledWith(200)
        expect(resp.json).toHaveBeenCalledWith([])
    })

})

describe('testing handleStatusChange()', () => {

    test('successful', async () => {
        const mockedChangeSkillsStatus: jest.Mock = changeSkillsStatus as jest.Mock

        const req: any = {
            body: {
                ids: [7, 34],
                status: 'FAILED'
            }
        }
        const resp: any = {
            sendStatus: jest.fn().mockReturnThis()
        }

        await handleStatusChange(req, resp)

        expect(mockedChangeSkillsStatus).toHaveBeenCalledTimes(1)
        expect(mockedChangeSkillsStatus).toHaveBeenCalledWith([7, 34], 'FAILED')
        expect(resp.sendStatus).toHaveBeenCalledWith(200)
    })
})

describe('testing handleDelete()', () => {

    test('successful', async () => {
        const mockedDeleteSkills: jest.Mock = deleteSkills as jest.Mock

        const req: any = {
            body: {
                ids: [7, 34]
            }
        }
        const resp: any = {
            sendStatus: jest.fn().mockReturnThis()
        }

        await handleDelete(req, resp)

        expect(mockedDeleteSkills).toHaveBeenCalledTimes(1)
        expect(mockedDeleteSkills).toHaveBeenCalledWith([7, 34])
        expect(resp.sendStatus).toHaveBeenCalledWith(200)
    })
})