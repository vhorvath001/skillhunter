import logger from '../../init/initLogger'
import { ScoreType } from '../../schema/treeNode'
import ExtractionSkillFindingModel from './extractionSkillFindingModel'

const saveExtractionSkillFindingModel = async (score: ScoreType[], extractionId: number, skillId: number, projectId: number) => {
    logger.debug(`Saving an extraction skill finding [score = ${JSON.stringify(score)}, extractionId = ${extractionId}, skillId = ${skillId}, projectId = ${projectId}] to DB...`)

    for (const s of score) {
        const mList: ExtractionSkillFindingModel[] = await ExtractionSkillFindingModel.findAll({
            where: { 
                extractionId: extractionId,
                skillId: skillId,
                projectId: projectId,
                developerId: s.developerId
            }
        })

        if (mList.length === 0) {
            await ExtractionSkillFindingModel.create({
                score: score, 
                extractionId: extractionId, 
                skillId: skillId, 
                projectId: projectId,
                developerId: s.developerId
            })
        } else if (mList.length === 1) {
            const m = mList[0]
            m.score += s.score
            await m.save()
        } else {
            throw new Error(`Multiple ExtractionSkillFinding records found but only 1 or zero can occur!`)
        }    
    }
}

export { saveExtractionSkillFindingModel }