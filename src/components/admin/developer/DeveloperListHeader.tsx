import { ReactElement } from 'react'
import FilterForAdminList from '../../../utils/list/FilterForAdminList'
import useDeveloper from '../../../hooks/useDeveloper'

const DeveloperListHeader = (): ReactElement => {
    const { handleFilter, dispatch } = useDeveloper()

    return (
        <thead>
            <tr>
                <th className='col-5 text-center'>Name</th>
                <th className='col-6 text-center'>Email</th>
                <th className='col-1'></th>
            </tr>
            <FilterForAdminList 
                cols={['name', 'email']} 
                handleFilter={handleFilter}
                formId='developer_list_filter_form'
                dispatch={dispatch} />
        </thead>
    )
}

export default DeveloperListHeader