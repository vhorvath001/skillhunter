import { FormEvent, ReactElement, createContext, useEffect, useReducer } from 'react'
import useAxiosFetch from '../hooks/useAxiosFetch'
import axios, { AxiosResponse } from 'axios'
import { client } from '../api/client'
import { ChildrenType, handleError } from './ContextFunctions'

export const REPOSITORY_ACTION_TYPES = {
    NEW: 'NEW',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    POPULATE: 'POPULATE',
    FILTER: 'FILTER'
}

export type RepositoryType = {
    id: string,
    name: string,
    desc?: string,
    url: string,
    token: string
}

export type RepositoryAction = {
    type: string,
    payload?: RepositoryType | RepositoryType[]
    id?: string
}

type RepositoryStateType = {
    list: RepositoryType[],
    originalList: RepositoryType[],
}

const handleDelete = async (dispatch: React.Dispatch<RepositoryAction>, handleClose: () => void, setErrorMessage: (errorMessage: string) => void, id: string) => {
    try {
        await axios({
            method: 'DELETE',
            url: client.defaults.baseURL + `/repositories/${id}` 
        });
        dispatch({ type: REPOSITORY_ACTION_TYPES.DELETE, id: id })
        handleClose();
    } catch(err) {
        handleError(err, setErrorMessage)
    }
}

const handleSave = async (dispatch: React.Dispatch<RepositoryAction>, e: FormEvent<HTMLFormElement>, handleClose: () => void, setErrorMessage: (errorMessage: string) => void) => {
    e.preventDefault();

    const formData: FormData = new FormData(e.currentTarget);
    let formDataObj = Object.fromEntries(formData.entries());
    let verb: string = 'PUT';
    if (formDataObj.id == '-1') {
        verb = 'POST';
        formDataObj.id = '';
    }

    try {
        const resp: AxiosResponse = await axios({
            method: verb, 
            url: client.defaults.baseURL + '/repositories' + (verb == 'PUT' ? `/${formDataObj.id}` : ''), 
            data: formDataObj 
        }); 
        dispatch({ 
            type: verb === 'POST' ? REPOSITORY_ACTION_TYPES.NEW : REPOSITORY_ACTION_TYPES.EDIT, 
            payload: resp.data 
        })       
        handleClose();
    } catch (err) {
        handleError(err, setErrorMessage)
    }
}

const handleFilter = (dispatch: React.Dispatch<RepositoryAction>, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData: FormData = new FormData(e.currentTarget)

    dispatch({
        type: REPOSITORY_ACTION_TYPES.FILTER,
        payload: {
            name: formData.get('list_filter_name')?.toString() ?? '',
            url: formData.get('list_filter_url')?.toString() ?? '',
            token: '-',
            id: '-1'
        }
    })
}

const initState: UseRepositoryContextType = { 
    dispatch: () => {}, 
    state: {} as RepositoryStateType, 
    isLoading: false, 
    fetchError: '', 
    handleDelete: handleDelete, 
    handleSave: handleSave,
    handleFilter: handleFilter
}

const RepositoryContext = createContext<UseRepositoryContextType>(initState);

const reducer = (state: RepositoryStateType, action: RepositoryAction): RepositoryStateType => {
    switch (action.type) {
        case REPOSITORY_ACTION_TYPES.DELETE: {
            const removableId = action.id!
            const filteredList = state.list.filter((i) => i.id !== removableId)
            const filteredOriginalList = state.originalList.filter((i) => i.id !== removableId)
            return {...state, list: filteredList, originalList: filteredOriginalList}
        }
        case REPOSITORY_ACTION_TYPES.NEW: {
            const updatedList = sortList([...state.list, action.payload! as RepositoryType])
            const updatedOriginalList = sortList([...state.originalList, action.payload! as RepositoryType])
            return {...state, list: updatedList, originalList: updatedOriginalList}
        }
        case REPOSITORY_ACTION_TYPES.EDIT: {
            const repository: RepositoryType = action.payload! as RepositoryType 
            const updatedList = sortList(state.list.map((i) => i.id == repository.id ? repository : i));
            const updatedOriginalList = sortList(state.originalList.map((i) => i.id == repository.id ? repository : i));
            return {...state, list: updatedList, originalList: updatedOriginalList}
        }
        case REPOSITORY_ACTION_TYPES.POPULATE: {
            return {...state, list: sortList(action.payload! as RepositoryType[]), originalList: sortList(action.payload! as RepositoryType[])}
        }
        case REPOSITORY_ACTION_TYPES.FILTER: {
            const filters: RepositoryType = action.payload! as RepositoryType 
            const filteredList = sortList(state.originalList.filter(d => 
                (filters.name ? d.name.toLowerCase().includes(filters.name.toLowerCase()) : true) && 
                (filters.url ? d.url.toLowerCase().includes(filters.url.toLowerCase()) : true)
            ))
            return {...state, list: filteredList}
        }
        default:
            throw new Error('Unidentified reducer action type!')
    }
}

const sortList = (l: RepositoryType[]) => {
    if (l && l instanceof Array) {
        l.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 
                        a.name.toLowerCase() === b.name.toLowerCase() ? 0 : -1);
        return l;
    } else {
        return []
    }
}

const useRepositoryContext = () => {
    const { data, isLoading, fetchError } = useAxiosFetch('/repositories')
    const [ state, dispatch ] = useReducer(reducer, { list: data, originalList: data })

    useEffect(() => {
        dispatch({ type: REPOSITORY_ACTION_TYPES.POPULATE, payload: data})
    }, [data])

    return { dispatch, state, isLoading, fetchError, handleDelete, handleSave, handleFilter }
}

export type UseRepositoryContextType = ReturnType<typeof useRepositoryContext>

export const RepositoryProvider = ({ children }: ChildrenType): ReactElement => {
    return (
        <RepositoryContext.Provider value={useRepositoryContext()}>
            {children}
        </RepositoryContext.Provider>
    )
}

export default RepositoryContext