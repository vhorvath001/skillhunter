import ListGroup from 'react-bootstrap/ListGroup';
import { BsFilePlus } from 'react-icons/bs';
import EditableListItem from './EditableListItem';
import { useState } from 'react';

const EditableList = ({ list, required }) => {
    const [ items, setItems ] = useState(list);
    const addToList = () => {
        setItems([...items, ''])
    }

    return (
        <>
            <ListGroup className='mb-2'>
                {items.map((i, index) => (
                    <EditableListItem 
                        index={index} 
                        item={i} 
                        key={index} 
                        controlName={`patternListItem_${index}`} 
                        required={required} />
                ))}
            </ListGroup>
            <span 
                onClick={addToList} 
                className='ms-2 pt-2' 
                title='Adding a new row.'
                data-testid='t-editableListItem-add'>
                <BsFilePlus size={25} role='button' />
            </span>
        </>

    )
}

export default EditableList;