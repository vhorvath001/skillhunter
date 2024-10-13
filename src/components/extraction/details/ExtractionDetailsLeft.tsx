import { ReactElement } from "react"
import Table from 'react-bootstrap/Table'
import { format } from 'date-fns'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ExtractionType } from '../../../context/AppTypes'
import { GrInProgress } from "react-icons/gr"
import { FcHighPriority, FcOk } from "react-icons/fc"
import { FcCancel } from "react-icons/fc"
import { BsInfoSquare } from 'react-icons/bs'

type PropsType = {
    extraction: ExtractionType
}

const ExtractionDetailsLeft = ({ extraction }: PropsType): ReactElement => {
    return (
        <div>
            <Row className='m-2'>
                <Col>
                    <label className='me-2 ms-2'>
                        {extraction.status === 'IN PROGRESS' && <GrInProgress className='mb-1' title='In progress' size={25} /> }
                        {extraction.status === 'COMPLETED' && <FcOk className='mb-1' title='Completed' size={25} /> }
                        {extraction.status === 'FAILED' && <FcHighPriority className='mb-1' title='Failed' size={25} /> }
                        {extraction.status === 'CANCELLED' && <FcCancel className='mb-1' title='Cancelled' size={25} /> }
                    </label>
                    <label title='The name of theextraction'><b>{extraction.name}</b></label>                
                </Col>
            </Row>

            <hr className='m-1'/>
            
            <Row className='m-3 shadow-sm bg-body rounded'>
                <Col sm={3}><label className='extractionDetailsLabel'>Start Date:</label></Col>
                <Col sm={9}><label className='extractionDetailsValue'>{format(extraction.startDate, 'yyyy-MM-dd HH:mm:ss')}</label></Col>
            </Row>

            <Row className='m-3 shadow-sm bg-body rounded'>
                <Col sm={3}><label className='extractionDetailsLabel'>Path:</label></Col>
                <Col sm={9}><label className='extractionDetailsValue'>{extraction.path}</label></Col>
            </Row>

            <Row className='m-3 shadow-sm bg-body rounded'>
                <Col sm={3}><label className='extractionDetailsLabel'>Repository:</label></Col>
                <Col sm={9}><label className='extractionDetailsValue' title={extraction.repository.desc}>{extraction.repository.name} (endpoint: <i>{extraction.repository.url}</i>)</label></Col>
            </Row>

            <Row className='m-3 shadow-sm bg-body rounded'>
                <Col sm={3}><label className='extractionDetailsLabel'>Programming language(s):</label></Col>
                <Col sm={9}><label className='extractionDetailsValue'>{extraction.progLangs.map(pl => pl.name).join(', ')}</label></Col>
            </Row>

            <Row className='m-3 shadow-sm bg-body rounded'>
                <Col sm={3}><label className='extractionDetailsLabel'>Number of commits to be processed:</label></Col>
                <Col sm={9}>
                    <label className='extractionDetailsValue'>
                        {extraction.nrOfCommitsType === 'ALL' &&
                            'all the commits'
                        }
                        {extraction.nrOfCommitsType === 'LAST' &&
                            <>the <i>last</i> <b>{extraction.nrOfCommits}</b> commits</>
                        }
                        {extraction.nrOfCommitsType === 'BETWEEN' &&
                            <>
                                the commits 
                                {extraction.nrOfCommitsTypeBetweenFrom && 
                                    <>
                                         <i> since</i> <b>{extraction.nrOfCommitsTypeBetweenFrom.toString()}</b>
                                    </>
                                }
                                {extraction.nrOfCommitsTypeBetweenFrom && extraction.nrOfCommitsTypeBetweenTo &&
                                    ' and '
                                }
                                {extraction.nrOfCommitsTypeBetweenTo && 
                                    <>
                                        <i> until</i> <b>{extraction.nrOfCommitsTypeBetweenTo.toString()}</b>
                                    </>
                                }
                            </>
                        }
                    </label>
                </Col>
            </Row>

            <Row className='m-3'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Project <BsInfoSquare className='ms-2 mb-1' size={20} title='These selected projects are parts of the extraction' /></th>
                            <th>Branch <BsInfoSquare className='ms-2 mb-1' size={20} title='This branch was selected to query the commits from the project' /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {extraction.projectsBranches.map(pb => (
                            <tr>
                                <td title={'Gitlab repo id: ' + pb.projectId}>{pb.projectName}</td>
                                <td>{pb.branch}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>

        </div>
    )
}

export default ExtractionDetailsLeft