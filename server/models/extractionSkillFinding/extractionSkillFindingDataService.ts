import { cast, col, fn, literal, Op } from 'sequelize'
import logger from '../../init/initLogger'
import { ScoreType } from '../../schema/treeNode'
import ExtractionSkillFindingModel from './extractionSkillFindingModel'
import { DeveloperModel } from '../developer/developerModel'
import { SkillModel } from '../skill/skillModel'
import ProgLangModel from '../progLang/progLangModel'

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
                nrOfChangedLines: s.nrOfChangedLines,
                extractionId: extractionId, 
                skillId: skillId, 
                projectId: projectId,
                developerId: s.developerId
            })
        } else if (mList.length === 1) {
            const m = mList[0]
            m.score += s.score
            m.nrOfChangedLines += s.nrOfChangedLines
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

const getSumScoreForDeveloperSkill = async (extractionId: number, resourceType: string, resourceId: number): Promise<ExtractionSkillFindingModel[]> => {
    let whereCond: {} = {
        extractionId: extractionId
    }
    if (resourceType === 'DEVELOPER') {
        whereCond = { ...whereCond, 'developerId': resourceId }
    } else if (resourceType === 'SKILL') {
        whereCond = { ...whereCond, 'skillId': resourceId }
    }
    
    return await ExtractionSkillFindingModel.findAll({
        attributes: [
            'developerId',
            'skillId',
            [ fn('sum', col('score')), 'score']
        ],
        where: {
            ...whereCond
        },
        include: [{
            model: DeveloperModel,
            attributes: [ 'id', 'name', 'email' ]
        }, {
            model: SkillModel,
            attributes: [ 'id', 'name', 'parentId' ],
            include: [{
                model: ProgLangModel,
                attributes: [ 'name', 'ranking' ]
            }]
        }],
        group: [ 'developerId', 'skillId' ]
    })
}

export { saveExtractionSkillFindingModel, queryDevelopersScoresBySkillId, getExtractionSkillFindingBySkill, getSumScoreTopLevelSkill, getSumScoreForDeveloperSkill }