import logger from '../../config/initLogger'
import TreeNode from '../../schema/treeNode'
import { saveExtractionSkillFindingModel } from '../extractionSkillFinding/extractionSkillFindingDataService'
import ProgLangModel from '../progLang/progLangModel'
import { SkillModel } from './skillModel'

const updateSkillTree = async (parent: SkillModel | undefined, skillNodes: TreeNode[], projectId: number, extractionId: number): Promise<void> => {
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
                parentRef: parent,
                progLangRef: progLang
            }, {
                include: ProgLangModel
            })
        }

        saveExtractionSkillFindingModel(skillNode.score ?? 0, extractionId, skillModel.id, projectId)

        if (skillNode.children && skillNode.children.length > 0)
            await updateSkillTree(skillModel, skillNode.children ?? [], projectId, extractionId)
    }
}

export default updateSkillTree