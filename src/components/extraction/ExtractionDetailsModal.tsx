import { ReactElement } from "react"
import useExtraction from "../../hooks/useExtraction"
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ExtractionType } from '../../context/ExtractionProvider'
import ExtractionDetailsLeft from './ExtractionDetailsLeft'
import Loading from '../../utils/Loading'
import AlertMessage from '../../utils/AlertMessage'
import ExtractionDetailsRight from './ExtractionDetailsRight'
import Container from 'react-bootstrap/Container'

type PropsType = {
    extraction: ExtractionType
}

const ExtractionDetailsModal = ({ extraction }: PropsType): ReactElement => {
    const { showExtractionDetails, setShowExtractionDetails, isProgressLogLoading, progressLogErrorMessage } = useExtraction()

    const handleClose = (): void => {
        setShowExtractionDetails(false)
    }

    return (
        <Modal show={showExtractionDetails} onHide={handleClose} dialogClassName="modal-90w">
            <Modal.Header closeButton>
                <Modal.Title>Extraction details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col>
                            <ExtractionDetailsLeft extraction={extraction} />
                        </Col>
                        <Col>
                            { isProgressLogLoading && <Loading message='Loading the progress logs.' /> }
                            { !isProgressLogLoading && progressLogErrorMessage && 
                                <div className='mt-3 w-50 ml-0 mr-0 mx-auto text-center'>
                                    <AlertMessage errorMessage={progressLogErrorMessage} />
                                </div>
                            }
                            { !isProgressLogLoading && !progressLogErrorMessage &&
                                <ExtractionDetailsRight extractionId={extraction.id} />
                            }
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default ExtractionDetailsModal