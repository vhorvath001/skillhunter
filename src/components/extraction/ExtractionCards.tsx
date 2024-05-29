import { ReactElement } from 'react'
import Row from 'react-bootstrap/Row'
import useExtraction from '../../hooks/useExtraction'
import ExtractionCard from './ExtractionCard'
import Container from 'react-bootstrap/Container'


const ExtractionCards = (): ReactElement => {
    const { state } = useExtraction()

    return (
        <Container fluid>
            <Row>
                {state.list.map((e) => (
                    <ExtractionCard extraction={e} key={e.id} />
                ))}
            </Row>
        </Container>
    )
}

export default ExtractionCards