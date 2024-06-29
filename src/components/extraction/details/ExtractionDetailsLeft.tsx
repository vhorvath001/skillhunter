import { ReactElement } from "react"
import { ExtractionType } from '../../../context/ExtractionProvider'
import ListGroup from 'react-bootstrap/ListGroup'
import { format } from 'date-fns'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

type PropsType = {
    extraction: ExtractionType
}

const ExtractionDetailsLeft = ({ extraction }: PropsType): ReactElement => {
    return (
        <div>
            <Row className='m-2'>
                <Col sm={3}><label className='extractionDetailsLabel'>Status:</label></Col>
                <Col sm={9}><label className='extractionDetailsValue'>{extraction.status}</label></Col>
            </Row>

            <hr className='m-1'/>
            
            <Row className='m-2'>
                <Col sm={3}><label className='extractionDetailsLabel'>Start Date:</label></Col>
                <Col sm={9}><label className='extractionDetailsValue'>{format(extraction.startDate, 'yyyy-MM-dd HH:mm:ss')}</label></Col>
            </Row>

            <Row className='m-2'>
                <Col sm={3}><label className='extractionDetailsLabel'>Path:</label></Col>
                <Col sm={9}><label className='extractionDetailsValue'>{extraction.path}</label></Col>
            </Row>

            <Row className='m-2'>
                <Col sm={3}><label className='extractionDetailsLabel'>Repository:</label></Col>
                <Col sm={9}><label className='extractionDetailsValue' title={extraction.repository.desc}>{extraction.repository.name} ({extraction.repository.url})</label></Col>
            </Row>

            <Row className='m-2'>
                <Col sm={3}><label className='extractionDetailsLabel'>Projects-branches:</label></Col>
                <Col sm={9}>
                    <ListGroup className='extractionDetailsPBList'>
                        {extraction.projectsBranches.map(pb => (
                            <ListGroup.Item>
                                <label className='extractionDetailsValue' title={'Gitlab repo id: ' + pb.projectId}>{pb.projectName}</label>
                                <label className='extractionDetailsValue'>&nbsp;&nbsp;-&nbsp;&nbsp;{pb.branch}</label>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>                    
                </Col>
            </Row>

            <Row className='m-2'>
                <Col sm={3}><label className='extractionDetailsLabel'>Programming language(s):</label></Col>
                <Col sm={9}><label className='extractionDetailsValue'>{extraction.progLangs.map(pl => pl.name).join(', ')}</label></Col>
            </Row>
        </div>
    )
}

export default ExtractionDetailsLeft