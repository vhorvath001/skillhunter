import ListGroup from 'react-bootstrap/ListGroup'
import { BsFilePlus } from 'react-icons/bs'
import EditableListItem from './EditableListItem'
import { ReactElement, useState } from 'react'

type PropsType = {
    list: string[] | undefined,
    required: boolean
}

const EditableList = ({ list, required }: PropsType): ReactElement => {
    const [ items, setItems ] = useState<string[]>(list ?? []);
    const addToList = (): void => {
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