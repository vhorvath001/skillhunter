import Form from 'react-bootstrap/Form';
import EditableList from '../../utils/list/EditableList';

const ProgLangForm = ( { record, formId } ) => {
    const patternList = record && record.pattern ? JSON.parse(record.pattern).patternList : [];
    
    return (
        <Form id={formId}>
            <input type='hidden' name='id' value={record ? record.id : '-1'} />
            <Form.Group className='mb-3' controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    type='text' 
                    defaultValue={record ? record.name : ''}
                    name='name'
                    autoFocus />
            </Form.Group>
            <Form.Group className='mb-3' controlId='desc'>
                <Form.Label>Description</Form.Label>
                <Form.Control 
                    type='text'
                    name='desc' 
                    defaultValue={record ? record.desc : ''} />
            </Form.Group>
            <Form.Group className='mb-3' controlId='level'>
                <Form.Label>Level</Form.Label>
                <div><Form.Text muted>It specifies how many package levels should be included.</Form.Text></div>
                <Form.Control 
                    type='text'
                    name='level'
                    defaultValue={record ? record.level : ''} />
            </Form.Group>
            <Form.Group className='mb-3' controlId='pattern'>
                <Form.Label>Pattern</Form.Label>
                <div><Form.Text muted>The regular expression pattern is used to find the import statements in the code. More patterns can be specified.</Form.Text></div>
                <EditableList list={patternList}/>
            </Form.Group>
        </Form>        
    )
}

export default ProgLangForm;