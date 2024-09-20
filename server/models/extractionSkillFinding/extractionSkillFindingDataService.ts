import { cast, col, fn, literal, Op, QueryTypes } from 'sequelize'
import logger from '../../init/initLogger'
import { ScoreType } from '../../schema/treeNode'
import ExtractionSkillFindingModel from './extractionSkillFindingModel'
import { DeveloperModel } from '../developer/developerModel'
import { SkillModel } from '../skill/skillModel'
import ProgLangModel from '../progLang/progLangModel'
import { ProjectModel } from '../project/projectModel'
import sequelize from '../../init/initSequelize'

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
            attributes: [ 'name', 'email' ]
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

const getSumScoreForDeveloperSkill = async (extractionId: number, resourceType: string, resourceId: number, skillLevel: number | null): Promise<ExtractionSkillFindingModel[]> => {
    let whereCondEsfm: {} = {
        extractionId: extractionId
    }
    if (resourceType === 'DEVELOPER') {
        whereCondEsfm = { ...whereCondEsfm, 'developerId': resourceId }
    } else if (resourceType === 'SKILL') {
        whereCondEsfm = { ...whereCondEsfm, 'skillId': resourceId }
    }

    let whereCondSkill = {}
    if (skillLevel)
        whereCondSkill = { 'level': skillLevel}
    
    return await ExtractionSkillFindingModel.findAll({
        attributes: [
            'developerId',
            'skillId',
            [ fn('sum', col('score')), 'score'],
            [ fn('sum', col('NR_OF_CHANGED_LINES')), 'nrOfChangedLines']
        ],
        where: {
            ...whereCondEsfm
        },
        include: [{
            model: DeveloperModel,
            attributes: [ 'id', 'name', 'email' ]
        }, {
            model: SkillModel,
            attributes: [ 'id', 'name', 'parentId', 'location' ],
            where: whereCondSkill,
            include: [{
                model: ProgLangModel,
                attributes: [ 'name', 'ranking' ]
            }]
        }],
        group: [ 'developerId', 'skillId' ]
    })
}

const getSumScoreForDeveloperProject = async (extractionId: number, resourceType: string, resourceId: number): Promise<ExtractionSkillFindingModel[]> => {
    let whereCondEsfm: {} = {
        extractionId: extractionId
    }
    if (resourceType === 'DEVELOPER') {
        whereCondEsfm = { ...whereCondEsfm, 'developerId': resourceId }
    } else if (resourceType === 'PROJECT') {
        whereCondEsfm = { ...whereCondEsfm, 'projectId': resourceId }
    }
    
    return await ExtractionSkillFindingModel.findAll({
        attributes: [
            'developerId',
            'projectId',
            [ fn('sum', col('score')), 'score'],
            [ fn('sum', col('NR_OF_CHANGED_LINES')), 'nrOfChangedLines']
        ],
        where: {
            ...whereCondEsfm
        },
        include: [{
            model: DeveloperModel,
            attributes: [ 'id', 'name', 'email' ]
        }, {
            model: ProjectModel,
            attributes: [ 'id', 'name', 'desc', 'path', 'created_at', 'http_url_to_repo' ]
        }],
        group: [ 'developerId', 'projectId' ]
    })
}

const getSumScoreForProjectSkill = async (extractionId: number, resourceType: string, resourceId: number, skillLevel: number | null): Promise<ExtractionSkillFindingModel[]> => {
    let whereCondEsfm: {} = {
        extractionId: extractionId
    }
    if (resourceType === 'PROJECT') {
        whereCondEsfm = { ...whereCondEsfm, 'projectId': resourceId }
    } else if (resourceType === 'SKILL') {
        whereCondEsfm = { ...whereCondEsfm, 'skillId': resourceId }
    }

    let whereCondSkill = {}
    if (skillLevel)
        whereCondSkill = { 'level': skillLevel}
    
    return await ExtractionSkillFindingModel.findAll({
        attributes: [
            'projectId',
            'skillId',
            [ fn('sum', col('score')), 'score'],
            [ fn('sum', col('NR_OF_CHANGED_LINES')), 'nrOfChangedLines']
        ],
        where: {
            ...whereCondEsfm
        },
        include: [{
            model: ProjectModel,
            attributes: [ 'id', 'name', 'desc', 'path', 'created_at', 'http_url_to_repo' ]
        }, {
            model: SkillModel,
            attributes: [ 'id', 'name', 'parentId', 'location' ],
            where: whereCondSkill,
            include: [{
                model: ProgLangModel,
                attributes: [ 'name', 'ranking' ]
            }]
        }],
        group: [ 'projectId', 'skillId' ]
    })
}

const queryDevelopersOfExtraction = async (extractionId: number): Promise<DeveloperModel[]> => {
    return await sequelize.query('SELECT DISTINCT d.* FROM developer d, extraction_skill_finding AS esf WHERE d.id = esf.developer_id AND esf.extraction_id = :extractionId ORDER BY d.name', {
        replacements: {
            extractionId: extractionId
        },
        model: DeveloperModel,
        mapToModel: true,
        type: QueryTypes.SELECT
    })
}

const queryProjectsOfExtraction = async (extractionId: number): Promise<ProjectModel[]> => {
    return await sequelize.query('SELECT DISTINCT p.* FROM project p, extraction_skill_finding AS esf WHERE p.id = esf.project_id AND esf.extraction_id = :extractionId ORDER BY p.name', {
        replacements: {
            extractionId: extractionId
        },
        model: ProjectModel,
        mapToModel: true,
        type: QueryTypes.SELECT
    })
}

export { saveExtractionSkillFindingModel, queryDevelopersScoresBySkillId, getExtractionSkillFindingBySkill, getSumScoreTopLevelSkill, getSumScoreForDeveloperSkill, getSumScoreForDeveloperProject, queryDevelopersOfExtraction, queryProjectsOfExtraction, getSumScoreForProjectSkill }