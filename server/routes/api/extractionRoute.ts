import express from 'express'
import { deleteExtraction, extract, getDeveloperSkillMap, getDevelopersScoresBySkill, getExtractions, getProgressLogs } from '../../controllers/extractionController'

const extractionRouter = express.Router()

extractionRouter.route('/')
    .post(extract)
    .get(getExtractions)

extractionRouter.route('/:id')
    .delete(deleteExtraction)

extractionRouter.route('/:id/progressLogs')
    .get(getProgressLogs)

                        
extractionRouter.route('/:id/maps/developersScores/:skillId')
    .get(getDevelopersScoresBySkill)

extractionRouter.route('/:id/maps/developerSkill/:resourceType/:resourceId?')
    .get(getDeveloperSkillMap)

export default extractionRouter