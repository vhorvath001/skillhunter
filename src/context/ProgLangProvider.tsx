import { FormEvent, ReactElement, createContext, useEffect, useReducer } from 'react'
import useAxiosFetch from '../hooks/useAxiosFetch'
import axios, { AxiosResponse } from 'axios'
import { client } from '../api/client'
import { ChildrenType, handleError } from './ContextFunctions'

export const PROG_LANG_ACTION_TYPES = {
    NEW: 'NEW',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    POPULATE: 'POPULATE',
    FILTER: 'FILTER'
}

export type PackageRemovalPatternType = {
    type: string,
    value: string
}

export type ProgLangType = {
    id?: string,
    name: string,
    desc?: string,
    sourceFiles: string,
    level: number,
    packageSeparator?: string,
    removingTLDPackages: boolean,
    patterns: string[],
    packageRemovalPatterns: PackageRemovalPatternType[],
    ignoringLinesPatterns: string[],
    scope: string
}

export type ProgLangAction = {
    type: string,
    payload?: ProgLangType | ProgLangType[]
    id?: string,
    filter?: string
}

type ProgLangStateType = {
    list: ProgLangType[],
    originalList: ProgLangType[],
}

export const handleDelete = async (dispatch: React.Dispatch<ProgLangAction>, handleClose: () => void, setErrorMessage: (errorMessage: string) => void, id: string) => {
    try {
        await axios({
            method: 'DELETE',
            url: client.defaults.baseURL + `/prog-langs/${id}`
        })
        dispatch({ type: PROG_LANG_ACTION_TYPES.DELETE, id: id })
        handleClose();
    } catch(err) {
        handleError(err, setErrorMessage)
    }
}

const handleSave = async (dispatch: React.Dispatch<ProgLangAction>, e: FormEvent<HTMLFormElement>, handleClose: () => void, setErrorMessage: (errorMessage: string) => void) => {
    e.preventDefault();

    const formData: FormData = new FormData(e.currentTarget)
    const progLang: ProgLangType = toProgLangType(formData)
    let verb: string = 'PUT';
    if (formData.get('id') === '-1') {
        verb = 'POST';
    }

    try {
        const resp: AxiosResponse = await axios({
            method: verb, 
            url: client.defaults.baseURL + '/prog-langs' + (verb == 'PUT' ? `/${formData.get('id')}` : ''), 
            data: progLang
        }); 
        dispatch({ 
            type: verb === 'POST' ? PROG_LANG_ACTION_TYPES.NEW : PROG_LANG_ACTION_TYPES.EDIT, 
            payload: resp.data 
        })       
        handleClose();
    } catch (err) {
        handleError(err, setErrorMessage)
    }
}

const handleFilter = (dispatch: React.Dispatch<ProgLangAction>, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData: FormData = new FormData(e.currentTarget)

    dispatch({
        type: PROG_LANG_ACTION_TYPES.FILTER,
        filter: formData.get('list_filter_name')?.toString() ?? ''
    })
}

const toProgLangType = (formData: FormData): ProgLangType => {
    let patterns: string[] = []
    let packageRemovalPatterns: PackageRemovalPatternType[] = []
    let ignoringLinesPatterns: string[] = []
    for (const pair of formData.entries()) {
        if (pair[0].startsWith('patternListItem_'))
            patterns.push(pair[1].toString())
        if (pair[0].startsWith('ignoringLinesPatternListItem_'))
            ignoringLinesPatterns.push(pair[1].toString())
        if (pair[0].startsWith('packageRemovalPatternListItem_')) {
            const index = getIndex(pair[0])
            if (!packageRemovalPatterns[index])
                packageRemovalPatterns[index] = {type: '', value: ''}
            if (pair[0].startsWith('packageRemovalPatternListItem_value_'))
                packageRemovalPatterns[index].value = pair[1].toString()
            else
                packageRemovalPatterns[index].type = pair[1].toString()
        }
    }
    const progLang: ProgLangType = {
        id: undefined,
        name: formData.get('name')!.toString(),
        desc: formData.get('desc')?.toString(),
        sourceFiles: formData.get('sourceFiles')!.toString(),
        level: Number(formData.get('level')!.toString()),
        packageSeparator: formData.get('packageSeparator')?.toString(),
        removingTLDPackages: formData.get('removingTLDPackages')?.toString() === 'on',
        patterns: patterns,
        packageRemovalPatterns: packageRemovalPatterns.filter(p => p),
        ignoringLinesPatterns: ignoringLinesPatterns,
        scope: formData.get('scope')!.toString()
    }
    if (formData.get('id') && formData.get('id') !== '-1')
        progLang.id = formData.get('id')!.toString()
    return progLang
}

const getIndex = (name: string): number => {
    if (name.startsWith('packageRemovalPatternListItem_value_'))
        return Number(name.replace('packageRemovalPatternListItem_value_', ''))
    else
        return Number(name.replace('packageRemovalPatternListItem_type_', ''))
}

const initState: UseProgLangContextType = { 
    dispatch: () => {}, 
    state: {} as ProgLangStateType, 
    isLoading: false, 
    fetchError: '', 
    handleDelete: handleDelete, 
    handleSave: handleSave,
    handleFilter: handleFilter
}

const ProgLangContext = createContext<UseProgLangContextType>(initState);

const reducer = (state: ProgLangStateType, action: ProgLangAction): ProgLangStateType => {
    switch (action.type) {
        case PROG_LANG_ACTION_TYPES.DELETE: {
            const removableId = action.id!
            const filteredList = state.list.filter((i) => i.id !== removableId)
            const filteredOriginalList = state.originalList.filter((i) => i.id !== removableId)
            return {...state, list: filteredList, originalList: filteredOriginalList}
        }
        case PROG_LANG_ACTION_TYPES.NEW: {
            const updatedList = sortList([...state.list, action.payload! as ProgLangType])
            const updatedOriginalList = sortList([...state.originalList, action.payload! as ProgLangType])
            return {...state, list: updatedList, originalList: updatedOriginalList}
        }
        case PROG_LANG_ACTION_TYPES.EDIT: {
            const progLang: ProgLangType = action.payload! as ProgLangType 
            const updatedList = sortList(state.list.map((i) => i.id == progLang.id ? progLang : i))
            const updatedOriginalList = sortList(state.originalList.map((i) => i.id == progLang.id ? progLang : i))
            return {...state, list: updatedList, originalList: updatedOriginalList}
        }
        case PROG_LANG_ACTION_TYPES.POPULATE: {
            return {...state, list: sortList(action.payload! as ProgLangType[]), originalList: sortList(action.payload! as ProgLangType[])}
        }
        case PROG_LANG_ACTION_TYPES.FILTER: {
            const filterName: string = action.filter!
            const filteredList = sortList(state.originalList.filter(d => 
                (filterName ? d.name.toLowerCase().includes(filterName.toLowerCase()) : true)
            ))
            return {...state, list: filteredList}
        }
        default:
            throw new Error('Unidentified reducer action type!')
    }
}

const sortList = (l: ProgLangType[]) => {
    if (l && l instanceof Array) {
        l.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 
                        a.name.toLowerCase() === b.name.toLowerCase() ? 0 : -1);
        return l;
    } else {
        return []
    }
}

const useProgLangContext = () => {
    const { data, isLoading, fetchError } = useAxiosFetch('/prog-langs')
    const [ state, dispatch ] = useReducer(reducer, { list: data, originalList: data })

    useEffect(() => {
        dispatch({ type: PROG_LANG_ACTION_TYPES.POPULATE, payload: data})
    }, [data])

    return { dispatch, state, isLoading, fetchError, handleDelete, handleSave, handleFilter }
}

export type UseProgLangContextType = ReturnType<typeof useProgLangContext>

export const ProgLangProvider = ({ children }: ChildrenType): ReactElement => {
    return (
        <ProgLangContext.Provider value={useProgLangContext()}>
            {children}
        </ProgLangContext.Provider>
    )
}

export default ProgLangContext