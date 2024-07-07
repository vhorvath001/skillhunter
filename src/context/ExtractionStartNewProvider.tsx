import { FormEvent, ReactElement, createContext, useEffect, useState } from 'react'
import { handleError } from './ContextFunctions'
import { client } from '../api/client'
import { ChildrenType, ExtractionType, OptionType, ProgLangType, ProjectsBranchesType, RepositoryType, SelectedProjectBranchesType } from './AppTypes'

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

export type DevelopersScoresType = {
    developerId: number,
    developerName: string,
    totalScore: number
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

export const initState: UseExtractionStartNewContextType = {
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
}

const useExtractionStartNewContext = () => {
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

    return { handleStartExtraction, show2ndPage, setShow2ndPage, showStartExtraction, setShowStartExtraction, repositoryOptions, errorMessage, setErrorMessage, 
             isLoading, pathTextfield, setPathTextfield, projectsBranchesData, progLangOptions, selectedProgLangs, setSelectedProgLangs,
             setRepoId, filterRepoId, setFilterRepoId }
}

export type UseExtractionStartNewContextType = ReturnType<typeof useExtractionStartNewContext>

const ExtractionStartNewContext = createContext<UseExtractionStartNewContextType>(initState)

export const ExtractionStartNewProvider = ({ children }: ChildrenType): ReactElement => {
    return (
        <ExtractionStartNewContext.Provider value={useExtractionStartNewContext()}>
            {children}
        </ExtractionStartNewContext.Provider>
    )
}

export default ExtractionStartNewContext