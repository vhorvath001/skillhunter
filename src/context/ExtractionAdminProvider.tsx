import { ReactElement, createContext, useReducer, useState } from 'react'
import { handleError } from './ContextFunctions'
import { client } from '../api/client'
import { format } from 'date-fns'
import { ChildrenType, ExtractionType, ProgressLogType } from './AppTypes'

export const EXTRACTION_ACTION_TYPES = {
    DELETE: 'DELETE',
    POPULATE: 'POPULATE',
    CANCEL: 'CANCEL'
}

export type ExtractionAction = {
    type: string,
    id?: number,
    payload?: ExtractionType[]
}

export type ExtractionStateType = {
    list: ExtractionType[]
}

export type DevelopersScoresType = {
    developerId: number,
    developerName: string,
    totalScore: number
}

export const handleFilterClick = async (
                           filterRepoId: number, 
                           filterStatus: string, 
                           filterDateFrom: string, 
                           filterDateTo: string, 
                           setFilterErrorMessage: (filterErrorMessage: string) => void, 
                           dispatch: React.Dispatch<ExtractionAction>, 
                           setAreExtractionsLoading: (areExtractionsLoading: boolean) => void) => {
    setAreExtractionsLoading(true)
    setFilterErrorMessage('')

    return client
        .get('extractions', {
            params: {
                repoId: filterRepoId,
                dateFrom: filterDateFrom,
                dateTo: filterDateTo,
                status: filterStatus
            }
        })
        .then(resp => dispatch({ 
            type: EXTRACTION_ACTION_TYPES.POPULATE, 
            payload: resp.data 
        }))
        .catch(err => handleError(err, setFilterErrorMessage))
        .finally(() => setAreExtractionsLoading(false))
}

const loadProgressLogs = (extractionId: number, 
                          setProgressLogs: (progressLogs: ProgressLogType[]) => void, 
                          setIsProgressLogLoading: (isProgressLogLoading: boolean) => void, 
                          setProgressLogErrorMessage: (progressLogErrorMessage: string) => void) => {
    setIsProgressLogLoading(true)
    setProgressLogErrorMessage('')
    client
        .get(`/extractions/${extractionId}/progressLogs`)
        .then(resp => setProgressLogs(resp.data))
        .catch(err => handleError(err, setProgressLogErrorMessage))
        .finally(() => setIsProgressLogLoading(false))
}

export const handleDelete = (dispatch: any, 
                             handleClose: () => void, 
                             setErrorMessage: (errorMessage: string) => void, 
                             extractionId: string) => {
    client
        .delete(`/extractions/${extractionId}`)
        .then(() => {
            dispatch({ type: EXTRACTION_ACTION_TYPES.DELETE, id: extractionId })
            handleClose()    
        })
        .catch(err => handleError(err, setErrorMessage))
}

export const handleCancel = (dispatch: any,
                             handleClose: () => void,
                             setErrorMessage: (errorMessage: string) => void,
                             extractionId: string) => {
    client
        .patch(`/extractions/${extractionId}`, {
            status: 'CANCELLED'
        })
        .then(() => {
            dispatch({ type: EXTRACTION_ACTION_TYPES.CANCEL, id: extractionId })
            handleClose()
        })
        .catch(err => handleError(err, setErrorMessage))
}


export const reducer = (state: ExtractionStateType, action: ExtractionAction): ExtractionStateType => {
    switch (action.type) {
        case EXTRACTION_ACTION_TYPES.DELETE: {
            const removableId = Number(action.id)
            const filteredList = state.list.filter((e) => e.id !== removableId)
            return {...state, list: filteredList}
        }
        case EXTRACTION_ACTION_TYPES.POPULATE: {
            return {...state, list: action.payload! }
        }
        case EXTRACTION_ACTION_TYPES.CANCEL: {
            const toUpdateId = Number(action.id)
            const extractionToUpdate: ExtractionType = state.list.find(r => r.id === toUpdateId)!
            extractionToUpdate.status = 'CANCELLED'
            const updatedList = state.list.map(r => r.id === toUpdateId ? extractionToUpdate : r)
            return {...state, list: updatedList}
        }
        default:
            throw new Error('Unidentified reducer action type!')
    }
}

export const initState: UseExtractionAdminContextType = {
    handleFilterClick: () => Promise.resolve(),
    filterDateFrom: '',
    setFilterDateFrom: () => {},
    filterDateTo: '',
    setFilterDateTo: () => {},
    filterErrorMessage: '', 
    setFilterErrorMessage: () => {},
    state: {} as ExtractionStateType, 
    dispatch: () => {},
    areExtractionsLoading: false, 
    setAreExtractionsLoading: () => {},
    filterStatus: '', 
    setFilterStatus: () => {},
    showExtractionDetails: false, 
    setShowExtractionDetails: () => {},
    progressLogs: [], 
    setProgressLogs: () => {},
    isProgressLogLoading: false, 
    setIsProgressLogLoading: () => {},
    progressLogErrorMessage: '',
    setProgressLogErrorMessage: () => {},
    loadProgressLogs: () => {},
    handleDelete: () => {},
    handleCancel: () => {}
}

const useExtractionAdminContext = () => {
    let currentDate = new Date()
    const [ filterDateFrom, setFilterDateFrom ] = useState<string>(format(currentDate, 'yyyy-MM-dd') + 'T00:00:00')
    const [ filterDateTo, setFilterDateTo ] = useState<string>(format(currentDate, 'yyyy-MM-dd') + 'T23:59:59')
    const [ filterErrorMessage, setFilterErrorMessage ] = useState<string>('')
    const [ areExtractionsLoading, setAreExtractionsLoading ] = useState<boolean>(false)
    const [ filterStatus, setFilterStatus ] = useState<string>('-1')
    const [ showExtractionDetails, setShowExtractionDetails ] = useState<boolean>(false)
    const [ progressLogs, setProgressLogs ] = useState<ProgressLogType[]>([])
    const [ isProgressLogLoading, setIsProgressLogLoading ] = useState<boolean>(false)
    const [ progressLogErrorMessage, setProgressLogErrorMessage ] = useState<string>('')
    const [ state, dispatch ] = useReducer(reducer, { list: [] })

    return { handleFilterClick, filterDateFrom, setFilterDateFrom, filterDateTo, setFilterDateTo,
             filterErrorMessage, setFilterErrorMessage, state, dispatch, areExtractionsLoading, setAreExtractionsLoading,
             filterStatus, setFilterStatus, showExtractionDetails, setShowExtractionDetails, progressLogs, setProgressLogs,
             isProgressLogLoading, setIsProgressLogLoading, progressLogErrorMessage, setProgressLogErrorMessage, loadProgressLogs, 
             handleDelete, handleCancel }
}

export type UseExtractionAdminContextType = ReturnType<typeof useExtractionAdminContext>

const ExtractionAdminContext = createContext<UseExtractionAdminContextType>(initState)

export const ExtractionAdminProvider = ({ children }: ChildrenType): ReactElement => {
    return (
        <ExtractionAdminContext.Provider value={useExtractionAdminContext()}>
            {children}
        </ExtractionAdminContext.Provider>
    )
}

export default ExtractionAdminContext