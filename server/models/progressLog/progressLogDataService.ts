import { format } from  'date-fns'
import ProgressLogModel from './progressLogModel'
import { ExtractionModel } from '../extraction/extractionModel'
import RepositoryModel from '../repository/repositoryModel'
import logger from '../../init/initLogger'

const log = async (text: string, extractionId: number) => {
    logger.warn(`PROGRESS LOGGING :: ${text} - extraction id: ${extractionId}`)

    const extraction: ExtractionModel = ExtractionModel.build({
        id: extractionId,
        branches: '-', repositoryRef: RepositoryModel.build(), status: '-'
    })

    await ProgressLogModel.create({
        logText: text,
        extractionRef: extraction
    }, {
        include: ExtractionModel
    })
}

export default log