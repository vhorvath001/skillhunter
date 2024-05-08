import { FormEvent, ReactElement, createContext, useEffect, useState } from 'react'
import { ChildrenType, OptionType, handleError } from './ContextFunctions'
import { RepositoryType } from './RepositoryProvider'
import { client } from '../api/client'
import { ProgLangType } from './ProgLangProvider'
import { format } from 'date-fns'

export type ExtractionAction = {
    type: string
}

export type ProjectsBranchesType = {
    id: string,
    name: string,
    branches: string[]
}

export type ExtractionType = {
    id: number,
    startDate: Date,
    branches: string[],
    path: string,
    status: string,
    repository: RepositoryType,
    progLangs: ProgLangType[]
}

type ProjectBranchObj = Record<string, string>

export const handleStartExtraction = async (e: FormEvent<HTMLFormElement>, handleClose: () => void, show2ndPage: boolean, setShow2ndPage: (show2ndPage: boolean) => void, setErrorMessage: (errorMessage: string) => void, selectedProgLangs: string[]) => {
    e.preventDefault()

    if (!show2ndPage) {
        setShow2ndPage(true)
    } else {
        const formData: FormData = new FormData(e.currentTarget)

        let branches: ProjectBranchObj = {}
        for (let [key] of formData.entries()) {
            if (key.startsWith('project_')) {
                const id = key.slice(8)
                branches[id] = formData.get('branch_'+id)!.toString()
            }
        }

        client
            .post('extractions', {
                repoId: formData.get('repository'),
                path: formData.get('path'),
                progLangs: selectedProgLangs,
                branches: branches
            })
            .then(resp => {
                handleClose()
                setShow2ndPage(false)        
            })
            .catch(err => {
                handleError(err, setErrorMessage)
            })
    }
}

const handleFilterClick = (filterRepoId: number, filterStatus: string, filterDateFrom: string, filterDateTo: string, setFilterErrorMessage: (filterErrorMessage: string) => void, setExtractions: (extractions: ExtractionType[]) => void, setAreExtractionsLoading: (areExtractionsLoading: boolean) => void): void => {
    setAreExtractionsLoading(true)
    setFilterErrorMessage('')
    client
        .get('extractions', {
            params: {
                repoId: filterRepoId,
                dateFrom: filterDateFrom,
                dateTo: filterDateTo,
                status: filterStatus
            }
        })
        .then(resp => {
            setExtractions(resp.data)
        })
        .catch(err => {
            handleError(err, setFilterErrorMessage)
        })
        .finally(() => {
            setAreExtractionsLoading(false)
        })
}

const initState: UseExtractionContextType = {
    handleStartExtraction: handleStartExtraction,
    show2ndPage: false,
    setShow2ndPage: () => {}, 
    show: false,
    setShow: () => {},
    repositoryOptions: [], 
    errorMessage: '',
    setErrorMessage: () => {},
    isLoading: true,
    pathTextfield: '', 
    setPathTextfield: () => {},
    projectBranchesData: [],
    progLangOptions: [],
    selectedProgLangs: [], 
    setSelectedProgLangs: () => {},
    setRepoId: () => {}, 
    filterRepoId: -1,
    setFilterRepoId: () => {}, 
    handleFilterClick: () => {},
    filterDateFrom: '',
    setFilterDateFrom: () => {},
    filterDateTo: '',
    setFilterDateTo: () => {},
    filterErrorMessage: '', 
    setFilterErrorMessage: () => {},
    extractions: [], 
    setExtractions: () => {},
    areExtractionsLoading: false, 
    setAreExtractionsLoading: () => {},
    filterStatus: '', 
    setFilterStatus: () => {}
}

const useExtractionContext = () => {
    const [ show, setShow ] = useState<boolean>(false);
    const [ show2ndPage, setShow2ndPage ] = useState<boolean>(false)
    const [ repositoryOptions, setRepositoryOptions ] = useState<OptionType[]>([])
    const [ progLangOptions, setProgLangOptions ] = useState<OptionType[]>([])
    const [ errorMessage, setErrorMessage ] = useState<string>('')
    const [ pathTextfield, setPathTextfield ] = useState<string>('')
    const [ projectBranchesData, setProjectBranchesData ] = useState<ProjectsBranchesType[]>([])
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ selectedProgLangs, setSelectedProgLangs ] = useState<string[]>([])
    const [ repoId, setRepoId ] = useState<number>(-1)
    const [ filterRepoId, setFilterRepoId ] = useState<number>(-1)
    let currentDate = new Date()
    const [ filterDateFrom, setFilterDateFrom ] = useState<string>(format(currentDate, 'yyyy-MM-dd') + 'T00:00:00')
    const [ filterDateTo, setFilterDateTo ] = useState<string>(format(currentDate, 'yyyy-MM-dd') + 'T23:59:59')
    const [ filterErrorMessage, setFilterErrorMessage ] = useState<string>('')
    const [ extractions, setExtractions ] = useState<ExtractionType[]>([])
    const [ areExtractionsLoading, setAreExtractionsLoading ] = useState<boolean>(false)
    const [ filterStatus, setFilterStatus ] = useState<string>('-1')

    const fetchProjectsBranches = async () => {
        setIsLoading(true)
        setErrorMessage('')
        client.get(`/repositories/${repoId}/${pathTextfield}/projects/branches`)
            .then(resp => {
                setProjectBranchesData(resp.data)
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
            setProjectBranchesData([])
            fetchProjectsBranches()
        } else {
            setRepositoryOptions([])
            setProgLangOptions([])
            fetchRepositories()
            fetchProgLangs()
        }
    }, [ show2ndPage ])

    return { handleStartExtraction, show2ndPage, setShow2ndPage, show, setShow, repositoryOptions, errorMessage, setErrorMessage, isLoading, 
             pathTextfield, setPathTextfield, projectBranchesData, progLangOptions, selectedProgLangs, setSelectedProgLangs,
             setRepoId, filterRepoId, setFilterRepoId, handleFilterClick, filterDateFrom, setFilterDateFrom, filterDateTo, setFilterDateTo,
             filterErrorMessage, setFilterErrorMessage, extractions, setExtractions, areExtractionsLoading, setAreExtractionsLoading,
             filterStatus, setFilterStatus }
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