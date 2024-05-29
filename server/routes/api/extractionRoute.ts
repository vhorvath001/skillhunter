import express from 'express'
import { deleteExtraction, extract, getExtractions, getProgressLogs } from '../../controllers/extractionController'

const extractionRouter = express.Router()

extractionRouter.route('/')
    .post(extract)
    .get(getExtractions)

extractionRouter.route('/:id')
    .delete(deleteExtraction)

extractionRouter.route('/:id/progressLogs')
    .get(getProgressLogs)

export default extractionRouter