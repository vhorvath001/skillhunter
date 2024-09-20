import { MouseEvent, ReactElement } from 'react'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import ExtractionMapDevelopersScores from './developersScores/ExtractionMapDevelopersScores'
import useExtractionMap from '../../../hooks/useExtractionMap'
import ExtractionMapDeveloperSkillMap from './developerSkillMap/ExtractionMapDeveloperSkillMap'
import ExtractionMapDeveloperProjectMap from './developerProjectMap/ExtractionMapDeveloperProjectMap'
import ExtractionMapProjectSkillMap from './projectSkillMap/ExtractionMapProjectSkillMap'

const ExtractionMapModal = (): ReactElement => {
    const { showExtractionMap, setShowExtractionMap, setDevelopersScores, setDevelopersScoresColSize, fetchDevelopers, setDevelopers, setErrorMessageDeveloperSkillMap, extraction, fetchProjects, setProjects, setErrorMessageDeveloperProjectMap, setErrorMessageProjectSkillMap } = useExtractionMap()

    const handleClose = (): void => {
        setShowExtractionMap(false)
        setDevelopersScores([])
        setDevelopersScoresColSize(12)
    }

    const handleTabChange = (e: MouseEvent<HTMLElement>): void => {
        setDevelopersScores([])
        setDevelopersScoresColSize(12)
        setErrorMessageDeveloperSkillMap('')
        setErrorMessageDeveloperProjectMap('')
        setErrorMessageProjectSkillMap('')

        const title: string = (e.target as HTMLButtonElement).textContent!
        if (title === 'Developer-Skill map') {
            fetchDevelopers(extraction!.id, setDevelopers, setErrorMessageDeveloperSkillMap )
        } else if (title === 'Developer-Project map') {
            fetchDevelopers(extraction!.id, setDevelopers, setErrorMessageDeveloperProjectMap )
            fetchProjects(extraction!.id, setProjects, setErrorMessageDeveloperProjectMap )
        } else if (title === 'Project-Skill map') {
            fetchProjects(extraction!.id, setProjects, setErrorMessageProjectSkillMap )
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
                            <ExtractionMapDeveloperProjectMap />
                        </Tab>
                        <Tab eventKey='project-skill-map' title='Project-Skill map'>
                            <ExtractionMapProjectSkillMap />
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