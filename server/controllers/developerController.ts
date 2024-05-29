import { Request, Response } from 'express'
import logger from '../init/initLogger'
import { DeveloperModel } from '../models/developer/developerModel'
import { DeveloperType } from '../schema/appTypes'
import { getErrorMessage, logError } from './commonFunctions'
import { deleteDeveloperById, getAllDevelopersOrderByName, getDeveloperById } from '../models/developer/developerDataService'

const getAllDevelopers = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to get all the developers.`)

    try {
        const developerModels: DeveloperModel[] = await getAllDevelopersOrderByName()

        resp.status(200).json(
            developerModels.map(m => toDeveloperType(m))
        )
    } catch(err) {
        logError(err, `Error occurred when executing 'getAllDevelopers'.`)
        resp.status(500).send({'message': `Error occurred when trying to get all the developers! - ${getErrorMessage(err)}`})
    }
}

const deleteDeveloper = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to delete a developer - id: ${req.params.id}`)

    try {
        const id: number = Number(req.params.id)
        const developerModel: DeveloperModel | null = await getDeveloperById(id)

        if (!developerModel) {
            resp.status(404).send({'message': `The developer [${id}] cannot be found in database!`})
        } else {
            await deleteDeveloperById(id)
            resp.sendStatus(200)
        }
    } catch(err) {
        logError(err, `Error occurred when executing 'deleteDeveloper'.`)
        resp.status(500).send({'message': `Error occurred when trying to delete a developer! - ${getErrorMessage(err)}`})
    }
}

const editExistingDeveloper = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to edit an existing developer. - ${JSON.stringify(req.body)}`)

    try {
        const toUpdateDeveloper = req.body as DeveloperType        
        const id: number = Number(req.params.id)

        const toUpdateDeveloperModel: DeveloperModel = toDeveloperModel(toUpdateDeveloper)
        const cnt = await DeveloperModel.update(toUpdateDeveloperModel.toJSON(), { where: { id: Number(id) } })
        logger.info(`${cnt[0]} row(s) was/were updated.`)

        if (!cnt || cnt[0] === 0) {
            resp.status(404).send({'message': `The developer [${id}] cannot be found in database!`})
        } else {
            resp.status(201).json(toDeveloperType(toUpdateDeveloperModel))
        }
    } catch(err) {
        logError(err, `Error occurred when executing 'editExistingDeveloper'.`)
        resp.status(500).send({'message': `Error occurred when trying to edit an existing developer! - ${getErrorMessage(err)}`})
    }
}

const toDeveloperType = (model: DeveloperModel): DeveloperType => {
    return {
        id: model.id,
        name: model.name,
        email: model.email
    }
}

const toDeveloperModel = (d: DeveloperType): DeveloperModel => {
    return DeveloperModel.build({
        id: d.id,
        name: d.name,
        email: d.email
    })
}
export { getAllDevelopers, deleteDeveloper, editExistingDeveloper }