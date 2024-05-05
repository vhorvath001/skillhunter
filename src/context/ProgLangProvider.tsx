import { FormEvent, ReactElement, createContext, useEffect, useReducer } from 'react'
import useAxiosFetch from '../hooks/useAxiosFetch'
import axios, { AxiosResponse } from 'axios'
import { client } from '../api/client'
import { ChildrenType, handleError } from './ContextFunctions'

export const PROG_LANG_ACTION_TYPES = {
    NEW: 'NEW',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    POPULATE: 'POPULATE'
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
    scope: string
}

export type ProgLangAction = {
    type: string,
    payload?: ProgLangType | ProgLangType[]
    id?: string
}

type ProgLangStateType = {
    list: ProgLangType[]
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

const toProgLangType = (formData: FormData): ProgLangType => {
    let patterns: string[] = []
    for (const pair of formData.entries()) {
        if (pair[0].startsWith('patternListItem_')) patterns.push(pair[1].toString())
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
        scope: formData.get('scope')!.toString()
    }
    if (formData.get('id') && formData.get('id') !== '-1')
        progLang.id = formData.get('id')!.toString()
    return progLang
}

const initState: UseProgLangContextType = { 
    dispatch: () => {}, 
    state: {} as ProgLangStateType, 
    isLoading: false, 
    fetchError: '', 
    handleDelete: handleDelete, 
    handleSave: handleSave 
}

const ProgLangContext = createContext<UseProgLangContextType>(initState);

const reducer = (state: ProgLangStateType, action: ProgLangAction): ProgLangStateType => {
    switch (action.type) {
        case PROG_LANG_ACTION_TYPES.DELETE: {
            const removableId = action.id!
            const filteredList = state.list.filter((i) => i.id !== removableId)
            return {...state, list: filteredList}
        }
        case PROG_LANG_ACTION_TYPES.NEW: {
            const updatedList = sortList([...state.list, action.payload! as ProgLangType])
            return {...state, list: updatedList}
        }
        case PROG_LANG_ACTION_TYPES.EDIT: {
            const progLang: ProgLangType = action.payload! as ProgLangType 
            const updatedList = sortList(state.list.map((i) => i.id == progLang.id ? progLang : i));
            return {...state, list: updatedList}
        }
        case PROG_LANG_ACTION_TYPES.POPULATE: {
            return {...state, list: sortList(action.payload! as ProgLangType[])}
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
    const [state, dispatch] = useReducer(reducer, { list: data })

    useEffect(() => {
        dispatch({ type: PROG_LANG_ACTION_TYPES.POPULATE, payload: data})
    }, [data])

    return { dispatch, state, isLoading, fetchError, handleDelete, handleSave }
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