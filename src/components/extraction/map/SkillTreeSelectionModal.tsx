import { ReactElement } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import SkillTree from '../../skillTree/SkillTree'
import useExtractionMap from '../../../hooks/useExtractionMap'

const SkillTreeSelectionModal = (): ReactElement => {
    const { showSkillTreeSelection, setShowSkillTreeSelection } = useExtractionMap()

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
                    <SkillTree mode='select' />
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default SkillTreeSelectionModal