import { ReactElement, FormEvent } from 'react'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import StartExtractionForm from './StartExtractionForm'
import Button from 'react-bootstrap/Button'
import useExtraction from '../../hooks/useExtraction'

const StartExtractionModal = (): ReactElement => {
    const { handleStartExtraction, show2ndPage, setShow2ndPage, show, setShow, errorMessage, setErrorMessage, isLoading, projectBranchesData, pathTextfield, selectedProgLangs } = useExtraction()

    const handleClose = (): void => {
        setShow(false)
        setErrorMessage('')
        setShow2ndPage(false)
    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Form id='extractionForm' onSubmit={(e: FormEvent<HTMLFormElement>) => handleStartExtraction(e, handleClose, show2ndPage, setShow2ndPage, setErrorMessage, selectedProgLangs)}>
                <Modal.Header closeButton>
                    <Modal.Title>Starting a new extraction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <StartExtractionForm 
                        projectBranchesData={projectBranchesData} />
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
                                <Button className='mx-2 mt-3 mb-4' variant='secondary' onClick={handleClose}>Close</Button>
                                <Button className='mx-2 mt-3 mb-4' disabled={isLoading || ((errorMessage?.trim()?.length || 0) > 0 && !show2ndPage) || (!pathTextfield) || (selectedProgLangs?.length === 0)} variant='primary' type='submit'>{show2ndPage ? 'Start!' : 'Next >>'}</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default StartExtractionModal