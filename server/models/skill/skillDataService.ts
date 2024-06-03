import logger from '../../init/initLogger'
import TreeNode from '../../schema/treeNode'
import { logSkillTree } from '../../services/skillService'
import { saveExtractionSkillFindingModel } from '../extractionSkillFinding/extractionSkillFindingDataService'
import { SkillModel } from './skillModel'

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
                enabled: await getSkillEnabled(parent, true),
                parentId: parent ? parent.id : null,
                progLangId: skillNode.progLangId
            })
        }

        await saveExtractionSkillFindingModel(skillNode.score, extractionId, skillModel.id, projectId)

        if (skillNode.children && skillNode.children.length > 0)
            await updateSkillTree(skillModel, skillNode.children ?? [], projectId, extractionId)
    }
}

const getSkillEnabled = async (parent: SkillModel | null, enabled: boolean): Promise<boolean> => {
    if (parent) {
        const grandParent = await SkillModel.findByPk(parent.parentId)
        return getSkillEnabled(grandParent, parent.enabled)
    }
    else
        return enabled
}

const getAllSkillsByProgLangAndParent = async (progLangId: number, parentId: number | null): Promise<SkillModel[]> => {
    return await SkillModel.findAll({
        where: {
            progLangId: progLangId,
            parentId:  parentId
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