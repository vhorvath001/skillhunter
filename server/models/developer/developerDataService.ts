import logger from '../../init/initLogger'
import { DeveloperModel } from './developerModel'

const getOrCreateDeveloper = async (committerName: string, committerEmail: string): Promise<number> => {
    logger.debug(`Getting or creating developer [committerName = ${committerName}, committerEmail=${committerEmail}] ...`)
    const found = await DeveloperModel.findOne({
        where: {
            email: committerEmail
        }
    })
    if (found)
        return found.id
    else {
        const developer = await DeveloperModel.create({
            name: committerName,
            email: committerEmail
        })
        return developer.id
    }
}

const getAllDevelopersOrderByName = async (): Promise<DeveloperModel[]> => {
    logger.debug(`Getting all developers ordered by name`)
    const models: DeveloperModel[] = await DeveloperModel.findAll({
        order: ['name']
    })

    return models
}

const getDeveloperById = async (id: number): Promise<DeveloperModel | null> => {
    logger.debug(`Getting developer by id [id = ${id}] ...`)
    return await DeveloperModel.findByPk(id)
}

const deleteDeveloperById = async (id: number): Promise<boolean> => {
    logger.debug(`Deleting developer by id [id = ${id}] ...`)
    const deletedRows: number = await DeveloperModel.destroy({
        where: {
            id: id
        }
    })
    return deletedRows === 1
}

const updateDeveloperById = async (model: DeveloperModel, id: number): Promise<number[]>  => {
    return await DeveloperModel.update(model.toJSON(), {
        where: {
            id: Number(id)
        } 
    })
}

export { getOrCreateDeveloper, getAllDevelopersOrderByName, deleteDeveloperById, getDeveloperById, updateDeveloperById }