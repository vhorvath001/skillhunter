import RepositoryListHeader from './RepositoryListHeader';
import RepositoryRow from './RepositoryRow';
import AdminList from '../../../utils/list/AdminList';
import RepositoryForm from './RepositoryForm';
import useRepository from '../../../hooks/useRepository';

const RepositoryList = () => {
    const newRepositoryFormId = 'newRepositoryForm';
    const maxItemsPerPage = 10;

    const { dispatch, state, isLoading, fetchError, handleDelete, handleSave } =  useRepository()

    return (
        <AdminList 
            list={state.list}
            isLoading={isLoading}
            fetchError={fetchError}
            maxItemsPerPage={maxItemsPerPage}
            handleDelete={handleDelete}
            handleSave={handleSave}
            title='List of Repositories'
            newFormTitleAdd='Add a new Repository'
            addButtonTooltip='Adding a new repository to read from.'
            listHeaderEl={ <RepositoryListHeader /> } 
            formEl={ <RepositoryForm /> }
            dispatch={dispatch}
            renderListRowEl={(item, handleDelete, handleSave) => (
                <RepositoryRow 
                    key={item.id} 
                    record={item} 
                    formId={newRepositoryFormId}
                    handleSave={handleSave}
                    handleDelete={handleDelete}
                    dispatch={dispatch} />
            )}
        />
    )
}

export default RepositoryList;