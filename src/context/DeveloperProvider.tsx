import { FormEvent, ReactElement, createContext, useEffect, useReducer } from 'react'
import { ChildrenType, handleError } from './ContextFunctions'
import useAxiosFetch from '../hooks/useAxiosFetch'
import axios, { AxiosResponse } from 'axios'
import { client } from '../api/client'

export const DEVELOPER_ACTION_TYPES = {
    POPULATE: 'POPULATE',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    FILTER: 'FILTER'
}

export type DeveloperType = {
    id?: number,
    name: string,
    email: string
}

export type DeveloperAction = {
    type: string,
    id?: number,
    payload?: DeveloperType | DeveloperType[]
}

type DeveloperStateType = {
    list: DeveloperType[],
    originalList: DeveloperType[],
}

export const handleDelete = async (dispatch: React.Dispatch<DeveloperAction>, handleClose: () => void, setErrorMessage: (errorMessage: string) => void, id: string) => {
    try {
        await axios({
            method: 'DELETE',
            url: client.defaults.baseURL + `/developers/${id}`
        })
        dispatch({ type: DEVELOPER_ACTION_TYPES.DELETE, id: Number(id) })
        handleClose()
    } catch(err) {
        handleError(err, setErrorMessage)
    }
}

const handleSave = async (dispatch: React.Dispatch<DeveloperAction>, e: FormEvent<HTMLFormElement>, handleClose: () => void, setErrorMessage: (errorMessage: string) => void) => {
    e.preventDefault();

    const formData: FormData = new FormData(e.currentTarget)
    const developer: DeveloperType = toDeveloperType(formData)

    try {
        const resp: AxiosResponse = await axios({
            method: 'PUT', 
            url: client.defaults.baseURL + `/developers/${formData.get('id')}`, 
            data: developer
        }); 
        dispatch({ 
            type: DEVELOPER_ACTION_TYPES.EDIT, 
            payload: resp.data 
        })       
        handleClose();
    } catch (err) {
        handleError(err, setErrorMessage)
    }
}

const handleFilter = (dispatch: React.Dispatch<DeveloperAction>, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData: FormData = new FormData(e.currentTarget)

    dispatch({
        type: DEVELOPER_ACTION_TYPES.FILTER,
        payload: {
            name: formData.get('list_filter_name')?.toString() ?? '',
            email: formData.get('list_filter_email')?.toString() ?? ''
        }
    })
}

const toDeveloperType = (formData: FormData): DeveloperType => {
    return {
        id: Number(formData.get('id')!.toString()),
        name: formData.get('name')!.toString(),
        email: formData.get('email')!.toString(),
    }
}

const initState: UseDeveloperContextType = {
    dispatch: () => {}, 
    state: {} as DeveloperStateType, 
    isLoading: false, 
    fetchError: '', 
    handleDelete: handleDelete, 
    handleSave: handleSave,
    handleFilter: handleFilter
}

const DeveloperContext = createContext<UseDeveloperContextType>(initState)

const sortList = (l: DeveloperType[]) => {
    if (l && l instanceof Array) {
        l.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 
                        a.name.toLowerCase() === b.name.toLowerCase() ? 0 : -1);
        return l;
    } else {
        return []
    }
}

const reducer = (state: DeveloperStateType, action: DeveloperAction): DeveloperStateType => {
    switch (action.type) {
        case DEVELOPER_ACTION_TYPES.POPULATE: {
            return {...state, list: sortList(action.payload! as DeveloperType[]), originalList: sortList(action.payload! as DeveloperType[])}
        }
        case DEVELOPER_ACTION_TYPES.EDIT: {
            const developer: DeveloperType = action.payload! as DeveloperType 
            const updatedList = sortList(state.list.map((i) => i.id == developer.id ? developer : i))
            const updatedOriginalList = sortList(state.originalList.map((i) => i.id == developer.id ? developer : i))
            return {...state, list: updatedList, originalList: updatedOriginalList}
        }
        case DEVELOPER_ACTION_TYPES.DELETE: {
            const removableId = action.id!
            const filteredList = state.list.filter((i) => i.id !== removableId)
            const filteredOriginalList = state.originalList.filter((i) => i.id !== removableId)
            return {...state, list: filteredList, originalList: filteredOriginalList}            
        }
        case DEVELOPER_ACTION_TYPES.FILTER: {
            const filters: DeveloperType = action.payload! as DeveloperType 
            const filteredList = sortList(state.originalList.filter(d => 
                (filters.name ? d.name.toLowerCase().includes(filters.name.toLowerCase()) : true) && 
                (filters.email ? d.email.toLowerCase().includes(filters.email.toLowerCase()) : true)
            ))
            return {...state, list: filteredList}
        }
        default:
            throw new Error('Unidentified reducer action type!')
    }
}

const useDeveloperContext = () => {
    const { data, isLoading, fetchError } = useAxiosFetch('/developers')
    const [ state, dispatch ] = useReducer(reducer, { list: data, originalList: data })

    useEffect(() => {
        dispatch({ type: DEVELOPER_ACTION_TYPES.POPULATE, payload: data })
    }, [data])

    return { dispatch, state, isLoading, fetchError, handleDelete, handleSave, handleFilter }
}

export type UseDeveloperContextType = ReturnType<typeof useDeveloperContext>

export const DeveloperProvider = ({ children }: ChildrenType): ReactElement => {
    return (
        <DeveloperContext.Provider value={useDeveloperContext()}>
            {children}
        </DeveloperContext.Provider>
    )
}

export default DeveloperContext