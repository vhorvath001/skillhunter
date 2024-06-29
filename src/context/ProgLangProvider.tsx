import { FormEvent, ReactElement, createContext, useEffect, useReducer } from 'react'
import useAxiosFetch from '../hooks/useAxiosFetch'
import axios, { AxiosResponse } from 'axios'
import { endpointBackEnd } from '../api/client'
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

export type RankingType = {
    name: string,
    rangeStart: number | null
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
    scope: string,
    ranking?: RankingType[]
}

export type ProgLangAction = {
    type: string,
    payload?: ProgLangType | ProgLangType[]
    id?: string,
    filter?: string
}

export type ProgLangStateType = {
    list: ProgLangType[],
    originalList: ProgLangType[],
}

export const handleDelete = async (dispatch: React.Dispatch<ProgLangAction>, handleClose: () => void, setErrorMessage: (errorMessage: string) => void, id: string) => {
    try {
        await axios({
            method: 'DELETE',
            url: `${endpointBackEnd}/prog-langs/${id}`
        })
        dispatch({ type: PROG_LANG_ACTION_TYPES.DELETE, id: id })
        handleClose();
    } catch(err) {
        handleError(err, setErrorMessage)
    }
}

export const handleSave = async (dispatch: React.Dispatch<ProgLangAction>, 
                                 e: FormEvent<HTMLFormElement>, 
                                 handleClose: () => void, 
                                 setErrorMessage: (errorMessage: string) => void) => {
    e.preventDefault()
    setErrorMessage('')

    const formData: FormData = new FormData(e.currentTarget)
    const progLang: ProgLangType | null = toProgLangType(formData, setErrorMessage)
    if (!progLang)
        return
    let verb: string = 'PUT';
    if (formData.get('id') === '-1') {
        verb = 'POST';
    }

    try {
        const resp: AxiosResponse = await axios({
            method: verb, 
            url: `${endpointBackEnd}/prog-langs` + (verb == 'PUT' ? `/${formData.get('id')}` : ''), 
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

const toProgLangType = (formData: FormData, setErrorMessage: (errorMessage: string) => void): ProgLangType | null => {
    let patterns: string[] = []
    let packageRemovalPatterns: PackageRemovalPatternType[] = []
    let ranking: RankingType[] = []
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
        if (pair[0].startsWith('rankingListItem_')) {
            const index = getIndex(pair[0])
            if (!ranking[index])
                ranking[index] = {name: '', rangeStart: 0}
            if (pair[0].startsWith('rankingListItem_name'))
                ranking[index].name = pair[1].toString()
            else
                ranking[index].rangeStart = pair[1].toString() ? Number(pair[1].toString()) : null
        }
    }

    if (isRankingInvalid(ranking, setErrorMessage)) {
        return null
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
        scope: formData.get('scope')!.toString(),
        ranking: ranking.filter(r => r)
    }
    if (formData.get('id') && formData.get('id') !== '-1')
        progLang.id = formData.get('id')!.toString()
    return progLang
}

const isRankingInvalid = (ranking: RankingType[], setErrorMessage: (errorMessage: string) => void): boolean => {
    if (ranking.some(r => !r.name || r.rangeStart === null)) {
        setErrorMessage('None of the following elements can be empty: Name, Range start!')
        return true
    }
    if (ranking.length > 0 && ranking[ranking.length-1].rangeStart !== 0) {
        setErrorMessage(`The first (bottom) ranking item's starting range must be zero!`)
        return true
    }
    if (ranking.some((r, i) => i !==0 && r.rangeStart! > ranking[i-1].rangeStart!)) {
        setErrorMessage(`The ranking items' starting range values must be in ascending order!`)
        return true
    }
    return false
}

const getIndex = (name: string): number => {
    if (name.startsWith('packageRemovalPatternListItem_value_'))
        return Number(name.replace('packageRemovalPatternListItem_value_', ''))
    else if (name.startsWith('packageRemovalPatternListItem_type_'))
        return Number(name.replace('packageRemovalPatternListItem_type_', ''))
    else if (name.startsWith('rankingListItem_rangeStart_'))
        return Number(name.replace('rankingListItem_rangeStart_', ''))
    else
        return Number(name.replace('rankingListItem_name_', ''))
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

export const reducer = (state: ProgLangStateType, action: ProgLangAction): ProgLangStateType => {
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

export const sortList = (l: ProgLangType[]) => {
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