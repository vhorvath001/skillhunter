import express from 'express'
import { createNewRepository, deleteRepository, editExistingRepository, getAllRepositories, getBranchesPerProjects, getRepositoryById } from '../../controllers/repositoryController'
const repositoryRouter = express.Router()

repositoryRouter.route('/:id')
    .get(getRepositoryById)
    .put(editExistingRepository)
    .delete(deleteRepository)

repositoryRouter.route('/')
    .post(createNewRepository)
    .get(getAllRepositories)

repositoryRouter.route('/:id/:path/projects/branches')
    .get(getBranchesPerProjects)

export default repositoryRouter
    