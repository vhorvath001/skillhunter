import { ReactElement, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

type PropsType = {
    errorMessage: string, 
}

const ModalErrorMessage = ({ errorMessage }: PropsType ): ReactElement => {

    const [show, setShow] = useState<boolean>(true)

    const handleClose = (): void => {
        setShow(false)
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Error occurred!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{errorMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Container>
                        <Row>
                            <Col>
                                <Button className='me-4 mt-3 mb-3' variant='secondary' onClick={handleClose}>Close</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default ModalErrorMessage;