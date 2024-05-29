import { ReactElement } from 'react';
import FilterForAdminList from '../../../utils/list/FilterForAdminList';
import useRepository from '../../../hooks/useRepository';

const RepositoryListHeader = (): ReactElement => {
    const { handleFilter, dispatch } = useRepository()
    
    return (
        <thead>
            <tr>
                <th className='col-6 text-center'>Name</th>
                <th className='col-5 text-center'>URL</th>
                <th className='col-1'></th>
            </tr>
            <FilterForAdminList
                cols={['name', 'url']} 
                handleFilter={handleFilter}
                formId='developer_list_filter_form'
                dispatch={dispatch} />
        </thead>
    )
}

export default RepositoryListHeader;