import logger from '../../config/initLogger';
import { ExtractionModel } from '../extraction/extractionModel';
import ProgLangModel from '../progLang/progLangModel';
import { ProjectModel } from '../project/projectModel';
import RepositoryModel from '../repository/repositoryModel';
import { SkillModel } from '../skill/skillModel';
import ExtractionSkillFindingModel from './extractionSkillFindingModel'

const saveExtractionSkillFindingModel = async (score: number, extractionId: number, skillId: number, projectId: number) => {
    logger.debug(`Saving an extraction skill finding [score = ${score}, extractionId = ${extractionId}, skillId = ${skillId}, projectId = ${projectId}] to DB...`)
    const extraction: ExtractionModel = ExtractionModel.build({
        id: extractionId,
        branches: '-', repositoryRef: RepositoryModel.build()
    })

    const skill: SkillModel = SkillModel.build({
        id: skillId,
        name: '-', progLangRef: ProgLangModel.build()
    })

    const project: ProjectModel = ProjectModel.build({
        id: projectId,
        name: '-', extractionRef: ExtractionModel.build()
    })

    await ExtractionSkillFindingModel.create({
        score: score, 
        extractionRef: extraction, 
        skillRef: skill, 
        projectRef: project
    }, {
        include: [ExtractionModel, SkillModel, ProjectModel]
    });
}

export { saveExtractionSkillFindingModel }