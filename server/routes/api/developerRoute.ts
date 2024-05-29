import express from 'express'
import { deleteDeveloper, editExistingDeveloper, getAllDevelopers } from '../../controllers/developerController'

const developerRouter = express.Router()

developerRouter.route('/')
    .get(getAllDevelopers)

developerRouter.route('/:id')
    .delete(deleteDeveloper)
    .put(editExistingDeveloper)

export default developerRouter