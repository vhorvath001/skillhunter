import { ReactElement } from 'react'
import Row from 'react-bootstrap/Row'
import ExtractionCard from './ExtractionCard'
import Container from 'react-bootstrap/Container'
import useExtractionAdmin from '../../hooks/useExtractionAdmin'


const ExtractionCards = (): ReactElement => {
    const { state } = useExtractionAdmin()

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