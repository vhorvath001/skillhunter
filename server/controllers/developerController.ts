import { Request, Response } from 'express'
import logger from '../init/initLogger'
import { DeveloperModel } from '../models/developer/developerModel'
import { DeveloperType } from '../schema/appTypes'
import { getErrorMessage, logError } from './commonFunctions'
import { deleteDeveloperById, getAllDevelopersOrderByName, getDeveloperById, mergeDeveloperInto, updateDeveloperById } from '../models/developer/developerDataService'
import sequelize from '../init/initSequelize'

const getAllDevelopers = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to get all the developers.`)

    try {
        const developerModels: DeveloperModel[] = await getAllDevelopersOrderByName()

        resp.status(200).json(
            developerModels.map(m => toDeveloperType(m))
        )
    } catch(err) {
        logError(err, `Error occurred when executing 'getAllDevelopers'.`)
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
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
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
    }
}

const editExistingDeveloper = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to edit an existing developer. - ${JSON.stringify(req.body)}`)

    try {
        const toUpdateDeveloper = req.body as DeveloperType        
        const id: number = Number(req.params.id)

        const toUpdateDeveloperModel: DeveloperModel = toDeveloperModel(toUpdateDeveloper)
        const cnt = await updateDeveloperById(toUpdateDeveloperModel, id)
        logger.info(`${cnt[0]} row(s) was/were updated.`)

        if (!cnt || cnt[0] === 0) {
            resp.status(404).send({'message': `The developer [${id}] cannot be found in database!`})
        } else {
            resp.status(201).json(toDeveloperType(toUpdateDeveloperModel))
        }
    } catch(err) {
        logError(err, `Error occurred when executing 'editExistingDeveloper'.`)
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
    }
}

const mergeDeveloper = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to merge the developer into another. - ${JSON.stringify(req.params)}`)

    try {
        const currentDeveloperId: number = Number(req.params.id)
        const selectedDeveloperId: number = Number(req.params.selectedDeveloper)

        const currentDeveloperModel: DeveloperModel | null = await getDeveloperById(currentDeveloperId)
        const selectedDeveloperModel: DeveloperModel | null = await getDeveloperById(selectedDeveloperId)
        if (!currentDeveloperModel) {
            resp.status(404).send({'message': `The developer [${currentDeveloperId}] cannot be found in database!`})
        } else if (!selectedDeveloperModel) {
            resp.status(404).send({'message': `The developer [${selectedDeveloperId}] cannot be found in database!`})
        } else {
            const result = await sequelize.transaction(async t => {
                await mergeDeveloperInto(currentDeveloperModel, selectedDeveloperModel)
                await deleteDeveloperById(currentDeveloperId)    
            })

            resp.sendStatus(200)
        }
    } catch(err) {
        logError(err, `Error occurred when executing 'mergeDeveloper'.`)
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
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

export { getAllDevelopers, deleteDeveloper, editExistingDeveloper, toDeveloperType, toDeveloperModel, mergeDeveloper }