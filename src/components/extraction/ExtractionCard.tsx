import { ReactElement } from 'react'
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

type PropsType = {
    extraction: ExtractionType
}

const ExtractionCard = ({ extraction }: PropsType): ReactElement => {
    const { showExtractionDetails, setShowExtractionDetails, setProgressLogs, loadProgressLogs, setIsProgressLogLoading, setProgressLogErrorMessage, dispatch, handleDelete, handleCancel } = useExtractionAdmin()
    const { showExtractionMap, setShowExtractionMap, setExtraction } = useExtractionMap()

    const handleDetailsClick = (extractionId: number): void => {
        loadProgressLogs(extractionId, setProgressLogs, setIsProgressLogLoading, setProgressLogErrorMessage)
        setShowExtractionDetails(true)
    }

    const handleMapClick = (): void => {
        setShowExtractionMap(true)
        setExtraction(extraction)
    }
    
    return (
        <Col xs lg={3}>
            <Card border={extraction.status === 'IN PROGRESS' ? 'secondary' :
                          extraction.status === 'COMPLETED' ? 'success' : 
                          extraction.status === 'CANCELLED' ? 'warning' : 'danger'} className='my-3 border-3'>
                <Card.Header>
                    Repo: <b>{extraction.repository.name}</b>
                    <BsInfoSquare className='ms-2' size={20} title={`Repository description: ${extraction.repository.desc ?? ''}`} />
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
                        <div>Name: <b>{extraction.name}</b></div>
                        <div>Started: <b>{format(extraction.startDate, 'yyyy-MM-dd HH:mm:ss')}</b></div>
                        <div>
                            Extraction path: <b>{extraction.path}</b> 
                            <BsInfoSquare className='ms-2' size={20} title={`Projects to be processed: ${extraction.projectsBranches.map(r => r.projectName).join(', ')}`} />
                        </div>
                        <div>Prog. lang.: <b>{extraction.progLangs.map(pl => pl.name).join(', ')}</b></div>
                        <div>
                            Progress: 
                            <Badge bg="info" title='It shows how many projects have been processed and altogether how many are going to.' className='mx-1'>
                                {extraction.progressProjects}
                            </Badge>
                            <Badge bg="secondary" title='It shows how many commits have been processed in the current project being processed and how many are going to.' className='ms-1'>
                                {extraction.progressCommits}
                            </Badge>
                        </div>
                    </Card.Text>
                    <Button 
                        onClick={() => handleDetailsClick(extraction.id)} 
                        className='me-2 mb-2' size='sm' variant="primary">
                        Details
                    </Button>
                    <Button 
                        onClick={() => handleMapClick()} 
                        className='me-2 mb-2' size='sm' variant="primary">
                        Map
                    </Button>

                    {extraction.status !== 'IN PROGRESS' &&
                        <ModalConfirmation
                            icon={<Button variant="danger" className='me-2 mb-2' size='sm' title='This operation does not delete the extracted skills, they can be removed in Skill Tree. '>Delete</Button>} 
                            message='Are you sure to delete the extraction?'
                            id={String(extraction.id!)}
                            handleOperation={handleDelete}
                            dispatch={dispatch} />
                    }
                    {extraction.status === 'IN PROGRESS' &&
                        <ModalConfirmation
                            icon={<Button variant="danger" className='me-2 mb-2' size='sm' title='Interrupting the extraction'>Cancel</Button>} 
                            message='Are you sure to cancel the extraction?'
                            id={String(extraction.id!)}
                            handleOperation={handleCancel}
                            dispatch={dispatch} />
                    }
                </Card.Body>
            </Card>

            {showExtractionDetails &&
                <ExtractionDetailsModal extraction={extraction} />
            }

            {showExtractionMap &&
                <ExtractionMapModal />
            }
        </Col>
    )
}

export default ExtractionCard