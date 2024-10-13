import { ReactElement } from "react"
import { format } from 'date-fns'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { MdOutlineRefresh } from 'react-icons/md'
import useExtractionAdmin from '../../../hooks/useExtractionAdmin'

type PropsType = {
    extractionId: number
}

const ExtractionDetailsRight = ({ extractionId }: PropsType): ReactElement => {
    const { progressLogs, setProgressLogs, loadProgressLogs, setIsProgressLogLoading, setProgressLogErrorMessage } = useExtractionAdmin()

    return (
        <>
            <Button onClick={() => loadProgressLogs(extractionId, setProgressLogs, setIsProgressLogLoading, setProgressLogErrorMessage)} size='sm' className='m-2 ms-1' title='Reloading the progress log list.'>
                <MdOutlineRefresh size={20}/>
            </Button>
            <label className='ms-4'><b>Log messages about the progress of extraction</b></label>

            <div className='extractionDetailsProgressLogsList'>
                <Table striped bordered hover >
                    <thead>
                        <th style={{ width : '30%' }}>Timestamp</th>
                        <th>Log text</th>
                    </thead>
                    <tbody>
                        {progressLogs.map(pl => (
                            <tr>
                                <td>{format(pl.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS')}</td>
                                <td style={{ whiteSpace: 'pre-line' , wordBreak: 'break-all' }}>{pl.logText}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default ExtractionDetailsRight