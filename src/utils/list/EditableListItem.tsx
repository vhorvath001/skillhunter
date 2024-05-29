import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsFileMinus } from 'react-icons/bs';
import { useState } from 'react';

type PropsType = {
    index: number,
    item: string, 
    controlName: string, 
    required: boolean,
    beforeTextField?: (originalRecord: any, index: number) => JSX.Element,
    originalRecord: any
}

const EditableListItem = ({ index, item, controlName, required, beforeTextField, originalRecord }: PropsType) => {
    const [show, setShow] = useState<boolean>(true);
    const removeFromList = (): void => setShow(false);

    return (
        <>
            {show &&
                <ListGroup.Item >
                    <Container fluid>
                        <Row>
                            <Col sm={11}>
                                <div className='d-lg-inline'>
                                    {beforeTextField && beforeTextField(originalRecord, index)}
                                    <Form.Control
                                        type='text'
                                        name={controlName}
                                        defaultValue={item} 
                                        required={required ? true : false}  />
                                </div>
                            </Col>
                            { ((required && index !== 0) || !required) &&
                            <Col sm={1}>
                                <span 
                                    onClick={removeFromList} 
                                    title='Removing the current row.'
                                    data-testid='t-editableListItem-remove' >
                                    <BsFileMinus size={25} role='button' />
                                </span>
                            </Col>}
                        </Row>
                    </Container>
                </ListGroup.Item>
            }
        </>
    )
}

export default EditableListItem;