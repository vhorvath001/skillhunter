import express from 'express'
import { deleteDeveloper, editExistingDeveloper, getAllDevelopers, mergeDeveloper } from '../../controllers/developerController'

const developerRouter = express.Router()

developerRouter.route('/')
    .get(getAllDevelopers)

developerRouter.route('/:id')
    .delete(deleteDeveloper)
    .put(editExistingDeveloper)

developerRouter.route('/:id/merge/:selectedDeveloper')
    .put(mergeDeveloper)

export default developerRouter