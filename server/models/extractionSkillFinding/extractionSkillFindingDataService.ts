import { col, fn } from 'sequelize'
import logger from '../../init/initLogger'
import { ScoreType } from '../../schema/treeNode'
import ExtractionSkillFindingModel from './extractionSkillFindingModel'
import { DeveloperModel } from '../developer/developerModel'

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
                score: s.score, 
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
            logger.warn(`Multiple ExtractionSkillFinding records found! extractionId=${extractionId}, skillId=${skillId}, projectId=${projectId}, developerId=${s.developerId}`)
            throw new Error(`Multiple ExtractionSkillFinding records found but only 1 or zero can occur!`)
        }    
    }
}

const queryDevelopersScoresBySkillId = async (extractionId: number, skillId: number): Promise<any[]> => {
    logger.debug(`Querying developers' scores by skill ID [extractionId = ${extractionId}, skillId = ${skillId}] ...`)

    // [{"developerId":4,"totalScore":117641.14646024398,"developerRef":{"name":"Ric Flair"}}]
    return await ExtractionSkillFindingModel.findAll({
        attributes: [
            'developerId',
            [ fn('sum', col('score')), 'total_score' ]
        ],
        where: {
            extractionId: extractionId,
            skillId: skillId
        },
        include: {
            model: DeveloperModel,
            attributes: [ 'name' ]
        },
        group: [ 'developerId' ],
        order: [ 'developerId' ]
    })
}

export { saveExtractionSkillFindingModel, queryDevelopersScoresBySkillId }