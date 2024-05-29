import ProgressLogModel from './progressLogModel'
import logger from '../../init/initLogger'

const log = async (text: string, extractionId: number) => {
    logger.warn(`PROGRESS LOGGING :: ${text} - extraction id: ${extractionId}`)

    await ProgressLogModel.create({
        logText: text,
        extractionId: extractionId
    }
    )
}

const getProgressLogsByExtractionId = async (extractionId: number): Promise<ProgressLogModel[]> => {
    return await ProgressLogModel.findAll({
        where: {
            extractionId: extractionId
        }
    })
}

export { log, getProgressLogsByExtractionId } 