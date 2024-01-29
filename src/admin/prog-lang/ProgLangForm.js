import Form from 'react-bootstrap/Form';
import EditableList from '../../utils/list/EditableList';
import { BsInfoSquare } from 'react-icons/bs';
import { FaStarOfLife } from 'react-icons/fa';

const ProgLangForm = ( { record } ) => {
    const patternList = record && record.pattern ? JSON.parse(record.pattern).patternList : [];
    
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
            <Form.Group className='mb-3' controlId='sourceFiles'>
                <Form.Label className='fw-bolder'>Source files</Form.Label>
                <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                <BsInfoSquare className='ms-2' size={20} title='Patterns of the source file names can be specified which are belong to the programming language. 
                Only these files will be examined for this programming language. More file name patterns can be defined separated by comma. For example: *.js, *.html'/>
                <Form.Control 
                    type='text'
                    name='sourceFiles'
                    defaultValue={record ? record.sourceFiles : ''} 
                    required />
            </Form.Group>
            <Form.Group className='mb-3' controlId='level'>
                <Form.Label className='fw-bolder'>Level</Form.Label>
                <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                <BsInfoSquare className='ms-2' size={20} title='It specifies how many package levels should be included. It has to be a number.'/>
                <Form.Control 
                    type='number'
                    name='level'
                    defaultValue={record ? record.level : ''}
                    required />
            </Form.Group>
            <Form.Group className='mb-3' controlId='pattern'>
                <Form.Label className='fw-bolder'>Pattern</Form.Label>
                <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                <BsInfoSquare className='ms-2' size={20} title='The regular expression pattern is used to find the import statements in the code. More patterns can be specified.'/>
                <EditableList list={patternList} required={true} />
            </Form.Group>
        </>        
    )
}

export default ProgLangForm;