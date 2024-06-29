import { ReactElement } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { ExtractionType } from '../../../context/ExtractionProvider'
import SkillTreeSelectionModal from './SkillTreeSelectionModal'
import useExtraction from '../../../hooks/useExtraction'
import Form from 'react-bootstrap/Form'
import useSkillTree from '../../../hooks/useSkillTree'
import { SkillTreeNodeType } from '../../../context/SkillTreeProvider'

type PropsType = {
    extraction: ExtractionType
}

const ExtractionMapDevelopersScores = ({ extraction }: PropsType): ReactElement => {
    const { showSkillTreeSelection, setShowSkillTreeSelection, selectedSkill, setSelectedSkill } = useExtraction()
    const { state, setTreeOperationErrorMessage } = useSkillTree()


    const handleShowSkillTreeSelection = (): void => {
        setShowSkillTreeSelection(true)
        setSelectedSkill([])
        unselect(state.skillTree)
        setTreeOperationErrorMessage('')
    }

    const unselect = (nodes: SkillTreeNodeType[]) => {
        for(const node of nodes) {
            node.selected = false
            unselect(node.children)
        }
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

            {showSkillTreeSelection && 
                <SkillTreeSelectionModal />
            }
        </>
    )
}

export default ExtractionMapDevelopersScores