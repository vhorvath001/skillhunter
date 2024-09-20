import { ReactElement } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import SkillTree from '../../skillTree/SkillTree'
import useExtractionMap from '../../../hooks/useExtractionMap'

type PropsType = {
    showSkillTreeSelection: boolean, 
    setShowSkillTreeSelection: (b: boolean) => void,
    setSelectedSkill: (s: string[]) => void,
}

const SkillTreeSelectionModal = ({ showSkillTreeSelection, setShowSkillTreeSelection, setSelectedSkill }: PropsType): ReactElement => {
    const { extraction } = useExtractionMap()

    const handleClose = (): void => {
        setShowSkillTreeSelection(false)
    }

    return (
        <Modal show={showSkillTreeSelection} onHide={handleClose} size='xl'>
            <Modal.Header closeButton>
                Please select a skill!
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <SkillTree 
                        mode='select' 
                        extractionId={extraction?.id} 
                        setSelectedSkill={setSelectedSkill}
                        setShowSkillTreeSelection={setShowSkillTreeSelection}
                        />
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default SkillTreeSelectionModal