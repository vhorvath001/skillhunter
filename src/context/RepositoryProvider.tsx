import { FormEvent, ReactElement, createContext, useEffect, useReducer } from 'react'
import useAxiosFetch from '../hooks/useAxiosFetch'
import axios, { AxiosResponse } from 'axios'
import { client } from '../api/client'

export const REPOSITORY_ACTION_TYPES = {
    NEW: 'NEW',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    POPULATE: 'POPULATE'
}

export type RepositoryType = {
    id: string,
    name: string,
    desc?: string,
    url: string,
    token: string
}

type ChildrenType = { children?: ReactElement | ReactElement[] }

export type RepositoryAction = {
    type: string,
    payload?: RepositoryType | RepositoryType[]
    id?: string
}

type RepositoryStateType = {
    list: RepositoryType[]
}

const handleError = (err: any, setErrorMessage: (errorMessage: string) => void): void => {
    if (err instanceof Error)
        setErrorMessage(err.message)
    if (typeof err === 'string')
        setErrorMessage(err)
    console.error(err)
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

const initState: UseRepositoryContextType = { 
    dispatch: () => {}, 
    state: {} as RepositoryStateType, 
    isLoading: false, 
    fetchError: '', 
    handleDelete: handleDelete, 
    handleSave: handleSave 
}

const RepositoryContext = createContext<UseRepositoryContextType>(initState);

const reducer = (state: RepositoryStateType, action: RepositoryAction): RepositoryStateType => {
    switch (action.type) {
        case REPOSITORY_ACTION_TYPES.DELETE: {
            const removableId = action.id!
            const filteredList = state.list.filter((i) => i.id !== removableId)
            return {...state, list: filteredList}
        }
        case REPOSITORY_ACTION_TYPES.NEW: {
            const updatedList = sortList([...state.list, action.payload! as RepositoryType])
            return {...state, list: updatedList}
        }
        case REPOSITORY_ACTION_TYPES.EDIT: {
            const repository: RepositoryType = action.payload! as RepositoryType 
            const updatedList = sortList(state.list.map((i) => i.id == repository.id ? repository : i));
            return {...state, list: updatedList}
        }
        case REPOSITORY_ACTION_TYPES.POPULATE: {
            return {...state, list: sortList(action.payload! as RepositoryType[])}
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
    const { data, isLoading, fetchError } = useAxiosFetch('/repositories');
    const [state, dispatch] = useReducer(reducer, { list: data })

    useEffect(() => {
        dispatch({ type: REPOSITORY_ACTION_TYPES.POPULATE, payload: data})
    }, [data])

    return { dispatch, state, isLoading, fetchError, handleDelete, handleSave }
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