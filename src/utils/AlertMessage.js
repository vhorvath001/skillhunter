import Alert from 'react-bootstrap/Alert';

const AlertMessage = ({ errorMessage }) => {
    return (
        <div className='col-6 mx-auto'>
            <Alert key='danger' variant='danger' className='justify-content-center'>
                {errorMessage}
            </Alert>
        </div>        
    )
}

export default AlertMessage;