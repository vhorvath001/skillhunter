import { Sequelize } from 'sequelize-typescript'
import { DeveloperModel } from './developerModel'
import { getOrCreateDeveloper } from './developerDataService'

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

describe('testing getOrCreateDeveloper()', () => {

    test('developer already exists, its id will be retrieved', async () => {
        const committerName: string = 'n'
        const committerEmail: string = 'e'
        const id: number = 646
        const foundDeveloperModel: DeveloperModel = DeveloperModel.build({ id: id, name: committerName, email: committerEmail })

        const spyDeveloperModel = jest
            .spyOn(DeveloperModel, 'findOne')
            .mockReturnValueOnce(Promise.resolve(foundDeveloperModel))

        const returnedId = await getOrCreateDeveloper(committerName, committerEmail)

        expect(spyDeveloperModel).toHaveBeenCalledTimes(1)
        expect(spyDeveloperModel).toHaveBeenCalledWith({
            where: {
                email: committerEmail
            }
        })
        expect(returnedId).toBe(id)
    })

    test('developer does not exist, it will be created and the newly created record id will be retrieved', async () => {
        const committerName: string = 'n'
        const committerEmail: string = 'e'
        const id: number = 646
        const createdDeveloperModel: DeveloperModel = DeveloperModel.build({ id: id, name: committerName, email: committerEmail })

        const spyDeveloperModelFindOne = jest
            .spyOn(DeveloperModel, 'findOne')
            .mockReturnValueOnce(Promise.resolve(null))
        const spyDeveloperModelCreate = jest
            .spyOn(DeveloperModel, 'create')
            .mockReturnValueOnce(Promise.resolve(createdDeveloperModel))

        const returnedId = await getOrCreateDeveloper(committerName, committerEmail)

        expect(spyDeveloperModelFindOne).toHaveBeenCalledTimes(1)
        expect(spyDeveloperModelFindOne).toHaveBeenCalledWith({
            where: {
                email: committerEmail
            }
        })
        expect(spyDeveloperModelCreate).toHaveBeenCalledTimes(1)
        expect(spyDeveloperModelCreate).toHaveBeenCalledWith({ 
            name: committerName, 
            email: committerEmail 
        })
        expect(returnedId).toBe(id)
    })
})