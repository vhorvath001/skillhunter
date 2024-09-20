import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ExtractionMapFilter from '../ExtractionMapFilter'
import Form from 'react-bootstrap/Form'
import AlertMessage from '../../../../utils/AlertMessage';
import useExtractionMap from '../../../../hooks/useExtractionMap';
import DeveloperProjectGraph from './DeveloperProjectGraph';

// type PropsType = {
//     displayShowButton: boolean, 
//     setDisplayShowButton: (b: boolean) => void
// }

const ExtractionMapDeveloperProjectMap = (): ReactElement => {
    const resourceTypes: string[][] = [['ALL', 'all the resources'], 
                                       ['DEVELOPER', 'the following developer only'], 
                                       ['PROJECT', 'the following project only']]

    const { errorMessageDeveloperProjectMap, setErrorMessageDeveloperProjectMap, developers, projects, showDeveloperProjectMap, setIsDeveloperProjectMapLoading, setDeveloperProjectMap } = useExtractionMap()
    const [ selectedDeveloper, setSelectedDeveloper ] = useState<string>('')
    const [ selectedProject, setSelectedProject ] = useState<string>('')
    const [ displayShowButton, setDisplayShowButton ] = useState<boolean>(true)
    const [ selectedResourceType, setSelectedResourceType ] = useState<string>('')

    useEffect(() => {
        setSelectedDeveloper(String(developers[0]?.id) ?? '')
    }, [developers])

    return (
        <>
            <Row>
                <Col md={12}>
                    <ExtractionMapFilter 
                        mapType='DEVELOPER-PROJECT'
                        resourceTypes={resourceTypes}
                        componentOne={
                            <Form.Select className='mb-2 me-3 w-auto d-lg-inline' 
                                         onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDeveloper(e.target.value)}>
                                {developers.map(d => (
                                    <option value={d.id} key={d.id}>{d.name} - ({d.email})</option>    
                                ))}
                            </Form.Select>
                        }
                        componentTwo={ 
                            <Form.Select className='mb-2 me-3 w-auto d-lg-inline' 
                                         onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedProject(e.target.value)}>
                                {projects.map(p => (
                                    <option value={p.id} key={p.id}>{p.name}</option>
                                ))}
                            </Form.Select>        
                         } 
                        handleShow={showDeveloperProjectMap}
                        selectedResourceOne={selectedDeveloper}
                        resetSelectedResourceOne={() => setSelectedDeveloper(String(developers[0]?.id) ?? '')}
                        selectedResourceTwo={selectedProject}
                        resetSelectedResourceTwo={() => setSelectedProject(String(projects[0]?.id) ?? '')}
                        setIsLoading={setIsDeveloperProjectMapLoading}
                        setData={setDeveloperProjectMap}
                        setErrorMessage={setErrorMessageDeveloperProjectMap}
                        displayShowButton={displayShowButton}
                        setDisplayShowButton={setDisplayShowButton}
                        selectedResourceType={selectedResourceType}
                        setSelectedResourceType={setSelectedResourceType}
                    />
                </Col>
            </Row>
            <Row>
                <DeveloperProjectGraph selectedResourceType={selectedResourceType} />
            </Row>
            <Row>
                { errorMessageDeveloperProjectMap &&
                    <AlertMessage errorMessage={errorMessageDeveloperProjectMap} />
                }
            </Row>
        </>
    )
}

export default ExtractionMapDeveloperProjectMap