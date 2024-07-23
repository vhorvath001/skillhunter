import { ChangeEvent, ReactElement, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

type PropsType = {
    resourceTypes: string[][],
    componentOne: ReactElement,
    componentTwo: ReactElement,
}

const ExtractionMapFilter = ({ resourceTypes, componentOne, componentTwo }: PropsType): ReactElement => {
    const [ showComponentOne, setShowComponentOne ] = useState<boolean>(false)
    const [ showComponentTwo, setShowComponentTwo ] = useState<boolean>(false)

    const changeResourceTypeOption = (e: ChangeEvent<HTMLSelectElement>): void => {
        const selected: string = e.target.value
        if (selected === resourceTypes[0][0]) {
            setShowComponentOne(false)
            setShowComponentTwo(false)
        } else if (selected === resourceTypes[1][0]) {
            setShowComponentOne(true)
            setShowComponentTwo(false)
        } else if (selected === resourceTypes[2][0]) {
            setShowComponentOne(false)
            setShowComponentTwo(true)
        } 
    }

    return (
        <div>
            <label className='me-3'>Showing </label>
            <Form.Select onChange={changeResourceTypeOption} name='selectedResourceType' className='mb-2 me-3 w-auto d-lg-inline'>
                { resourceTypes.map(rt => (
                    <option value={rt[0]}>{rt[1]}</option>    
                ))}
                {/* <option value='?????'>all the resources</option>
                <option value='?????'>the following developer only</option>
                <option value='?????'>the following skill only</option> */}
            </Form.Select>
            { showComponentOne && 
                componentOne
            }
            { showComponentTwo && 
                componentTwo
            }
            <Button className='ms-4'>Show</Button>
        </div>
    )
}

export default ExtractionMapFilter