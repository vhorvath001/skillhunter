import logger from '../../init/initLogger'
import TreeNode from '../../schema/treeNode'
import { logSkillTree } from '../../services/skillService'
import { saveExtractionSkillFindingModel } from '../extractionSkillFinding/extractionSkillFindingDataService'
import { SkillModel } from './skillModel'
import ProgLangModel from '../progLang/progLangModel'
import ExtractionSkillFindingModel from '../extractionSkillFinding/extractionSkillFindingModel'
import { col, fn, QueryTypes } from 'sequelize'
import sequelize from '../../init/initSequelize'

const updateSkillTree = async (parent: SkillModel | null, skillNodes: TreeNode[], projectId: number, extractionId: number): Promise<void> => {
    logger.debug(`Updating the skill tree [parent = ${parent?.id} : ${parent?.name}, projectId = ${projectId}, extractionId = ${extractionId}] to DB...`)
    logger.silly(`Skill tree:\n${logSkillTree(skillNodes, '')}`)

    const skillModels: SkillModel[] = await SkillModel.findAll({
        where: { parentId: parent ? parent.id : null }
    })
    logger.debug(`SkillModels from DB sharing the same parent (that coming in as parameter): ${skillModels.map(s => '['+s.id+'-'+s.name+']').toString()}`)

    for(const skillNode of skillNodes) {
        let skillModel: SkillModel | undefined = skillModels.find(
            skillModel => skillNode.name === skillModel.name && 
            skillNode.progLangId === skillModel.progLangId)
        logger.silly(`Found SkillModel: ${JSON.stringify(skillModel)}`)
        if (!skillModel) {
            skillModel = await SkillModel.create({
                name: skillNode.name!,
                location: '/' + (skillNode.location.length > 0 ? ' ' : '') + skillNode.location.join(' / '),
                level: skillNode.location.length,
                enabled: parent ? parent.enabled : true,
                parentId: parent ? parent.id : null,
                progLangId: skillNode.progLangId
            })
        }

        await saveExtractionSkillFindingModel(skillNode.score, extractionId, skillModel.id, projectId)

        if (skillNode.children && skillNode.children.length > 0)
            await updateSkillTree(skillModel, skillNode.children ?? [], projectId, extractionId)
    }
}

const getAllSkillsByProgLangAndParent = async (progLangId: number, 
                                               parentId: number | null,
                                               treeMode: string, 
                                               extractionId: string | null): Promise<SkillModel[]> => {

    if (treeMode === 'admin') {
        return await SkillModel.findAll({
            where: {
                progLangId: progLangId,
                parentId:  parentId
            }
        })
    } else {
        return await sequelize.query('SELECT DISTINCT s.* FROM skill AS s, extraction_skill_finding AS esf WHERE s.id = esf.skill_id AND esf.extraction_id = :extractionId AND proglang_id = :progLangId AND s.enabled = TRUE AND (s.parent_id = :parentId OR (:parentId IS NULL AND s.parent_id IS NULL))', {
            replacements: {
                extractionId: extractionId,
                parentId: parentId,
                progLangId: progLangId
            },
            model: SkillModel,
            mapToModel: true,
            type: QueryTypes.SELECT,
        })
    }
}

const changeSkillsStatus = async (ids: number[], status: string): Promise<void> => {
    await SkillModel.update(
        { 
            enabled: status === 'ENABLE' ? true : false 
        },
        {
            where: {
                id: ids
            }
        }
    )
}

const deleteSkills =  async (ids: number[]): Promise<void> => {
    await SkillModel.destroy(
        {
            where: {
                id: ids
            }
        }
    )
}

const getSkillById = async (skillId: number): Promise<SkillModel|null> => {
    return await SkillModel.findOne({
        where: {
            id: skillId
        },
        include: [{
            model: ProgLangModel
        }]
    })
}

export { updateSkillTree, getAllSkillsByProgLangAndParent, changeSkillsStatus, deleteSkills, getSkillById }