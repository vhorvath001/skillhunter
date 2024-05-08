import express from 'express'
import { extract, getExtractions } from '../../controllers/extractionController'

const extractionRouter = express.Router()

extractionRouter.route('/')
    .post(extract)
    .get(getExtractions)

export default extractionRouter