import { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import useExtractionMap from '../../../hooks/useExtractionMap'

type PropsType = {
    resourceTypes: string[][],
    componentOne: ReactElement,
    componentTwo: ReactElement,
    handleShow: (setErrorMessageDeveloperSkillMap: (m: string) => void, extractionId: number, resourceType: string, resourceId: string, setIsLoading: (isLoading: boolean) => void, setData: (data: any[]) => void) => Promise<void>,
    selectedResource: string,
    setIsLoading: (isLoading: boolean) => void,
    setData: (data: any[]) => void,
    resetSelectedResource: () => void
}

const ExtractionMapFilter = ({ resourceTypes, componentOne, componentTwo, handleShow, selectedResource, setIsLoading, setData, resetSelectedResource }: PropsType): ReactElement => {
    const { selectedSkill, setErrorMessageDeveloperSkillMap, extraction, selectedResourceType, setSelectedResourceType } = useExtractionMap()

    const [ showComponentOne, setShowComponentOne ] = useState<boolean>(false)
    const [ showComponentTwo, setShowComponentTwo ] = useState<boolean>(false)
    const [ showButton, setShowButton ] = useState<boolean>(true)
    // const [ selectedResourceType, setSelectedResourceType ]= useState<string>(resourceTypes[0][0])
    useEffect(() => {
        setSelectedResourceType(resourceTypes[0][0])
    }, [])

    const changeResourceTypeOption = (e: ChangeEvent<HTMLSelectElement>): void => {
        const selected: string = e.target.value
        setSelectedResourceType(selected)
        resetSelectedResource()
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
        if (selected === 'SKILL' && (!selectedSkill || selectedSkill.length === 0)) {
            setShowButton(false)
        } else {
            setShowButton(true)
        }
    }

    const handleClickOnShowButton = (): void => {
        handleShow(setErrorMessageDeveloperSkillMap, 
                   extraction!.id,
                   selectedResourceType, 
                   selectedResourceType === 'SKILL' ? selectedSkill[0] : selectedResource,
                   setIsLoading,
                   setData)
    }

    useEffect(() => {
        if (selectedResourceType === 'SKILL' && (!selectedSkill || selectedSkill.length === 0)) {
            setShowButton(false)
        } else {
            setShowButton(true)
        }

    }, [ selectedSkill ])

    return (
        <div>
            <label className='me-3'>Showing </label>
            <Form.Select onChange={changeResourceTypeOption} value={selectedResourceType} name='selectedResourceType' className='mb-2 me-1 w-auto d-lg-inline'>
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
            { showButton &&
                <Button className='ms-4' onClick={handleClickOnShowButton}>Show</Button>
            }
        </div>
    )
}

export default ExtractionMapFilter