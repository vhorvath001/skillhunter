import { ReactElement } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { ExtractionType } from '../../context/ExtractionProvider'
import { format } from 'date-fns'
import { GrInProgress } from "react-icons/gr"
import { FcOk } from "react-icons/fc"
import { FcCancel } from "react-icons/fc"

type PropsType = {
    extraction: ExtractionType
}

const ExtractionCard = ({ extraction }: PropsType): ReactElement => {
    return (
        <Col xs={2}>
            <Card border={extraction.status === 'IN PROGRESS' ? 'secondary' :
                          extraction.status === 'COMPLETED' ? 'success' : 'danger'} className='my-3 border-3'>
                <Card.Header title={extraction.repository.desc}>Repo: <b>{extraction.repository.name}</b></Card.Header>
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
                    </Card.Text>
                    <Button variant="primary" style={{marginRight: '8px', marginBottom: '5px'}}>Details</Button>
                    <Button variant="primary" style={{marginBottom: '5px'}}>Extraction map</Button>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default ExtractionCard