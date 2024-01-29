import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

const ModalForm = ({ formId, title, body, icon, handleSave }) => {
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleClose = () => {
        setShow(false);
        setErrorMessage('');
    }

    return (
        <>
            <span onClick={() => setShow(true)} className='me-1'>
                {icon}
            </span>
            <Modal show={show} onHide={handleClose} size="lg">
                <Form id={formId} onSubmit={(e) => handleSave(e, handleClose, setErrorMessage)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {body}
                    </Modal.Body>
                    <Modal.Footer>
                        <Container>
                            <Row>
                                <Col xs={12} md={9}>
                                    {errorMessage &&
                                        <Alert key='danger' variant='danger'>
                                            {errorMessage}
                                        </Alert>
                                    }
                                </Col>
                                <Col xs={12} md={3}>
                                    <Button className='mx-2 mt-3 mb-4' variant='secondary' onClick={handleClose}>Close</Button>
                                    <Button className='mx-2 mt-3 mb-4' variant='primary' type='submit'>Save</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default ModalForm;