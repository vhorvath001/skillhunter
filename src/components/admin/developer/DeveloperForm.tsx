import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaStarOfLife } from 'react-icons/fa';
import { ReactElement } from 'react';
import { DeveloperType } from '../../../context/AppTypes';

type PropsType = {
    record?: DeveloperType
}

const DeveloperForm = ( { record }: PropsType ): ReactElement => {
    return (
        <>
            <input type='hidden' name='id' value={record ? record.id : '-1'} />
            <Row>
                <Col>
                    <Form.Group className='mb-3' controlId='name'>
                        <Form.Label className='fw-bolder'>Name</Form.Label>
                        <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                        <Form.Control 
                            type='text' 
                            defaultValue={record?.name}
                            name='name'
                            required
                            autoFocus />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className='mb-3' controlId='email'>
                        <Form.Label className='fw-bolder'>Email</Form.Label>
                        <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                        <Form.Control 
                            type='text' 
                            defaultValue={record?.email}
                            name='email'
                            required />
                    </Form.Group>
                </Col>
            </Row>
        </>        
    )
}

export default DeveloperForm