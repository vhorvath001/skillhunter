import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ExtractionMapFilter from '../ExtractionMapFilter';
import SkillTreeSelectionComponent from '../SkillTreeSelectionComponent'
import Form from 'react-bootstrap/Form'
import AlertMessage from '../../../../utils/AlertMessage';
import useExtractionMap from '../../../../hooks/useExtractionMap';
import ProjectSkillGraph from './ProjectSkillGraph';

const ExtractionMapProjectSkillMap = (): ReactElement => {
    const resourceTypes: string[][] = [['ALL', 'all the resources'], 
                                       ['PROJECT', 'the following project only'], 
                                       ['SKILL', 'the following skill only']]

    const { errorMessageProjectSkillMap, setErrorMessageProjectSkillMap, projects, showProjectSkillMap, setIsProjectSkillMapLoading, setProjectSkillMap, showExtractionMap } = useExtractionMap()
    const [ selectedProject, setSelectedProject ] = useState<string>('')
    const [ displayShowButton, setDisplayShowButton ] = useState<boolean>(true)
    const [ selectedResourceType, setSelectedResourceType ] = useState<string>('')
    const [ selectedSkill, setSelectedSkill ] = useState<any[]>([])
    const [ showSkillTreeSelection, setShowSkillTreeSelection ] = useState<boolean>(false)

    useEffect(() => {
        setSelectedProject(String(projects[0]?.id) ?? '')
    }, [projects])

    useEffect(() => {
        if (!showExtractionMap)
            setSelectedSkill([])
    }, [showExtractionMap])

    return (
        <>
            <Row>
                <Col md={12}>
                    <ExtractionMapFilter 
                        mapType='PROJECT-SKILL'
                        resourceTypes={resourceTypes}
                        componentOne={
                            <Form.Select className='mb-2 me-3 w-auto d-lg-inline' 
                                         onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedProject(e.target.value)}>
                                {projects.map(p => (
                                    <option value={p.id} key={p.id}>{p.name}</option>    
                                ))}
                            </Form.Select>        
                        }
                        componentTwo={ <SkillTreeSelectionComponent 
                                            setSelectedSkill={setSelectedSkill} 
                                            selectedSkill={selectedSkill} 
                                            showSkillTreeSelection={showSkillTreeSelection}
                                            setShowSkillTreeSelection={setShowSkillTreeSelection} /> } 
                        handleShow={showProjectSkillMap}
                        selectedResourceOne={selectedProject}
                        resetSelectedResourceOne={() => setSelectedProject(String(projects[0].id) ?? '')}
                        setIsLoading={setIsProjectSkillMapLoading}
                        setData={setProjectSkillMap}
                        setErrorMessage={setErrorMessageProjectSkillMap}
                        displayShowButton={displayShowButton}
                        setDisplayShowButton={setDisplayShowButton}
                        selectedResourceType={selectedResourceType}
                        setSelectedResourceType={setSelectedResourceType}
                        selectedSkill={selectedSkill}
                    />
                </Col>
            </Row>
            <Row>
                <ProjectSkillGraph selectedResourceType={selectedResourceType} />
            </Row>
            <Row>
                { errorMessageProjectSkillMap &&
                    <AlertMessage errorMessage={errorMessageProjectSkillMap} />
                }
            </Row>
        </>
    )
}

export default ExtractionMapProjectSkillMap