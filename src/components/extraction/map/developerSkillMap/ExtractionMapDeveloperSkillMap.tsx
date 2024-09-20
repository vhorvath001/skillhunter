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

    const { errorMessageDeveloperSkillMap, setErrorMessageDeveloperSkillMap, developers, showDeveloperSkillMap, setIsDeveloperSkillMapLoading, setDeveloperSkillMap, showExtractionMap } = useExtractionMap()
    const [ selectedDeveloper, setSelectedDeveloper ] = useState<string>('')
    const [ displayShowButton, setDisplayShowButton ] = useState<boolean>(true)
    const [ selectedResourceType, setSelectedResourceType ] = useState<string>('')
    const [ selectedSkill, setSelectedSkill ] = useState<any[]>([])
    const [ showSkillTreeSelection, setShowSkillTreeSelection ] = useState<boolean>(false)

    useEffect(() => {
        setSelectedDeveloper(String(developers[0]?.id) ?? '')
    }, [developers])

    useEffect(() => {
        if (!showExtractionMap)
            setSelectedSkill([])
    }, [showExtractionMap])

    return (
        <>
            <Row>
                <Col md={12}>
                    <ExtractionMapFilter 
                        mapType='DEVELOPER-SKILL'
                        resourceTypes={resourceTypes}
                        componentOne={
                            <Form.Select className='mb-2 me-3 w-auto d-lg-inline' 
                                         onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDeveloper(e.target.value)}>
                                {developers.map(d => (
                                    <option value={d.id} key={d.id}>{d.name} - ({d.email})</option>    
                                ))}
                            </Form.Select>        
                        }
                        componentTwo={ <SkillTreeSelectionComponent 
                                            setSelectedSkill={setSelectedSkill} 
                                            selectedSkill={selectedSkill}
                                            showSkillTreeSelection={showSkillTreeSelection}
                                            setShowSkillTreeSelection={setShowSkillTreeSelection} /> } 
                        handleShow={showDeveloperSkillMap}
                        selectedResourceOne={selectedDeveloper}
                        resetSelectedResourceOne={() => setSelectedDeveloper(String(developers[0].id) ?? '')}
                        setIsLoading={setIsDeveloperSkillMapLoading}
                        setData={setDeveloperSkillMap}
                        setErrorMessage={setErrorMessageDeveloperSkillMap}
                        displayShowButton={displayShowButton}
                        setDisplayShowButton={setDisplayShowButton}
                        selectedResourceType={selectedResourceType}
                        setSelectedResourceType={setSelectedResourceType}
                        selectedSkill={selectedSkill}
                    />
                </Col>
            </Row>
            <Row>
                <DeveloperSkillGraph selectedResourceType={selectedResourceType} />
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