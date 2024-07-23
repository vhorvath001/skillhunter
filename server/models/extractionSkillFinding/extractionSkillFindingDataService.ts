import { cast, col, fn, literal, Op } from 'sequelize'
import logger from '../../init/initLogger'
import { ScoreType } from '../../schema/treeNode'
import ExtractionSkillFindingModel from './extractionSkillFindingModel'
import { DeveloperModel } from '../developer/developerModel'
import { SkillModel } from '../skill/skillModel'

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
            [ fn('sum', col('score')), 'score' ]
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
        order: [ ['score', 'DESC'] ]
    })
}

const getExtractionSkillFindingBySkill = async (extractionId: number, skillId: number): Promise<ExtractionSkillFindingModel | null> => {
    return await ExtractionSkillFindingModel.findOne({
        where: {
            extractionId: extractionId,
            skillId: skillId
        }
    })
}

const getSumScoreTopLevelSkill = async (extractionId: number): Promise<number> => {
    return (await ExtractionSkillFindingModel.findOne({
        attributes: [
            [ fn('sum', col('score')), 'total_score'], 
        ],
        include: [{
            model: SkillModel,
            where: {
                parentId: null
            }
        }]
    }))?.dataValues['total_score'] ?? 0
}

export { saveExtractionSkillFindingModel, queryDevelopersScoresBySkillId, getExtractionSkillFindingBySkill, getSumScoreTopLevelSkill }