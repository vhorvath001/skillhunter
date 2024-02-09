import Form from 'react-bootstrap/Form';
import { BsInfoSquare } from 'react-icons/bs';
import { FaStarOfLife } from 'react-icons/fa';

const RepositoryForm = ( { record } ) => {
    return (
        <>
            <input type='hidden' name='id' value={record ? record.id : '-1'} />
            <Form.Group className='mb-3' controlId='name'>
                <Form.Label className='fw-bolder'>Name</Form.Label>
                <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                <Form.Control 
                    type='text' 
                    defaultValue={record ? record.name : ''}
                    name='name'
                    required
                    autoFocus />
            </Form.Group>
            <Form.Group className='mb-3' controlId='desc'>
                <Form.Label className='fw-bolder'>Description</Form.Label>
                <Form.Control 
                    type='text'
                    name='desc' 
                    defaultValue={record ? record.desc : ''} />
            </Form.Group>
            <Form.Group className='mb-3' controlId='url'>
                <Form.Label className='fw-bolder'>URL</Form.Label>
                <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                <BsInfoSquare className='ms-2' size={20} title='The endpoint of repository.'/>
                <Form.Control 
                    type='text'
                    name='url'
                    defaultValue={record ? record.url : ''} 
                    required />
            </Form.Group>
            <Form.Group className='mb-3' controlId='token'>
                <Form.Label className='fw-bolder'>Token</Form.Label>
                <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                <BsInfoSquare className='ms-2' size={20} title='The token to access the repository on the URL above.'/>
                <Form.Control 
                    type='password'
                    name='token'
                    defaultValue={record ? record.token : ''}
                    required />
            </Form.Group>
        </>        
    )
}

export default RepositoryForm;