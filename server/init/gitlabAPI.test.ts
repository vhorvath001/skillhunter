import { Sequelize } from 'sequelize-typescript'
import GitlabAPI from '../init/gitlabAPI'
import RepositoryModel from '../models/repository/repositoryModel'
import { DeveloperType } from '../schema/appTypes'

beforeAll( async () => {
    const sequelize = new Sequelize('sqlite::memory:', {
        logging: console.log
    })
    sequelize.addModels([ RepositoryModel ])
    await sequelize.sync()
})

afterEach(() => {
    jest.clearAllMocks()
})

describe('createGitlapAPI()', () => {

    test('successful', async () => {
        const repoId: number = 45
        const repository: RepositoryModel = RepositoryModel.build({
            token: 'ss'
        })

        const spyRepositoryModel = jest
            .spyOn(RepositoryModel, 'findByPk')
            .mockImplementation(() => Promise.resolve(repository))

        const gitlabAPI: GitlabAPI = await GitlabAPI.createGitlapAPI(repoId)

        expect(spyRepositoryModel).toHaveBeenCalledTimes(1)
        expect(spyRepositoryModel).toHaveBeenCalledWith(repoId)
    })

    test('repository does not exist', async () => {
        const repoId: number = 45

        const spyRepositoryModel = jest
            .spyOn(RepositoryModel, 'findByPk')
            .mockImplementation(() => Promise.resolve(null))

        await expect(GitlabAPI.createGitlapAPI(repoId)).rejects.toThrow(`The repository ID [45] doesn't exist in database!`)

        expect(spyRepositoryModel).toHaveBeenCalledTimes(1)
        expect(spyRepositoryModel).toHaveBeenCalledWith(repoId)
    })

})

describe('testing call()', () => {

    test('testing an ok call', async () => {
        const developers: DeveloperType[] = [{
            id: 0, name: 'n0', email: 'e0'
        }, {
            id: 1, name: 'n1', email: 'e1'
        }]
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(developers),
                ok: true
            }),
        ) as jest.Mock

        const gitlabAPI: GitlabAPI = await buildAPI()

        const returnedDevelopers: DeveloperType[] | string = await gitlabAPI.call('users', { 'status': 'enabled' })

        expect(fetch).toHaveBeenCalledTimes(1)
        expect(fetch).toHaveBeenCalledWith('http://localhost/users?status=enabled', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'PRIVATE-TOKEN': 'ss',
                'User-Agent': 'Skill Hunter 1.0'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })

        expect(returnedDevelopers.length).toBe(2)
    })

    test('testing a failed call', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve('Error due to alien attack!'),
                ok: false
            }),
        ) as jest.Mock

        const gitlabAPI: GitlabAPI = await buildAPI()

        await expect(gitlabAPI.call('users', { 'status': 'enabled' })).rejects.toThrow('Error due to alien attack!')

        expect(fetch).toHaveBeenCalledTimes(1)
        expect(fetch).toHaveBeenCalledWith('http://localhost/users?status=enabled', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'PRIVATE-TOKEN': 'ss',
                'User-Agent': 'Skill Hunter 1.0'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })
    })
})

const buildAPI = async (): Promise<GitlabAPI> => {
    const repository: RepositoryModel = RepositoryModel.build({
        token: 'U2FsdGVkX1/caNOXKX4BJQTMW+XxLuSvBqGdPd+/kZk=', host: 'http://localhost'
    })

    const spyRepositoryModel = jest
        .spyOn(RepositoryModel, 'findByPk')
        .mockImplementation(() => Promise.resolve(repository))

    return await GitlabAPI.createGitlapAPI(45)
}