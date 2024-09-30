import { ReactElement } from 'react'
import Row from 'react-bootstrap/Row'
import ExtractionCard from './ExtractionCard'
import Container from 'react-bootstrap/Container'
import { ExtractionType } from '../../context/AppTypes'

type PropsType = {
    list: ExtractionType[]
}

const ExtractionCards = ({ list }: PropsType): ReactElement => {
    return (
        <Container fluid>
            <Row className='row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6'>
                {list.map((e) => (
                    <ExtractionCard extraction={e} key={e.id} />
                ))}
            </Row>
        </Container>
    )
}

export default ExtractionCards