import { Sequelize } from 'sequelize-typescript'
import { DeveloperModel } from '../models/developer/developerModel'
import { deleteDeveloperById, getAllDevelopersOrderByName, getDeveloperById, updateDeveloperById } from '../models/developer/developerDataService'
import { deleteDeveloper, editExistingDeveloper, getAllDevelopers, toDeveloperModel, toDeveloperType } from './developerController'
import { DeveloperType } from '../schema/appTypes'

jest.mock('../models/developer/developerDataService', () => { return {
    getAllDevelopersOrderByName: jest.fn(),
    getDeveloperById: jest.fn(),
    deleteDeveloperById: jest.fn(),
    updateDeveloperById: jest.fn()
}})

beforeAll( async () => {
    const sequelize = new Sequelize('sqlite::memory:', {
        logging: console.log
    })
    sequelize.addModels([ DeveloperModel ])
    await sequelize.sync()
})

afterEach(() => {
    jest.clearAllMocks()
})

describe('testing getAllDevelopers()', () => {

    test('successful', async () => {
        const developerModels: DeveloperModel[] = [
            DeveloperModel.build({
                id: 0, name: 'n0', email: 'e0'
            }),
            DeveloperModel.build({
                id: 1, name: 'n1', email: 'e1'
            })
        ]

        const mockedGetAllDevelopersOrderByName: jest.Mock = getAllDevelopersOrderByName as jest.Mock

        mockedGetAllDevelopersOrderByName.mockReturnValueOnce(developerModels)

        const req: any = {}
        const resp: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        await getAllDevelopers(req, resp)

        expect(mockedGetAllDevelopersOrderByName).toHaveBeenCalledTimes(1)
        expect(resp.status).toHaveBeenCalledWith(200)
        expect(resp.json).toHaveBeenCalledWith(developerModels.map(m => toDeveloperType(m)))
    })
})

describe('testing deleteDeveloper()', () => {

    test('successful', async () => {
        const developerModel: DeveloperModel = DeveloperModel.build({
            id: 15, name: 'n0', email: 'e0'
        })

        const mockedGetDeveloperById: jest.Mock = getDeveloperById as jest.Mock
        const mockedDeleteDeveloperById: jest.Mock = deleteDeveloperById as jest.Mock

        mockedGetDeveloperById.mockReturnValueOnce(developerModel)

        const req: any = {
            params: {
                id: 15
            }
        }
        const resp: any = {
            sendStatus: jest.fn().mockReturnThis()
        }

        await deleteDeveloper(req, resp)

        expect(mockedGetDeveloperById).toHaveBeenCalledTimes(1)
        expect(mockedGetDeveloperById).toHaveBeenCalledWith(15)
        expect(mockedDeleteDeveloperById).toHaveBeenCalledTimes(1)
        expect(mockedDeleteDeveloperById).toHaveBeenCalledWith(15)
        expect(resp.sendStatus).toHaveBeenCalledWith(200)
    })

    test('404', async () => {
        const developerModel: DeveloperModel = DeveloperModel.build({
            id: 15, name: 'n0', email: 'e0'
        })

        const mockedGetDeveloperById: jest.Mock = getDeveloperById as jest.Mock
        const mockedDeleteDeveloperById: jest.Mock = deleteDeveloperById as jest.Mock

        mockedGetDeveloperById.mockReturnValueOnce(null)

        const req: any = {
            params: {
                id: 15
            }
        }
        const resp: any = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        }

        await deleteDeveloper(req, resp)

        expect(mockedGetDeveloperById).toHaveBeenCalledTimes(1)
        expect(mockedGetDeveloperById).toHaveBeenCalledWith(15)
        expect(mockedDeleteDeveloperById).toHaveBeenCalledTimes(0)
        expect(resp.status).toHaveBeenCalledWith(404)
        expect(resp.send).toHaveBeenCalledWith({'message': `The developer [15] cannot be found in database!`})
    })
})

describe('testing editExistingDeveloper()', () => {

    test('successful', async () => {
        const mockedUpdateDeveloperById: jest.Mock = updateDeveloperById as jest.Mock

        mockedUpdateDeveloperById.mockReturnValueOnce([1])

        const developer: DeveloperType = {
            id: 3, name: 'n0', 'email': 'e0'
        }
        const req: any = {
            body: {
                developer
            },
            params: {
                id: 3
            }
        }
        const resp: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        }

        await editExistingDeveloper(req, resp)

        expect(mockedUpdateDeveloperById).toHaveBeenCalledTimes(1)
        expect(mockedUpdateDeveloperById).toHaveBeenCalledWith(expect.any(DeveloperModel), 3)
        expect(resp.status).toHaveBeenCalledWith(201)
    })

    test('404', async () => {
        const mockedUpdateDeveloperById: jest.Mock = updateDeveloperById as jest.Mock

        mockedUpdateDeveloperById.mockReturnValueOnce([0])

        const developer: DeveloperType = {
            id: 3, name: 'n0', 'email': 'e0'
        }
        const req: any = {
            body: {
                developer
            },
            params: {
                id: 3
            }
        }
        const resp: any = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        }

        await editExistingDeveloper(req, resp)

        expect(mockedUpdateDeveloperById).toHaveBeenCalledTimes(1)
        expect(mockedUpdateDeveloperById).toHaveBeenCalledWith(expect.any(DeveloperModel), 3)
        expect(resp.status).toHaveBeenCalledWith(404)
        expect(resp.send).toHaveBeenCalledWith({'message': `The developer [3] cannot be found in database!`})
    })
})