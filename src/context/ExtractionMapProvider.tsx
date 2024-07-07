import { ReactElement, createContext, useEffect, useState } from 'react'
import { handleError } from './ContextFunctions'
import { client } from '../api/client'
import { ChildrenType, ExtractionType } from './AppTypes'

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

export const initState: UseExtractionMapContextType = {
    showExtractionMap: false,
    setShowExtractionMap: () => {},
    showSkillTreeSelection: false, 
    setShowSkillTreeSelection: () => {},
    setSelectedSkill: () => {},
    selectedSkill: [],
    extraction: null, 
    setExtraction: () => {},
    isDevelopersScoresLoading: false, 
    setIsDevelopersScoresLoading: () => {},
    developersScores: [],
    developersScoresErrorMessage: '',
    setDevelopersScores: () => {}
}

const useExtractionMapContext = () => {
    const [ showExtractionMap, setShowExtractionMap ] = useState<boolean>(false)
    const [ showSkillTreeSelection, setShowSkillTreeSelection ] = useState<boolean>(false)
    const [ selectedSkill, setSelectedSkill ] = useState<any[]>([])
    const [ extraction, setExtraction ] = useState<ExtractionType|null>(null)
    const [ developersScores, setDevelopersScores ] = useState<DevelopersScoresType[]>([])
    const [ isDevelopersScoresLoading, setIsDevelopersScoresLoading ] = useState<boolean>(false)
    const [ developersScoresErrorMessage, setDevelopersScoresErrorMessage ] = useState<string>('')

    const fetchDevelopersScores = async (skillId: number) => {
        setIsDevelopersScoresLoading(true)
        client.get(`/extractions/${extraction!.id}/skills/${skillId}/developersScores`)
            .then(resp => {
                setDevelopersScores(resp.data)
                setIsDevelopersScoresLoading(false)
                console.log(JSON.stringify(resp))
            })
            .catch(err => {
                handleError(err, setDevelopersScoresErrorMessage)
                setIsDevelopersScoresLoading(false)
            })
    }

    useEffect(() => {
        if (!showExtractionMap)
            setSelectedSkill([])
    }, [showExtractionMap])

    useEffect(() => {
        if (selectedSkill.length > 0 && extraction) {
            fetchDevelopersScores(selectedSkill[0])
        }
    }, [selectedSkill])

    return { showExtractionMap, setShowExtractionMap, showSkillTreeSelection, setShowSkillTreeSelection, setSelectedSkill, selectedSkill,
             extraction, setExtraction, isDevelopersScoresLoading, setIsDevelopersScoresLoading, developersScores, 
             developersScoresErrorMessage, setDevelopersScores }
}

export type UseExtractionMapContextType = ReturnType<typeof useExtractionMapContext>

const ExtractionMapContext = createContext<UseExtractionMapContextType>(initState)

export const ExtractionMapProvider = ({ children }: ChildrenType): ReactElement => {
    return (
        <ExtractionMapContext.Provider value={useExtractionMapContext()}>
            {children}
        </ExtractionMapContext.Provider>
    )
}

export default ExtractionMapContext