import { ChangeEvent, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import { format } from 'date-fns'
import useExtractionAdmin from '../../hooks/useExtractionAdmin'
import useExtractionStartNew from '../../hooks/useExtractionStartNew'

const ExtractionFilter = (): ReactElement => {
    const { handleFilterClick, filterDateFrom, setFilterDateFrom, filterDateTo, setFilterDateTo,
            filterErrorMessage, setFilterErrorMessage, dispatch, setAreExtractionsLoading, filterStatus, setFilterStatus } = useExtractionAdmin()
    const { repositoryOptions, filterRepoId, setFilterRepoId } = useExtractionStartNew()
    
    const changeFilterRepositoryOptions = (e: ChangeEvent<HTMLSelectElement>) => {
        setFilterRepoId(Number(e.target.value))
    }

    const handleFilterDateFrom = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterDateFrom(e.currentTarget.value)
    }

    const handleFilterDateTo = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterDateTo(e.currentTarget.value)
    }

    const changeFilterStatusOptions = (e: ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(e.target.value)
    }

    const changeFilterDateFromTo = (e: ChangeEvent<HTMLSelectElement>) => {
        const filterDateRangeText: string = e.target.value
        let dateFrom: Date = new Date(Date.now())
        let dateTo: Date = new Date(Date.now())
        if (filterDateRangeText === 'YESTERDAY') {
            dateFrom.setDate(dateFrom.getDate() - 1)
            dateTo.setDate(dateTo.getDate() - 1)
        } else if (filterDateRangeText === 'THIS_WEEK') {
            const currentDay: number = dateFrom.getDay()
            dateFrom.setDate(dateFrom.getDate() - (currentDay || 7) + 1)
        } else if (filterDateRangeText === 'LAST_WEEK') {
            const currentDay: number = dateFrom.getDay()
            dateFrom.setDate(dateFrom.getDate() - ((currentDay || 7) + 6))
            dateTo.setDate(dateTo.getDate() - (currentDay || 7))
        } else if (filterDateRangeText === 'THIS_MONTH') {
            const dayInMonth: number = dateFrom.getDate()
            dateFrom.setDate(dateFrom.getDate() - dayInMonth + 1)
        } else if (filterDateRangeText === 'LAST_MONTH') {
            const dayInMonth: number = dateFrom.getDate()
            dateTo.setDate(dateFrom.getDate() - dayInMonth)
            dateFrom = new Date(dateTo)
            dateFrom.setDate(1)
        } else if (filterDateRangeText === 'THIS_YEAR') {
            dateFrom.setMonth(0)
            dateFrom.setDate(1)
        } else if (filterDateRangeText === 'LAST_YEAR') {
            dateFrom.setFullYear(dateFrom.getFullYear() - 1)
            dateFrom.setMonth(0)
            dateFrom.setDate(1)
            dateTo.setFullYear(dateTo.getFullYear() - 1)
            dateTo.setMonth(11)
            dateTo.setDate(31)
        } else if (filterDateRangeText === 'LAST_7_DAYS') {
            dateFrom.setDate(dateFrom.getDate() - 6)
        } else if (filterDateRangeText === 'LAST_30_DAYS') {
            dateFrom.setDate(dateFrom.getDate() - 29)
        } else if (filterDateRangeText === 'ALL_TIME') {
            dateFrom = new Date(1977, 8, 13)
        }
        setFilterDateFrom(format(dateFrom, 'yyyy-MM-dd') + 'T00:00:00')
        setFilterDateTo(format(dateTo, 'yyyy-MM-dd') + 'T23:59:59')
    }

    return (
        <Container fluid>
            <Row>
                <Col xs={12} md={12}>
                    <label>Repository:</label>
                    <select className='m-2' onChange={changeFilterRepositoryOptions}>
                        <option key='-1' value='-1'>---</option>
                        {repositoryOptions.map(ro => (
                            <option key={ro.key} value={ro.key}>
                                {ro.value}
                            </option>
                        ))}
                    </select>

                    <label>Status:</label>
                    <select className='m-2' onChange={changeFilterStatusOptions}>
                        <option key='-1' value='-1'>---</option>
                        <option key='COMPLETED' value='COMPLETED'>Completed</option>
                        <option key='FAILED' value='FAILED'>Failed</option>
                        <option key='CANCELLED' value='CANCELLED'>Cancelled</option>
                        <option key='IN PROGRESS' value='IN PROGRESS'>In Progress</option>
                    </select>

                    <label className='m-2'>Date range:</label>
                    <input type='datetime-local' step='1' value={filterDateFrom} onChange={handleFilterDateFrom} data-testid='iFilterDateFrom' />
                    <label className='mx-3'>&#8213;</label>
                    <input type='datetime-local' step='1' value={filterDateTo} onChange={handleFilterDateTo} data-testid='iFilterDateTo' />

                    <select className='ms-2' onChange={changeFilterDateFromTo} data-testid='sFilterDateType'>
                        <option key='TODAY' value='TODAY'>Today</option>
                        <option key='YESTERDAY' value='YESTERDAY'>Yesterday</option>
                        <option key='THIS_WEEK' value='THIS_WEEK'>This week</option>
                        <option key='LAST_WEEK' value='LAST_WEEK'>Last week</option>
                        <option key='THIS_MONTH' value='THIS_MONTH'>This month</option>
                        <option key='LAST_MONTH' value='LAST_MONTH'>Last month</option>
                        <option key='THIS_YEAR' value='THIS_YEAR'>This year</option>
                        <option key='LAST_YEAR' value='LAST_YEAR'>Last year</option>
                        <option key='LAST_7_DAYS' value='LAST_7_DAYS'>Last 7 days</option>
                        <option key='LAST_30_DAYS' value='LAST_30_DAYS'>Last 30 days</option>
                        <option key='LAST_3_MONTHS' value='LAST_3_MONTHS'>Last 3 months</option>
                        <option key='ALL_TIME' value='ALL_TIME'>All time</option>
                    </select>

                    <Button className='mx-3 my-2' variant='primary' onClick={() => handleFilterClick(filterRepoId, filterStatus, filterDateFrom, filterDateTo, setFilterErrorMessage, dispatch, setAreExtractionsLoading)}>Filter</Button>

                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    {filterErrorMessage &&
                        <Alert key='danger' variant='danger'>
                            {filterErrorMessage}
                        </Alert>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default ExtractionFilter