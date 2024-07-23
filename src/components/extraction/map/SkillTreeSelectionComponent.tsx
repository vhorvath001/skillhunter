import { ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import useExtractionMap from '../../../hooks/useExtractionMap'
import useSkillTree from '../../../hooks/useSkillTree'
import Form from 'react-bootstrap/Form'

const SkillTreeSelectionComponent = (): ReactElement => {
    const { setShowSkillTreeSelection, selectedSkill, setSelectedSkill, setDevelopersScoresColSize } = useExtractionMap()
    const { state, setTreeOperationErrorMessage, setSelectedProgLang } = useSkillTree()

    const handleShowSkillTreeSelection = (): void => {
        setShowSkillTreeSelection(true)
        setSelectedSkill([])
        state.skillTree = []
        setTreeOperationErrorMessage('')
        setSelectedProgLang(-1)
    }

    const handleClickGenerateRankings = (): void => {
        setDevelopersScoresColSize(6)
    }

    return (
        <>
            <Button onClick={handleShowSkillTreeSelection} className='ms-5'>Choose a skill</Button>
            {selectedSkill.length > 0 &&
                <>
                    <Form.Label className='ms-4 me-2 fw-bolder'>The selected skill:</Form.Label>
                    {selectedSkill[1]}
                    <Button onClick={handleClickGenerateRankings} variant='secondary' className='ms-5'>Calculate rankings</Button>
                </>
            }
        
        </>
    )
}

export default SkillTreeSelectionComponent