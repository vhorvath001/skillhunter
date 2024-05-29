import logger from '../../init/initLogger'
import { ProjectModel } from './projectModel'

const saveProject = async (name: string, extractionId: number) => {
    logger.debug(`Saving a project [name = ${name}, extractionId = ${extractionId}] to DB...`)

    const projectModel = await ProjectModel.create({
        name: name,
        extractionId: extractionId
    })
    return projectModel.id
}

export default saveProject