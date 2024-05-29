import { FormEvent, ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

type PropsType = {
    cols: string[],
    handleFilter: (dispatch: React.Dispatch<any>, e: React.FormEvent<HTMLFormElement>) => void,
    formId: string,
    dispatch: React.Dispatch<any>
}

const FilterForAdminList = ({ cols, handleFilter, formId, dispatch }: PropsType): ReactElement => {
    return (
        <tr>
            <th className='d-none'>
                <Form 
                    id={formId} 
                    onSubmit={(e: FormEvent<HTMLFormElement>) => handleFilter(dispatch, e)} />
            </th>
            {cols.map((col, index) => 
                <th key={'filter_for_admin_list_'+index}>
                    <input 
                        form={formId} 
                        type='text' 
                        name={'list_filter_'+col} 
                        style={{ width: '100%'}} />
                </th>
            )}
            <th>
                <Button 
                    size='sm' 
                    variant='secondary' 
                    type='submit' 
                    form={formId}>
                    Filter
                </Button>
            </th>
        </tr>
    )
}

export default FilterForAdminList