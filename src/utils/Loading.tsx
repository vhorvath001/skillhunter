import { ReactElement } from 'react'
import Spinner from 'react-bootstrap/Spinner'

type PropsType = {
    message: string
}

const Loading = ({ message }: PropsType): ReactElement => {
    return (
        <div className='loadingDiv'>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <div className='justify-content-center lh-sm'>Please wait...</div>
            <div className='justify-content-center lh-sm'>{message}</div>
        </div>
    )
}

export default Loading