import { Request, Response } from 'express'
import logger from '../config/initLogger'
import RepositoryModel from '../models/repository/repositoryModel'
import { RepositoryType } from '../schema/appTypes'

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
        logger.error(`Error occurred when executing 'getRepositoryById': ${err}`)
        resp.status(500).send({'message': `Error occurred when trying the get a repository! - ${getErrorMessage(err)}`})
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
        logger.error(`Error occurred when executing 'getAllRepositories': ${err}`)
        resp.status(500).send({'message': `Error occurred when trying the get all the repositories! - ${getErrorMessage(err)}`})
    }
}

const createNewRepository = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to create a new repository.`)
    logger.info(JSON.stringify(req.body))
    
    try {
        const newRepository = req.body as RepositoryType

        const newRepositoryModel = await toRepositoryModel(newRepository).save()

        resp.status(201).json(toRepositoryType(newRepositoryModel))
    } catch(err) {
        logger.error(`Error occurred when executing 'createNewRepository': ${err}`)
        resp.status(500).send({'message': `Error occurred when trying the save a new repository! - ${getErrorMessage(err)}`})
    }
}

const editExistingRepository = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to edit an existing repository.`)
    logger.info(JSON.stringify(req.body))

    try {
        const toUpdateRepository = req.body as RepositoryType        
        const id: string = req.params.id

        const toUpdateRepositoryModel: RepositoryModel = toRepositoryModel(toUpdateRepository)
        const cnt = await RepositoryModel.update(toUpdateRepositoryModel.toJSON(), { where: { id: Number(id) } })
        logger.info(`${cnt} row(s) was/were updated.`)

        if (!cnt || cnt[0] === 0) {
            resp.status(404).send({'message': `The repository [${id}] cannot be found in database!`})
        } else {
            resp.status(201).json(toUpdateRepository)
        }
    } catch(err) {
        logger.error(`Error occurred when executing 'editExistingRepository': ${err}`)
        resp.status(500).send({'message': `Error occurred when trying the edit an existing repository! - ${getErrorMessage(err)}`})
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
            repositoryModel.destroy()
            resp.sendStatus(200)
        }
    } catch(err) {
        logger.error(`Error occurred when executing 'deleteRepository': ${err}`)
        resp.status(500).send({'message': `Error occurred when trying the get a repository! - ${getErrorMessage(err)}`})
    }
}

const toRepositoryType = (repositoryModel: RepositoryModel): RepositoryType => {
    return {
        id: repositoryModel.id.toString(),
        name: repositoryModel.name,
        desc: repositoryModel.desc,
        url: repositoryModel.host,
        token: repositoryModel.token
    }
}

const toRepositoryModel = (repository: RepositoryType): RepositoryModel => {
    const newRepositoryModel = RepositoryModel.build({
        name: repository.name,
        desc: repository.desc,
        host: repository.url,
        token: repository.token
    })
    if (repository.id)
        newRepositoryModel.id = Number(repository.id)
    return newRepositoryModel
}

const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message
    else return String(err)
}
export { getRepositoryById, getAllRepositories, createNewRepository, editExistingRepository, deleteRepository }