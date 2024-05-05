import { Op } from '@sequelize/core'
import logger from '../../init/initLogger'
import TreeNode from '../../schema/treeNode'
import { saveExtractionSkillFindingModel } from '../extractionSkillFinding/extractionSkillFindingDataService'
import ProgLangModel from '../progLang/progLangModel'
import { SkillModel } from './skillModel'
import { Sequelize } from 'sequelize'
import sequelize from '../../init/initSequelize'

const updateSkillTree = async (parent: SkillModel | undefined, skillNodes: TreeNode[], projectId: number, extractionId: number, skillEnabled: boolean): Promise<void> => {
    logger.debug(`Updating the skill tree [parent = ${parent?.id} : ${parent?.name}, projectId = ${projectId}, extractionId = ${extractionId}, skillNodes = ${skillNodes.map(s => s.name).toString()}] to DB...`)

    const skillModels: SkillModel[] = await SkillModel.findAll({
        where: { parentRef: parent }
    })
    logger.debug(`SkillModels from DB sharing the same parent (that coming in as parameter): ${skillModels.map(s => '['+s.id+'-'+s.name+']').toString()}`)

    for(const skillNode of skillNodes) {
        let skillModel: SkillModel | undefined = skillModels.find(skillModel => skillNode.name === skillModel.name && 
                                                                                skillNode.progLangId === skillModel.progLangRef.id)
        logger.debug(`Found SkillModel: ${skillModel}`)
        if (!skillModel) {
            const progLang: ProgLangModel = ProgLangModel.build({
                id: skillNode.progLangId!,
                name: '-', sourceFiles: '-', patterns: '-', scopePattern: '-', removingTLDPackages: false
            })
            skillModel = await SkillModel.create({
                name: skillNode.name!,
                enabled: skillEnabled,
                parentRef: parent,
                progLangRef: progLang
            }, {
                include: ProgLangModel
            })
        }

        saveExtractionSkillFindingModel(skillNode.score ?? 0, extractionId, skillModel.id, projectId)

        if (skillNode.children && skillNode.children.length > 0)
            await updateSkillTree(skillModel, skillNode.children ?? [], projectId, extractionId, skillEnabled)
    }
}

const getAllSkillsByProgLangAndParent = async (progLangId: number, parentId: number | null): Promise<SkillModel[]> => {
    return await SkillModel.findAll({
        where: {
            progLangRef: progLangId,
            parentRef:  parentId
        }
    })
}

const changeSkillsStatus = async (ids: number[], status: string): Promise<void> => {
    await SkillModel.update(
        { enabled: status === 'ENABLE' ? true : false },
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

export { updateSkillTree, getAllSkillsByProgLangAndParent, changeSkillsStatus, deleteSkills }