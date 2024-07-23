import { ReactElement } from 'react'
import { FaStarOfLife } from 'react-icons/fa'
import { BsInfoSquare } from 'react-icons/bs'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import EditableList from '../../../utils/list/EditableList'
import { FaExclamation } from "react-icons/fa"
import Accordion from 'react-bootstrap/Accordion'
import { ProgLangType } from '../../../context/AppTypes'

type PropsType = {
    record?: ProgLangType,
    showAttention?: boolean
}

const ProgLangFormRanking = ({ record, showAttention = true }: PropsType): ReactElement => {
    return (
        <>
            <Row>
                <Col>
                    <Form.Label className='fw-bolder'>Rankings</Form.Label>
                    <BsInfoSquare className='me-3 ms-2' size={20} title='Ranking can be specified which will appear in the skill map. It indicates how experienced the developer is. For example:&#013;Novice     0&#013;Master     500&#013;Grandmaster     1500&#013;Please make sure that the start value of the first range range is zero and the ranges are in ascending order!' />            
                </Col>
            </Row>
            {showAttention &&
                <Row className='mt-2 mb-4'>
                    <Col>
                        <Accordion>
                            <Accordion.Item eventKey="0" >
                                <Accordion.Header>
                                    <FaExclamation size={25} className='me-3' />
                                    ATTENTION! To fine tune the ranges it is recommended to complete an extraction first and calculate the range values from the developer's scores view (click on the 'Map' button of an extraction and choose 'Developers scores').
                                </Accordion.Header>
                                <Accordion.Body>
                                    To do that 
                                    <ol>
                                        <li>please start an extraction (as widespread as possible, i.e. it should contain many projects)</li>
                                        <li>after completion open the developer's score tab in extraction map</li>
                                        <li>please select a skill which is widely used (e.g <i>springframework</i>)</li>
                                        <li>specify the range values for this specific skill only - please check who got the most / the least scores and set the highest, lowest and middle rankings accordingly</li>
                                        <li>by clicking the <i>Overwrite rankings</i> button the application will transform the values back to programming language level</li>
                                    </ol>
                                    This calculation can be rerun any time.
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>    
                    </Col>
                </Row>
            }
            <Row>
                <Col>
                    <Form.Group className='mb-3'>
                        <EditableList 
                            list={record?.ranking ? record?.ranking?.map(p => String(p.rangeStart)) : []} 
                            originalList={record?.ranking} 
                            required={false} 
                            type='number'
                            inputName='rankingListItem_rangeStart_'
                            beforeTextField={(originalRecord: any, index: number) => (
                                <span className="d-flex">
                                    <Form.Label className='fw-bolder flex-fill me-1 mt-2'>Name</Form.Label>
                                    <FaStarOfLife size={15} title='Mandatory field' className='me-3 mt-3'/>
                                    <Form.Control
                                        type='text'
                                        name={'rankingListItem_name_'+index}
                                        defaultValue={originalRecord?.name}
                                        className='mb-2 me-3 flex-fill d-lg-inline'/>
                                    <Form.Label className='fw-bolder flex-fill'>Range start</Form.Label>
                                    <FaStarOfLife size={15} title='Mandatory field' className='me-3 mt-3'/>
                                </span>
                            )}
                            beforeTextFieldWidth={8}
                        />
                    </Form.Group>
                </Col>
            </Row>
        </>
    )
}

export default ProgLangFormRanking