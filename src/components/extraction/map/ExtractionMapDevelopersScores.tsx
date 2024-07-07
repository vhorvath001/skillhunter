import { ReactElement } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import SkillTreeSelectionModal from './SkillTreeSelectionModal'
import Form from 'react-bootstrap/Form'
import useSkillTree from '../../../hooks/useSkillTree'
import BarDiagram from './BarDiagram'
import useExtractionMap from '../../../hooks/useExtractionMap'

const ExtractionMapDevelopersScores = (): ReactElement => {
    const { showSkillTreeSelection, setShowSkillTreeSelection, selectedSkill, setSelectedSkill } = useExtractionMap()
    const { state, setTreeOperationErrorMessage, setSelectedProgLang } = useSkillTree()

    const handleShowSkillTreeSelection = (): void => {
        setShowSkillTreeSelection(true)
        setSelectedSkill([])
        state.skillTree = []
        setTreeOperationErrorMessage('')
        setSelectedProgLang(-1)
    }

    return (
        <>
            <Row>
                <Col>
                    <Button onClick={handleShowSkillTreeSelection} className='ms-5'>Choose a skill</Button>
                    {selectedSkill.length > 0 &&
                        <>
                            <Form.Label className='ms-4 me-2 fw-bolder'>The selected skill:</Form.Label>
                            {selectedSkill[1]}
                        </>
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <BarDiagram />
                </Col>
            </Row>

            {showSkillTreeSelection && 
                <SkillTreeSelectionModal />
            }
        </>
    )
}

export default ExtractionMapDevelopersScores