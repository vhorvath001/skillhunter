import { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import useExtractionMap from '../../../hooks/useExtractionMap'

type PropsType = {
    mapType: string,
    resourceTypes: string[][],
    componentOne: ReactElement,
    componentTwo: ReactElement,
    handleShow: (setErrorMessage: (m: string) => void, 
                 extractionId: number, 
                 resourceType: string, 
                 resourceId: string, 
                 setIsLoading: (isLoading: boolean) => void, 
                 setData: (data: any[]) => void,
                 filterSkillLevel?: number, ) => Promise<void>,
    selectedResourceOne: string,
    selectedResourceTwo?: string,
    setIsLoading: (isLoading: boolean) => void,
    setData: (data: any[]) => void,
    resetSelectedResourceOne: () => void,
    resetSelectedResourceTwo?: () => void,
    setErrorMessage: (errorMessage: string) => void,
    displayShowButton: boolean, 
    setDisplayShowButton: (b: boolean) => void,
    selectedResourceType: string, 
    setSelectedResourceType: (rt: string) => void,
    selectedSkill?: string[]
}

const ExtractionMapFilter = ({ mapType, resourceTypes, componentOne, componentTwo, handleShow, selectedResourceOne, selectedResourceTwo, setIsLoading, setData, 
                               resetSelectedResourceOne, resetSelectedResourceTwo, setErrorMessage, displayShowButton, setDisplayShowButton, selectedResourceType, 
                               setSelectedResourceType, selectedSkill }: PropsType): ReactElement => {
    const { extraction, setFilterSkillLevel, filterSkillLevel } = useExtractionMap()

    const [ showComponentOne, setShowComponentOne ] = useState<boolean>(false)
    const [ showComponentTwo, setShowComponentTwo ] = useState<boolean>(false)

    useEffect(() => {
        setSelectedResourceType(resourceTypes[0][0])
    }, [])

    const changeResourceTypeOption = (e: ChangeEvent<HTMLSelectElement>): void => {
        console.log('changeResourceTypeOption')
        const selected: string = e.target.value
        setSelectedResourceType(selected)
        resetSelectedResourceOne()
        if (resetSelectedResourceTwo)
            resetSelectedResourceTwo()
        if (selected === resourceTypes[0][0]) {
            setShowComponentOne(false)
            setShowComponentTwo(false)
        } else if (selected === resourceTypes[1][0]) {
            setShowComponentOne(true)
            setShowComponentTwo(false)
        } else if (selected === resourceTypes[2][0]) {
            setShowComponentOne(false)
            setShowComponentTwo(true)
        }
        if (selected === 'SKILL' && (!selectedSkill || selectedSkill?.length === 0)) {
            setDisplayShowButton(false)
        } else {
            setDisplayShowButton(true)
        }
    }

    const handleClickOnShowButton = (): void => {
        handleShow(setErrorMessage, 
                   extraction!.id,
                   selectedResourceType, 
                   mapType === 'PROJECT-SKILL' ? (selectedResourceType === 'SKILL' ? selectedSkill![0]! : selectedResourceOne) :
                   mapType === 'DEVELOPER-SKILL' ? (selectedResourceType === 'SKILL' ? selectedSkill![0]! : selectedResourceOne) :
                                                  (selectedResourceType === 'DEVELOPER' ? selectedResourceOne : selectedResourceTwo!),
                   setIsLoading,
                   setData,
                   filterSkillLevel)
    }

    useEffect(() => {
        if (selectedResourceType === 'SKILL' && (!selectedSkill || selectedSkill.length === 0)) {
            setDisplayShowButton(false)
        } else {
            setDisplayShowButton(true)
        }
    }, [ selectedSkill ])

    return (
        <div className='mb-1'>
            <label className='me-3'>Showing </label>
            <Form.Select 
                onChange={changeResourceTypeOption} 
                value={selectedResourceType} 
                name='selectedResourceType' 
                className='mb-2 me-1 w-auto d-lg-inline'>
                { resourceTypes.map(rt => (
                    <option value={rt[0]} key={rt[0]}>{rt[1]}</option>    
                ))}
            </Form.Select>
            { showComponentOne && 
                componentOne
            }
            { showComponentTwo && 
                componentTwo
            }

            { ((mapType === 'DEVELOPER-SKILL' || mapType === 'PROJECT-SKILL') && (selectedResourceType === 'ALL' || selectedResourceType === 'DEVELOPER')) &&
                <>
                    <label className='ms-2 me-2'>on</label>
                    <Form.Control type="number" placeholder="ALL" className='d-lg-inline' style={{width: "70px"}} 
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterSkillLevel(Number(e.target.value))} />
                    <label className='ms-2 me-2'>level(s)</label>
                </>
            }

            { displayShowButton &&
                <Button className='ms-4' onClick={handleClickOnShowButton}>Show</Button>
            }
        </div>
    )
}

export default ExtractionMapFilter