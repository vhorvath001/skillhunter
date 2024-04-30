import express from 'express'
import extract from '../../controllers/extractionController'

const extractionRouter = express.Router()

extractionRouter.route('/')
    .post(extract)

export default extractionRouter