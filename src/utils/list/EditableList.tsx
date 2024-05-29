import ListGroup from 'react-bootstrap/ListGroup'
import { BsFilePlus } from 'react-icons/bs'
import EditableListItem from './EditableListItem'
import { ReactElement, useState } from 'react'

type PropsType = {
    list: string[] | undefined,
    originalList?: any[] | undefined,
    required: boolean,
    inputName: string,
    beforeTextField?: (originalRecord: any, index: number) => JSX.Element
}

const EditableList = ({ list, required, inputName, beforeTextField, originalList }: PropsType): ReactElement => {
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
                        controlName={`${inputName}${index}`} 
                        required={required} 
                        beforeTextField={beforeTextField}
                        originalRecord={originalList ? originalList[index] : null} />
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