import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const ModalConfirmation = ( { icon, message, id, handleOperation } ) => {

    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleClose = () => {
        setShow(false);
        setErrorMessage('');
    }
    const confirm = (e) => handleOperation(e, handleClose, setErrorMessage, id);

    return (
        <>
            <span onClick={() => setShow(true)}>
                {icon}
            </span>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Please confirm!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Container>
                        <Row>
                            <Col xs={12} md={8}>
                                {errorMessage &&
                                    <Alert key='danger' variant='danger'>
                                        {errorMessage}
                                    </Alert>
                                }
                            </Col>
                            <Col xs={12} md={4}>
                                <Button className='me-4 mt-3 mb-3' variant='secondary' onClick={handleClose}>Cancel</Button>
                                <Button className='me-1 mt-3 mb-3' variant='primary' onClick={confirm}>Confirm</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default ModalConfirmation;