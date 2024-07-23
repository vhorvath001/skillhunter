import express from 'express'
import { calculateRankingsFromSkill, createNewProgLang, deleteProgLang, editExistingProgLang, getAllProgLangs, getProgLang } from '../../controllers/progLangController'
const progLangRouter = express.Router()

progLangRouter.route('/:id')
    .get(getProgLang)
    .put(editExistingProgLang)
    .delete(deleteProgLang)

progLangRouter.route('/:id/calculateRankings')
    .post(calculateRankingsFromSkill)
    
progLangRouter.route('/')
    .post(createNewProgLang)
    .get(getAllProgLangs)

export default progLangRouter
    