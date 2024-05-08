import { ReactElement, createContext, useEffect, useReducer, useState } from 'react'
import { ChildrenType, OptionType, handleError } from './ContextFunctions'
import useAxiosFetch from '../hooks/useAxiosFetch'
import { ProgLangType } from './ProgLangProvider'
import { client } from '../api/client'

const SKILL_TREE_ACTION_TYPE = {
    DELETE: 'DELETE',
    STATUS_CHANGE: 'STATUS_CHANGE',
    POPULATE: 'POPULATE'
}

type SkillTreeStateType = {
    skillTree: SkillTreeNodeType[] 
}

type SkillTreeAction = {
    type: string,
    payload: SkillTreeNodeType[],
    ids?: number[],
    status?: string
}

export type SkillTreeNodeType = {
    id: number,
    name: string,
    enabled: boolean,
    children: SkillTreeNodeType[]
    selected: boolean
}

const loadTree = async (progLangId: number, dispatch: React.Dispatch<SkillTreeAction>, setTreeIsLoading: (treeIsLoading: boolean) => void, setTreeErrorMessage: (treeErrorMessage: string) => void): Promise<void> => {
    setTreeIsLoading(true)
    client.get(`/skills/${progLangId}`)
    .then(resp => {
        dispatch({ type: SKILL_TREE_ACTION_TYPE.POPULATE, payload: resp.data })
    })
    .catch(err => {
        handleError(err, setTreeErrorMessage)
    })
    .finally(() => {
        setTreeIsLoading(false)
    })
}

const handleStatusChange = (operation: string, treeData: SkillTreeNodeType[], dispatch: React.Dispatch<SkillTreeAction>): void => {
    const ids: number[] = collectIds(treeData, operation, [])

    client.post('/skills/status', {
        ids: ids,
        status: operation
    })
    dispatch({
        type: SKILL_TREE_ACTION_TYPE.STATUS_CHANGE,
        payload: treeData,
        ids: ids,
        status: operation
    })
}

const handleDelete = (treeData: SkillTreeNodeType[], dispatch: React.Dispatch<SkillTreeAction>): void => {
    const ids: number[] = collectIds(treeData, '-', [])

    client.delete('/skills', {
        data: {ids: ids}
    })
    dispatch({
        type: SKILL_TREE_ACTION_TYPE.DELETE,
        payload: treeData,
        ids: ids
    })
}

const collectIds = (nodes: SkillTreeNodeType[], operation: string, topDownWalkIds: number[]): number[] => {
    let ids: number[] = nodes.filter(n => n.selected).map(n => n.id)
    for(const node of nodes) {
        if (node.selected) {
            ids.push(...collectAllIds(node))
            if (operation === 'ENABLE')
                ids.push(...topDownWalkIds)
        }
        ids.push(...collectIds(node.children, operation, [...topDownWalkIds, node.id]))
    }
    return ids
}

const collectAllIds = (node: SkillTreeNodeType): number[] => {
    let ids: number[] = node.children.map(n => n.id)
    for(const n of node.children) {
        ids.push(...collectAllIds(n))
    }
    return ids
}

const disableNodes = (treeNodes: SkillTreeNodeType[], ids: number[], status: string): void => {
    for(const treeNode of treeNodes) {
        if (ids.includes(treeNode.id))
            treeNode.enabled = status === 'ENABLE' ? true : false
        disableNodes(treeNode.children, ids, status)
    }
}

const deleteNodes = (treeNodes: SkillTreeNodeType[], ids: number[]): void => {
    let ind: number = 0
    while (ind < treeNodes.length) {
        if (ids.includes(treeNodes[ind].id)) treeNodes.splice(ind, 1)
        else ind++
    }
    for(const treeNode of treeNodes) {
        deleteNodes(treeNode.children, ids)
    }
}

const initState: UseSkillTreeContextType = { 
    dispatch: () => {},
    state: {} as SkillTreeStateType,
    progLangs: [],
    setSelectedProgLang: () => {},
    isLoading: false, 
    fetchError: '', 
    treeIsLoading: false, 
    treeErrorMessage: '',
    handleStatusChange: () => {},
    handleDelete: () => {}
}

const SkillTreeContext = createContext<UseSkillTreeContextType>(initState)

const reducer = (state: SkillTreeStateType, action: SkillTreeAction): SkillTreeStateType => {
    switch (action.type) {
        case SKILL_TREE_ACTION_TYPE.POPULATE: {
            return { ...state, skillTree: action.payload }
        }
        case SKILL_TREE_ACTION_TYPE.STATUS_CHANGE: {
            const ids: number[] = action.ids!
            const treeNodes: SkillTreeNodeType[] = action.payload
            const status: string = action.status!
            disableNodes(treeNodes, ids, status)
            return { ...state, skillTree: treeNodes }
        }
        case SKILL_TREE_ACTION_TYPE.DELETE: {
            const ids: number[] = action.ids!
            const treeNodes: SkillTreeNodeType[] = action.payload
            deleteNodes(treeNodes, ids)
            return { ...state, skillTree: treeNodes }

        }
        default:
            throw new Error('Unidentified reducer action type!')
    }
}

const useSkillTreeContext = () => {
    const { data, isLoading, fetchError } = useAxiosFetch('/prog-langs')
    const [ progLangs, setProgLangs ] = useState<OptionType[]>([])
    const [ selectedProgLang, setSelectedProgLang ] = useState<number>(-1)
    const [ treeIsLoading, setTreeIsLoading ] = useState<boolean>(false)
    const [ treeErrorMessage, setTreeErrorMessage ] = useState<string>('')
    const [ state, dispatch ] = useReducer(reducer, { skillTree: [] })

    useEffect(() => {
        setProgLangs(
            (data as ProgLangType[]).map(pl => { return {key: pl.id, value: pl.name} as OptionType})
        )
        }, [isLoading])

    useEffect(() => {
        if (selectedProgLang === -1)
            dispatch({ type: SKILL_TREE_ACTION_TYPE.POPULATE, payload: []})
        else
            loadTree(selectedProgLang, dispatch, setTreeIsLoading, setTreeErrorMessage)
    }, [ selectedProgLang ])

    return { dispatch, state, progLangs, setSelectedProgLang, isLoading, fetchError, treeIsLoading, treeErrorMessage, handleStatusChange, handleDelete }
}

export type UseSkillTreeContextType = ReturnType<typeof useSkillTreeContext>

export const SkillTreeProvider = ({ children }: ChildrenType): ReactElement => {
    return (
        <SkillTreeContext.Provider value={useSkillTreeContext()}>
            {children}
        </SkillTreeContext.Provider>
    )
}

export default SkillTreeContext