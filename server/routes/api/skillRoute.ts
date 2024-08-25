import express from 'express'
import { handleStatusChange, getSkillTree, handleDelete } from '../../controllers/skillController'

const skillRouter = express.Router()

skillRouter.route('/:progLangId/:treeMode/:extractionId?')
    .get(getSkillTree)
skillRouter.route('/status')
    .post(handleStatusChange)
skillRouter.route('/')
    .delete(handleDelete)

export default skillRouter