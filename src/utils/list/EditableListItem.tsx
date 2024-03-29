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
    required: boolean
}

const EditableListItem = ({ index, item, controlName, required }: PropsType) => {
    const [show, setShow] = useState<boolean>(true);
    const removeFromList = (): void => setShow(false);

    return (
        <>
            {show &&
                <ListGroup.Item >
                    <Container>
                        <Row>
                            <Col sm={11}>
                                <Form.Control
                                    type='text'
                                    name={controlName}
                                    defaultValue={item} 
                                    required={required ? true : false} />
                            </Col>
                            { index !== 0 &&
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