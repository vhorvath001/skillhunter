import { FormEvent, ReactElement, createContext, useEffect, useState } from 'react'
import { handleError } from './ContextFunctions'
import { client, endpointBackEnd } from '../api/client'
import { ChildrenType, ExtractionType, RankingType } from './AppTypes'
import { getIndex, isRankingInvalid } from './ProgLangProvider'
import axios from 'axios'

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

const handleGenerateRankingsSubmit = async (e: FormEvent<HTMLFormElement>, 
                                            setErrorMessageCalculateRankings: (err: string) => void,
                                            setShowSaveSuccssfulCalculateRanking: (s: boolean) => void) => {
    e.preventDefault()

    const formData: FormData = new FormData(e.currentTarget)

    const selectedProgLang: number = Number(formData.get('selectedProgLang')!.toString())
    const extractionId: number = Number(formData.get('extractionId')!.toString())
    const skillId: number = Number(formData.get('skillId')!.toString())

    let rankings: RankingType[] = []
    for (const pair of formData.entries()) {
        if (pair[0].startsWith('rankingListItem_')) {
            const index = getIndex(pair[0])
            if (!rankings[index])
                rankings[index] = {name: '', rangeStart: 0}
            if (pair[0].startsWith('rankingListItem_name'))
                rankings[index].name = pair[1].toString()
            else
                rankings[index].rangeStart = pair[1].toString() ? Number(pair[1].toString()) : null
        }
    }

    if (isRankingInvalid(rankings, setErrorMessageCalculateRankings)) {
        return
    }

    try {
        await axios({
            method: 'POST', 
            url: `${endpointBackEnd}/prog-langs/${selectedProgLang}/calculateRankings`, 
            data: {
                extractionId: extractionId,
                skillId: skillId,
                rankings: rankings
            }
        })

        // displaying a confirmation message that the ranking update was successful
        setShowSaveSuccssfulCalculateRanking(true)        
    } catch (err) {
        handleError(err, setErrorMessageCalculateRankings)
    }
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
    setDevelopersScores: () => {},
    developersScoresColSize: 12, 
    setDevelopersScoresColSize: () => {},
    handleGenerateRankingsSubmit: handleGenerateRankingsSubmit,
    showSaveSuccssfulCalculateRanking: false, 
    setShowSaveSuccssfulCalculateRanking: () => {},
    errorMessageCalculateRankings: '', 
    setErrorMessageCalculateRankings: () => {}
}

const useExtractionMapContext = () => {
    // developers' score
    const [ showExtractionMap, setShowExtractionMap ] = useState<boolean>(false)
    const [ showSkillTreeSelection, setShowSkillTreeSelection ] = useState<boolean>(false)
    const [ selectedSkill, setSelectedSkill ] = useState<any[]>([])
    const [ extraction, setExtraction ] = useState<ExtractionType|null>(null)
    const [ developersScores, setDevelopersScores ] = useState<DevelopersScoresType[]>([])
    const [ isDevelopersScoresLoading, setIsDevelopersScoresLoading ] = useState<boolean>(false)
    const [ developersScoresErrorMessage, setDevelopersScoresErrorMessage ] = useState<string>('')
    const [ developersScoresColSize, setDevelopersScoresColSize ] = useState<number>(12)
    const [ showSaveSuccssfulCalculateRanking, setShowSaveSuccssfulCalculateRanking ] = useState<boolean>(false)
    const [ errorMessageCalculateRankings, setErrorMessageCalculateRankings ] = useState<string>('')
    // developer-skill map

    const fetchDevelopersScores = async (skillId: number) => {
        setIsDevelopersScoresLoading(true)
        client.get(`/extractions/${extraction!.id}/skills/${skillId}/developersScores`)
            .then(resp => {
                setDevelopersScores(resp.data)
                setIsDevelopersScoresLoading(false)
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

    // this one is needed to resize the bar diagram when clicked on the 'Calculate rankings' -> the diagram has to be resized half size
    useEffect(() => {
        window.dispatchEvent(new Event('resize'))
    }, [ developersScoresColSize ])

    return { showExtractionMap, setShowExtractionMap, showSkillTreeSelection, setShowSkillTreeSelection, setSelectedSkill, selectedSkill,
             extraction, setExtraction, isDevelopersScoresLoading, setIsDevelopersScoresLoading, developersScores, 
             developersScoresErrorMessage, setDevelopersScores, developersScoresColSize, setDevelopersScoresColSize,
             handleGenerateRankingsSubmit, showSaveSuccssfulCalculateRanking, setShowSaveSuccssfulCalculateRanking,
             errorMessageCalculateRankings, setErrorMessageCalculateRankings }
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