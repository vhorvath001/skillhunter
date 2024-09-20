import { Request, Response } from 'express'
import { changeSkillsStatus, deleteSkills, getAllSkillsByProgLangAndParent } from '../models/skill/skillDataService'
import logger from '../init/initLogger'
import { getErrorMessage, logError } from './commonFunctions'
import { SkillModel } from '../models/skill/skillModel'
import { SkillTreeNodeType } from '../schema/appTypes'

export const getSkillTree = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to get the skill tree - prog land id: ${req.params.progLangId}`)

    try {
        const progLangId: string = req.params.progLangId
        const treeMode: string = req.params.treeMode
        const extractionId: string|null = req.params.extractionId

        const tree: SkillTreeNodeType[] = await buildTree(Number(progLangId), null, null, treeMode, extractionId)

        resp.status(200).json(tree)
    } catch(err) {
        logError(err, `Error occurred when executing 'getSkillTree'.`)
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
    }
}

export const handleStatusChange = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to change the status of skills. - ${JSON.stringify(req.body)}`)

    try {
        const ids: number[] = req.body.ids as number[]
        const status: string = req.body.status

        await changeSkillsStatus(ids, status)
        
        resp.sendStatus(200)
    } catch(err) {
        logError(err, `Error occurred when executing 'handleStatusChange'.`)
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
    }
}

export const handleDelete = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to delete skills. - ${JSON.stringify(req.body.ids)}`)

    try {
        const ids: number[] = req.body.ids as number[]

        await deleteSkills(ids)

        resp.sendStatus(200)
    } catch(err) {
        logError(err, `Error occurred when executing 'handleDelete'.`)
        
        resp.status(500).send({'message': `${getErrorMessage(err)}`})
    }
}

const buildTree = async (progLangId: number, 
                         parentId: number | null, 
                         parentNode: SkillTreeNodeType | null,
                         treeMode: string, 
                         extractionId: string | null): Promise<SkillTreeNodeType[]> => {
    logger.debug(`Building tree, progLangId: [${progLangId}], parentId: [${parentId}], parentNodeName: [${parentNode?.name}], treeMode: [${treeMode}], extractionId: [${extractionId}] ...`)
    const skillModels: SkillModel[] = await getAllSkillsByProgLangAndParent(progLangId, parentId, treeMode, extractionId)
    logger.debug(`Found skills: ${skillModels.map(m => '['+m.id+'--'+m.name+']').join(',   ')}`)

    const childNodes: SkillTreeNodeType[] = skillModels.map(m => { 
        return {
            id: m.id, 
            name: m.name,
            enabled: m.enabled
        } as SkillTreeNodeType
    })
    if (parentNode)
        parentNode.children = childNodes
    for(const childNode of childNodes) {
        await buildTree(progLangId, childNode.id, childNode, treeMode, extractionId)
    }
    return childNodes
}