import { ReactElement } from 'react'
import Row from 'react-bootstrap/Row'
import useExtraction from '../../hooks/useExtraction'
import ExtractionCard from './ExtractionCard'
import { Container } from 'react-bootstrap'


const ExtractionCards = (): ReactElement => {
    const { extractions } = useExtraction()

    return (
        <Container fluid>
            <Row>
                {extractions.map((e) => (
                    <ExtractionCard extraction={e} key={e.id} />
                ))}
            </Row>
        </Container>
    )
}

export default ExtractionCards