import { FormEvent, ReactElement, createContext, useEffect, useState } from 'react'
import { ChildrenType, OptionType, handleError } from './ContextFunctions'
import { RepositoryType } from './RepositoryProvider'
import { client } from '../api/client'
import { ProgLangType } from './ProgLangProvider'

export type ExtractionAction = {
    type: string
}

export type ProjectsBranchesType = {
    id: string,
    name: string,
    branches: string[]
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

        client.post('/extraction', {
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

    const fetchProjectsBranches = async () => {
        setIsLoading(true)
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
             setRepoId }
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