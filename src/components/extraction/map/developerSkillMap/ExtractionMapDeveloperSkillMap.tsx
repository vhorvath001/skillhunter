import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ExtractionMapFilter from '../ExtractionMapFilter';
import SkillTreeSelectionComponent from '../SkillTreeSelectionComponent'
import Form from 'react-bootstrap/Form'
import AlertMessage from '../../../../utils/AlertMessage';
import useExtractionMap from '../../../../hooks/useExtractionMap';
import DeveloperSkillGraph from './DeveloperSkillGraph';

const ExtractionMapDeveloperSkillMap = (): ReactElement => {
    const resourceTypes: string[][] = [['ALL', 'all the resources'], 
                                       ['DEVELOPER', 'the following developer only'], 
                                       ['SKILL', 'the following skill only']]

    const { errorMessageDeveloperSkillMap, developers, showDeveloperSkillMap, setIsDeveloperSkillMapLoading, setDeveloperSkillMap } = useExtractionMap()
    const [ selectedDeveloper, setSelectedDeveloper ] = useState<string>('')

    useEffect(() => {
        setSelectedDeveloper(String(developers[0]?.id) ?? '')
    }, [developers])

    return (
        <>
            <Row>
                <Col md={12}>
                    <ExtractionMapFilter 
                        resourceTypes={resourceTypes}
                        componentOne={
                            <Form.Select className='mb-2 me-3 w-auto d-lg-inline' 
                                         onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDeveloper(e.target.value)}>
                                {developers.map(d => (
                                    <option value={d.id} key={d.id}>{d.name} - ({d.email})</option>    
                                ))}
                            </Form.Select>        
                        }
                        componentTwo={ <SkillTreeSelectionComponent /> } 
                        handleShow={showDeveloperSkillMap}
                        selectedResource={selectedDeveloper}
                        resetSelectedResource={() => setSelectedDeveloper(String(developers[0].id) ?? '')}
                        setIsLoading={setIsDeveloperSkillMapLoading}
                        setData={setDeveloperSkillMap}
                    />
                </Col>
            </Row>
            <Row>
                <DeveloperSkillGraph />
            </Row>
            <Row>
                { errorMessageDeveloperSkillMap &&
                    <AlertMessage errorMessage={errorMessageDeveloperSkillMap} />
                }
            </Row>
        </>
    )
}

export default ExtractionMapDeveloperSkillMap