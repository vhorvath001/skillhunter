import { MouseEvent, ReactElement } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import ExtractionMapDevelopersScores from './developersScores/ExtractionMapDevelopersScores'
import useExtractionMap from '../../../hooks/useExtractionMap'
import ExtractionMapDeveloperSkillMap from './developerSkillMap/ExtractionMapDeveloperSkillMap'

const ExtractionMapModal = (): ReactElement => {
    const { showExtractionMap, setShowExtractionMap, setDevelopersScores, setDevelopersScoresColSize, setSelectedSkill, fetchDevelopers, setDevelopers, setErrorMessageDeveloperSkillMap } = useExtractionMap()

    const handleClose = (): void => {
        setShowExtractionMap(false)
        setDevelopersScores([])
        setDevelopersScoresColSize(12)
    }

    const handleTabChange = (e: MouseEvent<HTMLElement>): void => {
        setDevelopersScores([])
        setDevelopersScoresColSize(12)
        setSelectedSkill([])
        setErrorMessageDeveloperSkillMap('')

        const title: string = (e.target as HTMLButtonElement).textContent!
        if (title === 'Developer-Skill map') {
            fetchDevelopers(setDevelopers, setErrorMessageDeveloperSkillMap )
        }
    }
    
    return (
        <Modal show={showExtractionMap} onHide={handleClose} dialogClassName="modal-fullscreen">
            <Modal.Header closeButton>
                <Modal.Title>Extraction map</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Tabs defaultActiveKey='developers-scores' className='mb-3' onClick={handleTabChange}>
                        <Tab eventKey='developer-skill-map' title='Developer-Skill map'>
                            <ExtractionMapDeveloperSkillMap />
                        </Tab>
                        <Tab eventKey='developer-project-map' title='Developer-Project map'>
                            <h2>Not yet</h2>
                        </Tab>
                        <Tab eventKey='project-skill-map' title='Project-Skill map'>
                            <h2>Not yet</h2>
                        </Tab>
                        <Tab eventKey='developers-scores' title="Developers' scores">
                            <ExtractionMapDevelopersScores />
                        </Tab>
                    </Tabs>
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default ExtractionMapModal