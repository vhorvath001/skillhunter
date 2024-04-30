import express from 'express'
import { createNewRepository, deleteRepository, editExistingRepository, getAllRepositories, getRepositoryById } from '../../controllers/repositoryController'
const repositoryRouter = express.Router()

repositoryRouter.route('/:id')
    .get(getRepositoryById)
    .put(editExistingRepository)
    .delete(deleteRepository)

repositoryRouter.route('/')
    .post(createNewRepository)
    .get(getAllRepositories)

export default repositoryRouter
    