import { Request, Response } from 'express'
import logger from '../init/initLogger'
import RepositoryModel from '../models/repository/repositoryModel'
import { ProjectsBranchesType, RepositoryType } from '../schema/appTypes'
import crypto from 'crypto-js'
import config from '../config/skillHunter.config'
import { getGitLabBranches, getGitLabProjects, GitLabProjectType } from '../services/versionControlService'
import { getErrorMessage, logError } from './commonFunctions'
import GitlabAPI from '../init/gitlabAPI'

const getRepositoryById = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to get a repository - id: ${req.params.id}`)

    try {
        const id: string = req.params.id
        const repositoryModel: RepositoryModel | null = await RepositoryModel.findByPk(id)

        if (!repositoryModel) {
            resp.status(404).send({'message': `The repository [${id}] cannot be found in database!`})
        } else {
            resp.status(200).json(toRepositoryType(repositoryModel))
        }
    } catch(err) {
        logError(err, `Error occurred when executing 'getRepositoryById'.`)
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
    }
}

const getAllRepositories = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to get all the repositories.`)

    try {
        const repositoryModels: RepositoryModel[] = await RepositoryModel.findAll({
            order: ['name']
        })

        resp.status(200).json(
            repositoryModels.map(m => toRepositoryType(m))
        )
    } catch(err) {
        logError(err, `Error occurred when executing 'getAllRepositories'.`)
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
    }
}

const createNewRepository = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to create a new repository.`)
    logger.info(JSON.stringify(req.body))
    
    try {
        const newRepository = req.body as RepositoryType

        const newRepositoryModel = await toRepositoryModel(newRepository, '').save()

        resp.status(201).json(toRepositoryType(newRepositoryModel))
    } catch(err) {
        logError(err, `Error occurred when executing 'createNewRepository'.`)
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
    }
}

const editExistingRepository = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to edit an existing repository.`)
    logger.info(JSON.stringify(req.body))

    try {
        const toUpdateRepository = req.body as RepositoryType
        const id: string = req.params.id

        const existingRepositoryModel: RepositoryModel | null = await RepositoryModel.findByPk(id)

        if (!existingRepositoryModel) {
            resp.status(404).send({'message': `The repository [${id}] cannot be found in database!`})
        } else {
            const toUpdateRepositoryModel: RepositoryModel = toRepositoryModel(toUpdateRepository, existingRepositoryModel.token)
            const cnt = await RepositoryModel.update(toUpdateRepositoryModel.toJSON(), { where: { id: Number(id) } })
            logger.info(`${cnt[0]} row(s) was/were updated.`)

            resp.status(201).json(toRepositoryType(toUpdateRepositoryModel))
        }
    } catch(err) {
        logError(err, `Error occurred when executing 'editExistingRepository'.`)
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
    }
}

const deleteRepository = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to delete a repository - id: ${req.params.id}`)

    try {
        const id: string = req.params.id
        const repositoryModel: RepositoryModel | null = await RepositoryModel.findByPk(id)

        if (!repositoryModel) {
            resp.status(404).send({'message': `The repository [${id}] cannot be found in database!`})
        } else {
            await repositoryModel.destroy()
            resp.sendStatus(200)
        }
    } catch(err) {
        logError(err, `Error occurred when executing 'deleteRepository'.`)
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
    }
}

const getBranchesPerProjects = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to get branches of projects - repo id: ${req.params.id}, path: ${req.params.path}`)

    try {
        const repoId: string = req.params.id
        const path: string = req.params.path

        const gitlabAPI: GitlabAPI = await GitlabAPI.createGitlapAPI(Number(repoId))

        const projects: GitLabProjectType[] = await getGitLabProjects(gitlabAPI, path)
        logger.debug(`The following projects were found: ${projects.map(p => p.name).join(', ')}`)

        let projectsBranches: ProjectsBranchesType[] = []
        for(const p of projects) {
            const branches: string[] = await getGitLabBranches(gitlabAPI, p.id)
            projectsBranches.push({
                id: p.id,
                name: p.name,
                branches: branches
            } as ProjectsBranchesType)
        }
        logger.debug(`Branches of projects: ${JSON.stringify(projectsBranches)}`)

        resp.status(200).json(projectsBranches)
    } catch(err) {
        logError(err, `Error occurred when executing 'getBranchesPerProjects'.`)
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
    }
}

const toRepositoryType = (repositoryModel: RepositoryModel): RepositoryType => {
    return {
        id: repositoryModel.id,
        name: repositoryModel.name,
        desc: repositoryModel.desc,
        url: repositoryModel.host,
        token: repositoryModel.token
    }
}

const toRepositoryModel = (repository: RepositoryType, prevToken: string): RepositoryModel => {
    const repositoryModel = RepositoryModel.build({
        name: repository.name,
        desc: repository.desc,
        host: repository.url,
        token: crypto.AES.encrypt(repository.token, config.encryptionKey).toString()
    })
    if (repository.id)
        repositoryModel.id = Number(repository.id)
    if (repository.token === prevToken)
        repositoryModel.token = prevToken
    return repositoryModel
}

export { getRepositoryById, getAllRepositories, createNewRepository, editExistingRepository, deleteRepository, getBranchesPerProjects, toRepositoryType }