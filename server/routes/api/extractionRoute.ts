import express from 'express'
import extract from '../../controllers/extractionController'

const router = express.Router()

router.route('/')
    .post(extract)

export default router