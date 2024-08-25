import { ReactElement, createContext, useEffect, useReducer, useState } from 'react'
import { handleError } from './ContextFunctions'
import { client, endpointBackEnd } from '../api/client'
import { ChildrenType, OptionType, ProgLangType, SkillTreeNodeType } from './AppTypes'
import axios, { AxiosResponse } from 'axios'

export const SKILL_TREE_ACTION_TYPE = {
    DELETE: 'DELETE',
    STATUS_CHANGE: 'STATUS_CHANGE',
    POPULATE: 'POPULATE'
}

export type SkillTreeStateType = {
    skillTree: SkillTreeNodeType[] 
}

export type SkillTreeAction = {
    type: string,
    payload: SkillTreeNodeType[],
    ids?: number[],
    status?: string
}

const loadTree = async (progLangId: number, dispatch: React.Dispatch<SkillTreeAction>, setTreeIsLoading: (treeIsLoading: boolean) => void, setTreeErrorMessage: (treeErrorMessage: string) => void, treeMode: string, extractionId: number|undefined): Promise<void> => {
    setTreeIsLoading(true)
    client.get(`/skills/${progLangId}/${treeMode}/${extractionId}`)
        .then(resp => {
            dispatch({ 
                type: SKILL_TREE_ACTION_TYPE.POPULATE, 
                payload: resp.data })
        })
        .catch(err => {
            handleError(err, setTreeErrorMessage)
        })
        .finally(() => {
            setTreeIsLoading(false)
        })
}

export const handleStatusChange = async (
        operation: string, 
        treeData: SkillTreeNodeType[], 
        dispatch: React.Dispatch<SkillTreeAction>, 
        setTreeOperationErrorMessage: (treeErrorMessage: string) => void) => {
    const ids: number[] = collectIds(treeData, operation, [])

    return client.post('/skills/status', {
        ids: ids,
        status: operation
    })
    .then(() => {
        dispatch({
            type: SKILL_TREE_ACTION_TYPE.STATUS_CHANGE,
            payload: treeData,
            ids: ids,
            status: operation
        })    
    })
    .catch(err => {
        handleError(err, setTreeOperationErrorMessage)
    })
}

export const handleDelete = async (
        dispatch: React.Dispatch<SkillTreeAction>, 
        handleClose: () => void,
        setTreeOperationErrorMessage: (treeErrorMessage: string) => void,
        treeData: SkillTreeNodeType[]) => {
    const ids: number[] = collectIds(treeData, '-', [])

    return client.delete('/skills', {
        data: {ids: ids}
    })
    .then(() => {
        dispatch({
            type: SKILL_TREE_ACTION_TYPE.DELETE,
            payload: treeData,
            ids: ids
        })
        handleClose()
    })
    .catch(err => {
        handleError(err, setTreeOperationErrorMessage)
    })
}

const collectIds = (nodes: SkillTreeNodeType[], operation: string, topDownWalkIds: number[]): number[] => {
    let ids: number[] = nodes.filter(n => n.selected)
                             .map(n => n.id)
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

const fetchProgLangs = async (setProgLangs: React.Dispatch<React.SetStateAction<OptionType[]>>, 
                              extractionId: number|undefined,
                              setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
                              setFetchError: React.Dispatch<React.SetStateAction<string>>,
                              treeMode: string) => {
    try {
        setIsLoading(true)
        const url: string = treeMode === 'select' ? `${endpointBackEnd}/prog-langs/extractions/${extractionId}` : `${endpointBackEnd}/prog-langs`
        const resp: AxiosResponse = await axios({
            method: 'GET', 
            url: url
        })

        setProgLangs( (resp.data as ProgLangType[]).map(pl => { 
            return {
                key: pl.id, 
                value: pl.name
            } as OptionType
        }))
    } catch(err) {
        handleError(err, setFetchError)
    } finally {
        setIsLoading(false)
    }
}

export const initState: UseSkillTreeContextType = { 
    dispatch: () => {},
    state: {} as SkillTreeStateType,
    progLangs: [],
    setSelectedProgLang: () => {},
    isLoading: false, 
    fetchError: '', 
    treeIsLoading: false, 
    treeErrorMessage: '',
    handleStatusChange: () => Promise.resolve(),
    handleDelete: () => Promise.resolve(),
    treeOperationErrorMessage: '', 
    setTreeOperationErrorMessage: () => {},
    selectedProgLang: -1,
    treeMode: '', 
    setTreeMode: () => {},
    setExtractionId: () => {}
}

const SkillTreeContext = createContext<UseSkillTreeContextType>(initState)

export const reducer = (state: SkillTreeStateType, action: SkillTreeAction): SkillTreeStateType => {
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
    // const { data, isLoading, fetchError } = useAxiosFetch('/prog-langs')
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ fetchError, setFetchError ] = useState<string>('')
    const [ progLangs, setProgLangs ] = useState<OptionType[]>([])
    const [ selectedProgLang, setSelectedProgLang ] = useState<number>(-1)
    const [ treeIsLoading, setTreeIsLoading ] = useState<boolean>(false)
    const [ treeErrorMessage, setTreeErrorMessage ] = useState<string>('')
    const [ state, dispatch ] = useReducer(reducer, { skillTree: [] })
    const [ treeOperationErrorMessage, setTreeOperationErrorMessage ] = useState<string>('')
    const [ treeMode, setTreeMode ] = useState<string>('')
    const [ extractionId, setExtractionId ] = useState<number|undefined>(-1)

    // useEffect(() => {
    //     if (!isLoading && !fetchError)
    //         setProgLangs( (data as ProgLangType[]).map(pl => { 
    //             return {
    //                 key: pl.id, 
    //                 value: pl.name
    //             } as OptionType
    //         }))
    // }, [ isLoading ])

    useEffect(() => {
        fetchProgLangs(setProgLangs, extractionId, setIsLoading, setFetchError, treeMode)
    }, [ extractionId ])

    useEffect(() => {
        if (selectedProgLang === -1)
            dispatch({ 
                type: SKILL_TREE_ACTION_TYPE.POPULATE, 
                payload: []
            })
        else
            loadTree(selectedProgLang, dispatch, setTreeIsLoading, setTreeErrorMessage, treeMode, extractionId)
    }, [ selectedProgLang ])

    return { dispatch, state, progLangs, setSelectedProgLang, isLoading, fetchError, treeIsLoading, treeErrorMessage, 
             handleStatusChange, handleDelete, treeOperationErrorMessage, setTreeOperationErrorMessage, selectedProgLang,
             treeMode, setTreeMode, setExtractionId }
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