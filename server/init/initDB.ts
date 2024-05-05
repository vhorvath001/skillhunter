import { ExtractionModel, ExtractionProgLangModel } from '../models/extraction/extractionModel'
import ExtractionSkillFindingModel from '../models/extractionSkillFinding/extractionSkillFindingModel'
import ProgLangModel from '../models/progLang/progLangModel'
import ProgressLogModel from '../models/progressLog/progressLogModel'
import { ProjectModel } from '../models/project/projectModel'
import RepositoryModel from '../models/repository/repositoryModel'
import { SkillModel } from '../models/skill/skillModel'
import logger from './initLogger'
import sequelize from './initSequelize'

const initDB = async (): Promise<void> => {
    logger.info('Initialising the database...')
    sequelize.addModels([ ExtractionModel, ExtractionProgLangModel, ExtractionSkillFindingModel, ProgLangModel, ProgressLogModel, ProjectModel, RepositoryModel, SkillModel ])
    // await sequelize.sync({ alter: true })
    logger.info('Synchronization was successful!')
}


export default initDB