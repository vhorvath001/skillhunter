import { ReactElement, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { format } from 'date-fns'
import { GrInProgress } from "react-icons/gr"
import { FcHighPriority, FcOk } from "react-icons/fc"
import { FcCancel } from "react-icons/fc"
import ExtractionDetailsModal from './details/ExtractionDetailsModal'
import Badge from 'react-bootstrap/Badge'
import ModalConfirmation from '../../utils/modal/ModalConfirmation'
import ExtractionMapModal from './map/ExtractionMapModal'
import { ExtractionType } from '../../context/AppTypes'
import useExtractionAdmin from '../../hooks/useExtractionAdmin'
import useExtractionMap from '../../hooks/useExtractionMap'
import { BsInfoSquare } from 'react-icons/bs'
import Form from 'react-bootstrap/Form'
import ModalErrorMessage from '../../utils/modal/ModalErrorMessage'

type PropsType = {
    extraction: ExtractionType
}

const ExtractionCard = ({ extraction }: PropsType): ReactElement => {
    const { showExtractionDetails, setShowExtractionDetails, setProgressLogs, loadProgressLogs, setIsProgressLogLoading, setProgressLogErrorMessage, dispatch, handleDelete, handleCancel, handleFavouriteChange } = useExtractionAdmin()
    const { showExtractionMap, setShowExtractionMap, setExtraction } = useExtractionMap()

    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleDetailsClick = (extractionId: number): void => {
        loadProgressLogs(extractionId, setProgressLogs, setIsProgressLogLoading, setProgressLogErrorMessage)
        setShowExtractionDetails(true)
    }

    const handleMapClick = (): void => {
        setShowExtractionMap(true)
        setExtraction(extraction)
    }
    
    return (
        <Col xs>
            <Card border={extraction.status === 'IN PROGRESS' ? 'secondary' :
                          extraction.status === 'COMPLETED' ? 'success' : 
                          extraction.status === 'CANCELLED' ? 'warning' : 'danger'} className='bg-light border-3 shadow mb-3 bg-white rounded'>
                <Card.Header>
                    Repo: <b>{extraction.repository.name}</b>
                    <BsInfoSquare className='ms-2 mb-1' size={20} title={`Repository description: ${extraction.repository.desc ?? ''}`} />
                    <label className="form-switch float-end">
                        <Form.Control 
                            type='checkbox' 
                            title='Mark it as favourite' 
                            className='mb-1 form-check-input' 
                            onChange={(e) => handleFavouriteChange(e, dispatch, setErrorMessage, extraction.id)} 
                            checked={extraction.favourite} />
                    </label>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <b>{extraction.status}</b>  
                        <label className='mx-2'>
                            {extraction.status === 'IN PROGRESS' && <GrInProgress /> }
                            {extraction.status === 'COMPLETED' && <FcOk /> }
                            {extraction.status === 'FAILED' && <FcHighPriority /> }
                            {extraction.status === 'CANCELLED' && <FcCancel /> }
                        </label>
                    </Card.Title>
                    <Card.Text>
                        <div className='text-truncate pb-1' title={`Name: ${extraction.name}`}>
                            <BsInfoSquare className='me-1 mb-1' size={20} title={`Projects to be processed: ${extraction.projectsBranches.map(r => r.projectName).join(', ')}`} />
                            <u>{extraction.name}</u>
                        </div>
                        <div>Started: <b>{format(extraction.startDate, 'yyyy-MM-dd HH:mm:ss')}</b></div>
                        <div className='text-truncate' title={`Extraction path: ${extraction.path}`}>
                            Path: <b>{extraction.path}</b> 
                        </div>
                        <div className='pt-1'>
                            Progress: 
                            <Badge bg="info" title='It shows how many projects have been processed and altogether how many are going to.' className='mx-1'>
                                {extraction.progressProjects}
                            </Badge>
                            <Badge bg="secondary" title='It shows how many commits have been processed in the current project being processed and how many are going to.' className='ms-1'>
                                {extraction.progressCommits}
                            </Badge>
                        </div>
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Button 
                        onClick={() => handleDetailsClick(extraction.id)} 
                        className='me-2' size='sm' variant="primary">
                        Details
                    </Button>
                    <Button 
                        onClick={() => handleMapClick()} 
                        className='me-2' size='sm' variant="primary">
                        Map
                    </Button>

                    {extraction.status !== 'IN PROGRESS' &&
                        <ModalConfirmation
                            icon={<Button variant="danger" className='me-2' size='sm' title='This operation does not delete the extracted skills, they can be removed in Skill Tree. '>Delete</Button>} 
                            message='Are you sure to delete the extraction?'
                            id={String(extraction.id!)}
                            handleOperation={handleDelete}
                            dispatch={dispatch} />
                    }
                    {extraction.status === 'IN PROGRESS' &&
                        <ModalConfirmation
                            icon={<Button variant="danger" className='me-2' size='sm' title='Interrupting the extraction'>Cancel</Button>} 
                            message='Are you sure to cancel the extraction?'
                            id={String(extraction.id!)}
                            handleOperation={handleCancel}
                            dispatch={dispatch} />
                    }
                </Card.Footer>
            </Card>

            {showExtractionDetails &&
                <ExtractionDetailsModal extraction={extraction} />
            }

            {showExtractionMap &&
                <ExtractionMapModal />
            }

            {errorMessage &&
                <ModalErrorMessage errorMessage={errorMessage} />
            }
        </Col>
    )
}

export default ExtractionCard