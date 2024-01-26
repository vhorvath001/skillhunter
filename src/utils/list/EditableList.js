import ListGroup from 'react-bootstrap/ListGroup';
import { BsFilePlus } from 'react-icons/bs';
import EditableListItem from './EditableListItem';
import { useState } from 'react';

const EditableList = ({ list }) => {
    const [ items, setItems ] = useState(list);
    const addToList = () => {
        setItems([...items, ''])
    }

    return (
        <>
            <ListGroup>
                {items.map((i, index) => (
                    <EditableListItem item={i} key={index} controlName={`patternListItem_${index}`} />
                ))}
            </ListGroup>
            <span onClick={addToList}>
                <BsFilePlus size={25} />
            </span>
        </>

    )
}

export default EditableList;