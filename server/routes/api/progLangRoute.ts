import express from 'express'
import { createNewProgLang, deleteProgLang, editExistingProgLang, getAllProgLangs, getProgLangById } from '../../controllers/progLangController'
const progLangRouter = express.Router()

progLangRouter.route('/:id')
    .get(getProgLangById)
    .put(editExistingProgLang)
    .delete(deleteProgLang)

progLangRouter.route('/')
    .post(createNewProgLang)
    .get(getAllProgLangs)

export default progLangRouter
    