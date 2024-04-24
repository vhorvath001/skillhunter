import logger from '../../config/initLogger'
import { ExtractionModel } from '../extraction/extractionModel'
import RepositoryModel from '../repository/repositoryModel'
import { ProjectModel } from './projectModel'

const saveProject = async (name: string, extractionId: number) => {
    logger.debug(`Saving a project [name = ${name}, extractionId = ${extractionId}] to DB...`)
    const extraction: ExtractionModel = ExtractionModel.build({
        id: extractionId,
        branches: '-', repositoryRef: RepositoryModel.build()
    })

    const projectModel = await ProjectModel.create({
        name: name,
        extractionRef: extraction
    }, {
        include: ExtractionModel
    })
    return projectModel.id
}

export default saveProject