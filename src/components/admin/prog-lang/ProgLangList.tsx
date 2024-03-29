import ProgLangListHeader from './ProgLangListHeader'
import ProgLangRow from './ProgLangRow'
import ProgLangForm from './ProgLangForm'
import AdminList from '../../../utils/list/AdminList'
import { ReactElement } from 'react'
import useProgLang from '../../../hooks/useProgLang'

const ProgLangList = (): ReactElement => {
    const newProgLangFormId: string = 'newProgLangForm';
    const maxItemsPerPage: number = 10;

    const { dispatch, state, isLoading, fetchError, handleDelete, handleSave } =  useProgLang()

    return (
        <AdminList 
            list={state.list}
            isLoading={isLoading}
            fetchError={fetchError}
            maxItemsPerPage={maxItemsPerPage}
            handleDelete={handleDelete}
            handleSave={handleSave}
            title='List of Programming Languages'
            newFormTitleAdd='Add a new Programming Language'
            addButtonTooltip='Adding a new programming language to be processed.'
            listHeaderEl={ <ProgLangListHeader /> } 
            formEl={ <ProgLangForm /> }
            dispatch={dispatch}
            renderListRowEl={(item: any, handleDelete: any, handleSave: any) => (
                <ProgLangRow 
                    key={item.id} 
                    record={item} 
                    formId={newProgLangFormId}
                    handleSave={handleSave}
                    handleDelete={handleDelete} 
                    dispatch={dispatch}/>
            )}
        />
    )
}

export default ProgLangList;