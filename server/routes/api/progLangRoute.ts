import express from 'express'
import { calculateRankingsFromSkill, createNewProgLang, deleteProgLang, editExistingProgLang, getAllProgLangs, getProgLang, getAllProgLangsByExtraction } from '../../controllers/progLangController'
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

progLangRouter.route('/extractions/:extractionId')
    .get(getAllProgLangsByExtraction)
    
export default progLangRouter
    