import { AxiosInstance } from 'axios';
import RepositoryModel from '../models/repository/repositoryModel'
import axios from 'axios';
import { Agent } from "https"
import logger from './initLogger';


const createGitlabAPI = async (repoId: number): Promise<AxiosInstance> => {
    logger.info('Initialising GitLab connection...')

    const repository = await RepositoryModel.findByPk(repoId)
    if (!repository)
        throw new Error(`The repository ID [${repoId}] doesn't exist in database!`)
    logger.debug(`The following repository model has found: ${JSON.stringify(repository)}`)

    const config = {
        headers: {
          'Content-Type': 'application/json',
           Accept: 'application/json',
           'PRIVATE-TOKEN': repository.token
        },
        baseURL: repository.host,
        httpsAgent: new Agent({  
            rejectUnauthorized: false
        }),
      };
    
    const client: AxiosInstance = axios.create(config)

    return client
}

export default createGitlabAPI