import ListGroup from 'react-bootstrap/ListGroup'
import { BsFilePlus } from 'react-icons/bs'
import EditableListItem from './EditableListItem'
import { ReactElement, useState } from 'react'

type PropsType = {
    list: string[] | undefined,
    originalList?: any[] | undefined,
    required: boolean,
    inputName: string,
    beforeTextField?: (originalRecord: any, index: number) => JSX.Element,
    beforeTextFieldWidth?: number,
    type?: string
}

const EditableList = ({ list, required, inputName, beforeTextField, originalList, beforeTextFieldWidth, type }: PropsType): ReactElement => {
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
                        type={type}
                        required={required} 
                        beforeTextField={beforeTextField}
                        beforeTextFieldWidth={beforeTextFieldWidth}
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