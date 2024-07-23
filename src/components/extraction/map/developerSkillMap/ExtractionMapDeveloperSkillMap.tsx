import { ReactElement } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ExtractionMapFilter from '../ExtractionMapFilter';
import SkillTreeSelectionComponent from '../SkillTreeSelectionComponent'
import Form from 'react-bootstrap/Form'

const ExtractionMapDeveloperSkillMap = (): ReactElement => {
    const resourceTypes: string[][] = [['ALL', 'all the resources'], 
                                       ['DEVELOPER', 'the following developer only'], 
                                       ['SKILL', 'the following skill only']]
    const developers: string[][] = [['1', 'Viktor']]

    return (
        <>
            <Row>
                <Col md={12}>
                    <ExtractionMapFilter 
                        resourceTypes={resourceTypes}
                        componentOne={
                            <Form.Select className='mb-2 me-3 w-auto d-lg-inline' name='????'>
                                {developers.map(r1 => (
                                    <option value={r1[0]}>{r1[1]}</option>    
                                ))}
                            </Form.Select>        
                        }
                        componentTwo={ <SkillTreeSelectionComponent /> } />
                </Col>
                
            </Row>
        </>
    )
}

export default ExtractionMapDeveloperSkillMap