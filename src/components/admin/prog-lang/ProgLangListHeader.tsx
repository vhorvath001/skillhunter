import { ReactElement } from 'react'
import FilterForAdminList from '../../../utils/list/FilterForAdminList'
import useProgLang from '../../../hooks/useProgLang'

const ProgLangListHeader = (): ReactElement => {
    const { handleFilter, dispatch } = useProgLang()

    return (
        <thead>
            <tr>
                <th className='col-11 text-center'>Name</th>
                <th className='col-1'></th>
            </tr>
            <FilterForAdminList 
                cols={['name']} 
                handleFilter={handleFilter}
                formId='developer_list_filter_form'
                dispatch={dispatch} />
        </thead>
    )
}

export default ProgLangListHeader;