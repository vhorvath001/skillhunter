import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsFileMinus } from 'react-icons/bs';
import { useState } from 'react';

const EditableListItem = ({ item, controlName }) => {
    const [show, setShow] = useState(true);
    const removeFromList = () => setShow(false);

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
                                    defaultValue={item} />
                            </Col>
                            <Col sm={1}>
                                <span onClick={removeFromList}>
                                    <BsFileMinus size={25} />
                                </span>
                            </Col>
                        </Row>
                    </Container>
                </ListGroup.Item>
            }
        </>
    )
}

export default EditableListItem;