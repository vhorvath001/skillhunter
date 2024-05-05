import { ReactElement } from 'react'
import Spinner from 'react-bootstrap/Spinner'

const Loading = (): ReactElement => {
    return (
        <div className='loadingDiv'>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}

export default Loading