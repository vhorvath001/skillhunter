import { ChangeEvent, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import useExtraction from '../../hooks/useExtraction'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'

const ExtractionFilter = (): ReactElement => {
    const { repositoryOptions, filterRepoId, setFilterRepoId, handleFilterClick, filterDateFrom, setFilterDateFrom, filterDateTo, setFilterDateTo,
            filterErrorMessage, setFilterErrorMessage, setExtractions, setAreExtractionsLoading, filterStatus, setFilterStatus } = useExtraction()

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

    return (
        <Container fluid>
            <Row>
                <Col xs={12} md={8}>
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
                        <option key='IN PROGRESS' value='IN PROGRESS'>In Progress</option>
                    </select>

                    <label className='m-2'>Date range:</label>
                    <input type='datetime-local' step='1' value={filterDateFrom} onChange={handleFilterDateFrom} />
                    <label className='mx-3'>&#8213;</label>
                    <input type='datetime-local' step='1' value={filterDateTo} onChange={handleFilterDateTo} />

                    <Button className='mx-3 my-2' variant='primary' onClick={() => handleFilterClick(filterRepoId, filterStatus, filterDateFrom, filterDateTo, setFilterErrorMessage, setExtractions, setAreExtractionsLoading)}>Filter</Button>
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