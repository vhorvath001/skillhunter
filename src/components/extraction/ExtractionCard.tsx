import { ReactElement } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { ExtractionType } from '../../context/ExtractionProvider'
import { format } from 'date-fns'
import { GrInProgress } from "react-icons/gr"
import { FcOk } from "react-icons/fc"
import { FcCancel } from "react-icons/fc"
import ExtractionDetailsModal from './ExtractionDetailsModal'
import useExtraction from '../../hooks/useExtraction'
import Badge from 'react-bootstrap/Badge'
import ModalConfirmation from '../../utils/modal/ModalConfirmation'

type PropsType = {
    extraction: ExtractionType
}

const ExtractionCard = ({ extraction }: PropsType): ReactElement => {
    const { showExtractionDetails, setShowExtractionDetails, setProgressLogs, loadProgressLogs, setIsProgressLogLoading, setProgressLogErrorMessage, dispatch, handleDelete } = useExtraction()

    const handleDetailsClick = (extractionId: number): void => {
        loadProgressLogs(extractionId, setProgressLogs, setIsProgressLogLoading, setProgressLogErrorMessage)
        setShowExtractionDetails(true)
    }
    
    return (
        <Col xs={2}>
            <Card border={extraction.status === 'IN PROGRESS' ? 'secondary' :
                          extraction.status === 'COMPLETED' ? 'success' : 'danger'} className='my-3 border-3'>
                <Card.Header title={`Repository description: ${extraction.repository.desc ?? ''}\nExtraction path: ${extraction.path}`}>Repo: <b>{extraction.repository.name}</b></Card.Header>
                <Card.Body>
                    <Card.Title>
                        <b>{extraction.status}</b>
                        <label className='mx-2'>
                            {extraction.status === 'IN PROGRESS' && <GrInProgress /> }
                            {extraction.status === 'COMPLETED' && <FcOk /> }
                            {extraction.status === 'FAILED' && <FcCancel /> }
                        </label>
                    </Card.Title>
                    <Card.Text>
                        <div>Started: <b>{format(extraction.startDate, 'yyyy-MM-dd HH:mm:ss')}</b></div>
                        <div>Prog. lang.: <b>{extraction.progLangs.map(pl => pl.name).join(', ')}</b></div>
                        <div>
                            Progress: 
                            <Badge bg="info" title='It shows how many projects have been processed and altogether how many are going to.' className='mx-1'>{extraction.progressProjects}</Badge>
                            <Badge bg="secondary" title='It shows how many commits have been processed in the current project and how many are going to.' className='ms-1'>{extraction.progressCommits}</Badge>
                        </div>
                    </Card.Text>
                    <Button variant="primary" onClick={() => handleDetailsClick(extraction.id)} className='me-2 mb-2' size='sm'>Details</Button>
                    <Button variant="primary" className='me-2 mb-2' size='sm'>Map</Button>
                    <ModalConfirmation
                        icon={<Button variant="danger" className='me-2 mb-2' size='sm' title='This operation does not delete the extracted skills, they can be removed in Skill Tree. '>Delete</Button>} 
                        message='Are you sure to delete the extraction?'
                        id={String(extraction.id!)}
                        handleOperation={handleDelete}
                        dispatch={dispatch} />
                </Card.Body>
            </Card>

            {showExtractionDetails &&
                <ExtractionDetailsModal extraction={extraction}/>
            }
        </Col>
    )
}

export default ExtractionCard