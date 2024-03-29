import { FormEvent, ReactElement, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

type PropsType = {
    formId: string, 
    title: string, 
    body: ReactElement, 
    icon: ReactElement, 
    handleSave: (dispatch: React.Dispatch<any>, e: FormEvent<HTMLFormElement>, handleClose: () => void, setErrorMessage: (errorMessage: string) => void) => void,
    dispatch: React.Dispatch<any>
}

const ModalForm = ({ formId, title, body, icon, handleSave, dispatch }: PropsType): ReactElement => {
    const [show, setShow] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleClose = (): void => {
        setShow(false);
        setErrorMessage('');
    }

    return (
        <>
            <span onClick={() => setShow(true)} className='me-1' data-testid='t-modal-show'>
                {icon}
            </span>
            <Modal show={show} onHide={handleClose} size="xl">
                <Form id={formId} onSubmit={(e: FormEvent<HTMLFormElement>) => handleSave(dispatch, e, handleClose, setErrorMessage)}>
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