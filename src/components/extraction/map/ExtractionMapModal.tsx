import { ReactElement } from 'react'
import { ExtractionType } from '../../../context/ExtractionProvider'
import Modal from 'react-bootstrap/Modal'
import useExtraction from '../../../hooks/useExtraction'
import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import ExtractionMapDevelopersScores from './ExtractionMapDevelopersScores'

type PropsType = {
    extraction: ExtractionType
}

const ExtractionMapModal = ({ extraction }: PropsType): ReactElement => {
    const { showExtractionMap, setShowExtractionMap } = useExtraction()

    const handleClose = (): void => {
        setShowExtractionMap(false)
    }
    
    return (
        <Modal show={showExtractionMap} onHide={handleClose} dialogClassName="modal-90w">
            <Modal.Header closeButton>
                <Modal.Title>Extraction map</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Tabs defaultActiveKey='developers-scores' className='mb-3'>
                        <Tab eventKey='developer-skill-map' title='Developer-Skill map'>
                            <h2>Not yet</h2>
                        </Tab>
                        <Tab eventKey='developer-project-map' title='Developer-Project map'>
                            <h2>Not yet</h2>
                        </Tab>
                        <Tab eventKey='project-skill-map' title='Project-Skill map'>
                            <h2>Not yet</h2>
                        </Tab>
                        <Tab eventKey='developers-scores' title="Developers' scores">
                            <ExtractionMapDevelopersScores extraction={extraction} />
                        </Tab>
                    </Tabs>
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default ExtractionMapModal