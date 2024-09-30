import AdminList from '../../../utils/list/AdminList'
import { ReactElement } from 'react'
import DeveloperListHeader from './DeveloperListHeader';
import DeveloperForm from './DeveloperForm';
import DeveloperRow from './DeveloperRow';
import useDeveloper from '../../../hooks/useDeveloper';

const DeveloperList = (): ReactElement => {
    const newDeveloperFormId: string = 'newDeveloperForm';
    const maxItemsPerPage: number = 10;

    const { dispatch, state, isLoading, fetchError, handleDelete, handleSave } =  useDeveloper()

    return (
        <AdminList 
            list={state.list}
            isLoading={isLoading}
            fetchError={fetchError}
            maxItemsPerPage={maxItemsPerPage}
            handleDelete={handleDelete}
            handleSave={handleSave}
            title='List of Developers'
            newFormTitleAdd='-'
            addButtonTooltip='-'
            listHeaderEl={ <DeveloperListHeader /> } 
            formEl={ <DeveloperForm /> }
            dispatch={dispatch}
            renderListRowEl={(item: any, handleDelete: any, handleSave: any) => (
                <DeveloperRow 
                    key={item.id} 
                    record={item} 
                    formId={newDeveloperFormId}
                    handleSave={handleSave}
                    handleDelete={handleDelete} 
                    dispatch={dispatch}/>
            )}
            showCreateButton={false}
        />
    )
}

export default DeveloperList