import RepositoryModel from '../models/repository/repositoryModel'
import createGitLabApi from './initGitLabApi'
import axios, { AxiosInstance } from 'axios';

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

afterEach(() => {
    jest.clearAllMocks()
})

test('test to create GitLab api object successfully', async () => {
    const token: string = 'RicFlairWcw'
    const host: string = 'acme.group.net'
    const repoId: number = 12

    const mockRepositoryModel: any = {
        token: token,
        host: host
    }
    const spyRepositoryModel = jest.spyOn(RepositoryModel, 'findByPk').mockResolvedValueOnce(mockRepositoryModel)

    const gitLabApi: AxiosInstance = await createGitLabApi(repoId);

    expect(mockedAxios.create).toHaveBeenCalledTimes(1)
    expect(mockedAxios.create).toHaveBeenCalledWith(expect.objectContaining({
        headers: {
            'Content-Type': 'application/json',
             Accept: 'application/json',
             'PRIVATE-TOKEN': token
          },
          baseURL: host,
      }))
})

test('repoId does not exist in DB', async () => {
    const repoId: number = 13

    const mockRepositoryModel: any = null
    const spyRepositoryModel = jest.spyOn(RepositoryModel, 'findByPk').mockResolvedValueOnce(mockRepositoryModel)

    expect(async () => {
        await createGitLabApi(repoId)
    }).rejects.toThrow(`The repository ID [${repoId}] doesn't exist in database!`)
    
})