import { FormEvent, ReactElement, createContext, useEffect, useReducer, useState } from 'react'
import { ChildrenType, OptionType, handleError } from './ContextFunctions'
import { RepositoryType } from './RepositoryProvider'
import { client } from '../api/client'
import { ProgLangType } from './ProgLangProvider'
import { format } from 'date-fns'

export type ProjectsBranchesType = {
    id: string,
    name: string,
    branches: string[]
}

export type ExtractionType = {
    id: number,
    startDate: Date,
    projectsBranches: SelectedProjectBranchesType[],
    path: string,
    status: string,
    progressProjects?: string,
    progressCommits?: string,
    repository: RepositoryType,
    progLangs: ProgLangType[]
}

type SelectedProjectBranchesType = {
    projectId: string,
    projectName: string,
    branch: string
}

type ProgressLogType = {
    timestamp: Date,
    logText: string
}

export const EXTRACTION_ACTION_TYPES = {
    DELETE: 'DELETE',
    POPULATE: 'POPULATE'
}

export type ExtractionAction = {
    type: string,
    id?: number,
    payload?: ExtractionType[]
}

export type ExtractionStateType = {
    list: ExtractionType[]
}

export const handleStartExtraction = async (e: FormEvent<HTMLFormElement>, 
                                            handleClose: () => void, 
                                            show2ndPage: boolean, 
                                            setShow2ndPage: (show2ndPage: boolean) => void, 
                                            setErrorMessage: (errorMessage: string) => void, 
                                            selectedProgLangs: string[]) => {
    e.preventDefault()

    if (!show2ndPage) {
        setShow2ndPage(true)
    } else {
        const formData: FormData = new FormData(e.currentTarget)

        let projectsBranches: SelectedProjectBranchesType[] = []
        for (let [key] of formData.entries()) {
            if (key.startsWith('project_')) {
                const id = key.slice(8)
                projectsBranches.push({
                    projectId: id,
                    projectName: formData.get('projectname_'+id)!.toString(),
                    branch: formData.get('branch_'+id)!.toString()
                })
            }
        }

        return client
            .post('extractions', {
                repoId: formData.get('repository'),
                path: formData.get('path'),
                progLangs: selectedProgLangs,
                projectsBranches: projectsBranches
            })
            .then(() => {
                handleClose()
                setShow2ndPage(false)        
            })
            .catch(err => {
                handleError(err, setErrorMessage)
            })
    }
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
        default:
            throw new Error('Unidentified reducer action type!')
    }
}

export const initState: UseExtractionContextType = {
    handleStartExtraction: handleStartExtraction,
    show2ndPage: false,
    setShow2ndPage: () => {}, 
    showStartExtraction: false,
    setShowStartExtraction: () => {},
    repositoryOptions: [], 
    errorMessage: '',
    setErrorMessage: () => {},
    isLoading: true,
    pathTextfield: '', 
    setPathTextfield: () => {},
    projectsBranchesData: [],
    progLangOptions: [],
    selectedProgLangs: [], 
    setSelectedProgLangs: () => {},
    setRepoId: () => {}, 
    filterRepoId: -1,
    setFilterRepoId: () => {}, 
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
    handleDelete: () => {}
}

const useExtractionContext = () => {
    const [ showStartExtraction, setShowStartExtraction ] = useState<boolean>(false);
    const [ show2ndPage, setShow2ndPage ] = useState<boolean>(false)
    const [ repositoryOptions, setRepositoryOptions ] = useState<OptionType[]>([])
    const [ progLangOptions, setProgLangOptions ] = useState<OptionType[]>([])
    const [ errorMessage, setErrorMessage ] = useState<string>('')
    const [ pathTextfield, setPathTextfield ] = useState<string>('')
    const [ projectsBranchesData, setProjectsBranchesData ] = useState<ProjectsBranchesType[]>([])
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ selectedProgLangs, setSelectedProgLangs ] = useState<string[]>([])
    const [ repoId, setRepoId ] = useState<number>(-1)
    const [ filterRepoId, setFilterRepoId ] = useState<number>(-1)
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

    const fetchProjectsBranches = async () => {
        setIsLoading(true)
        setErrorMessage('')
        client.get(`/repositories/${repoId}/${encodeURIComponent(pathTextfield)}/projects/branches`)
            .then(resp => {
                setProjectsBranchesData(resp.data)
                setIsLoading(false)
            })
            .catch(err => {
                handleError(err, setErrorMessage)
                setIsLoading(false)
            })        
    }

    const fetchRepositories = async () => {
        setIsLoading(true)
        setErrorMessage('')
        client.get('repositories')
            .then(resp => {
                const repositories = resp.data as RepositoryType[]
                setRepositoryOptions(
                    repositories.map(r => { return {key: r.id, value: r.name} })
                )
                setIsLoading(false)
            })
            .catch(err => {
                handleError(err, setErrorMessage)
                setIsLoading(false)
            })
    }

    const fetchProgLangs = async () => {
        setIsLoading(true)
        setErrorMessage('')
        client.get('prog-langs')
            .then(resp => {
                const progLangs = resp.data as ProgLangType[]
                setProgLangOptions(
                    progLangs.map(r => { return { key: r.id!, value: r.name } })
                )
                setIsLoading(false)
            })
            .catch(err => {
                handleError(err, setErrorMessage)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        if (show2ndPage) {
            setProjectsBranchesData([])
            fetchProjectsBranches()
        } else {
            setRepositoryOptions([])
            setProgLangOptions([])
            fetchRepositories()
            fetchProgLangs()
        }
    }, [ show2ndPage ])

    return { handleStartExtraction, show2ndPage, setShow2ndPage, showStartExtraction, setShowStartExtraction, repositoryOptions, errorMessage, setErrorMessage, isLoading, 
             pathTextfield, setPathTextfield, projectsBranchesData, progLangOptions, selectedProgLangs, setSelectedProgLangs,
             setRepoId, filterRepoId, setFilterRepoId, handleFilterClick, filterDateFrom, setFilterDateFrom, filterDateTo, setFilterDateTo,
             filterErrorMessage, setFilterErrorMessage, state, dispatch, areExtractionsLoading, setAreExtractionsLoading,
             filterStatus, setFilterStatus, showExtractionDetails, setShowExtractionDetails, progressLogs, setProgressLogs,
             isProgressLogLoading, setIsProgressLogLoading, progressLogErrorMessage, setProgressLogErrorMessage, loadProgressLogs, handleDelete }
}

export type UseExtractionContextType = ReturnType<typeof useExtractionContext>

const ExtractionContext = createContext<UseExtractionContextType>(initState)

export const ExtractionProvider = ({ children }: ChildrenType): ReactElement => {
    return (
        <ExtractionContext.Provider value={useExtractionContext()}>
            {children}
        </ExtractionContext.Provider>
    )
}

export default ExtractionContext