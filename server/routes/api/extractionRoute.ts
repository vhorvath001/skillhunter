import express from 'express'
import { changeExtraction, deleteExtraction, extract, getDeveloperProjectMap, getDeveloperSkillMap, getDevelopersOfExtraction, getDevelopersScoresBySkill, getExtractions, getProgressLogs, getProjectSkillMap, getProjectsOfExtraction } from '../../controllers/extractionController'

const extractionRouter = express.Router()

extractionRouter.route('/')
    .post(extract)
    .get(getExtractions)

extractionRouter.route('/:id')
    .delete(deleteExtraction)
    .patch(changeExtraction)

extractionRouter.route('/:id/progressLogs')
    .get(getProgressLogs)

extractionRouter.route('/:id/maps/developersScores/:skillId')
    .get(getDevelopersScoresBySkill)

extractionRouter.route('/:id/maps/developersSkills/:resourceType/:resourceId?')
    .get(getDeveloperSkillMap)

extractionRouter.route('/:id/maps/developersProjects/:resourceType/:resourceId?')
    .get(getDeveloperProjectMap)

extractionRouter.route('/:id/maps/projectsSkills/:resourceType/:resourceId?')
    .get(getProjectSkillMap)

extractionRouter.route('/:id/developers')
    .get(getDevelopersOfExtraction)

extractionRouter.route('/:id/projects')
    .get(getProjectsOfExtraction)

export default extractionRouter