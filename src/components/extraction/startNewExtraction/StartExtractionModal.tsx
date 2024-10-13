import { ReactElement, FormEvent } from 'react'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import StartExtractionForm from './StartExtractionForm'
import Button from 'react-bootstrap/Button'
import useExtractionStartNew from '../../../hooks/useExtractionStartNew'

const StartExtractionModal = (): ReactElement => {
    const { handleStartExtraction, show2ndPage, setShow2ndPage, showStartExtraction, setShowStartExtraction, errorMessage, setErrorMessage, isLoading, projectsBranchesData, pathTextfield, nameTextfield, selectedProgLangs, setSelectedProgLangs, nrOfCommitsType, nrOfCommits, nrOfCommitsBetweenFrom, nrOfCommitsBetweenTo } = useExtractionStartNew()

    const handleClose = (): void => {
        setShowStartExtraction(false)
        setErrorMessage('')
        setShow2ndPage(false)
        setSelectedProgLangs([])
    }

    const isSubmitButtonDisable = (): boolean => {
        return isLoading || 
               ((errorMessage?.trim()?.length || 0) > 0 && !show2ndPage) || 
               (!pathTextfield) || 
               (!nameTextfield) || 
               (selectedProgLangs?.length === 0) ||
               (nrOfCommitsType === 'LAST' && !nrOfCommits) ||
               (nrOfCommitsType === 'BETWEEN' && !nrOfCommitsBetweenFrom && !nrOfCommitsBetweenTo)
    }

    return (
        <Modal show={showStartExtraction} onHide={handleClose} size="xl">
            <Form 
                id='extractionForm' 
                onSubmit={(e: FormEvent<HTMLFormElement>) => handleStartExtraction(e, handleClose, show2ndPage, setShow2ndPage, setErrorMessage, selectedProgLangs)}>
                <Modal.Header closeButton>
                    <Modal.Title>Starting a new extraction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <StartExtractionForm 
                        projectsBranchesData={projectsBranchesData} />
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
                                <Button 
                                    className='mx-2 mt-3 mb-4' 
                                    variant='secondary' 
                                    onClick={handleClose}>Close</Button>
                                <Button 
                                    className='mx-2 mt-3 mb-4' 
                                    disabled={isSubmitButtonDisable()} 
                                    variant='primary' 
                                    type='submit'>
                                    {show2ndPage ? 'Start!' : 'Next >>'}
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default StartExtractionModal