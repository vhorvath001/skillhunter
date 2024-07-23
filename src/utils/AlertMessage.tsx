import { ReactElement } from 'react';
import Alert from 'react-bootstrap/Alert';

type PropsType = {
    errorMessage: string
}

const AlertMessage = ({ errorMessage }: PropsType): ReactElement => {
    return (
        <div className='col-9 mx-auto mt-2'>
            <Alert key='danger' variant='danger' className='justify-content-center'>
                {errorMessage}
            </Alert>
        </div>        
    )
}

export default AlertMessage;