import RepositoryListHeader from './RepositoryListHeader';
import RepositoryRow from './RepositoryRow';
import AdminList from '../../utils/list/AdminList';
import RepositoryForm from './RepositoryForm';

const RepositoryList = () => {
    const newRepositoryFormId = 'newRepositoryForm';
    const resourceName = '/repositories';
    const maxItemsPerPage = 4;

    return (
        <AdminList 
            resourceName={resourceName}
            maxItemsPerPage={maxItemsPerPage}
            title='List of Repositories'
            newFormTitleAdd='Add a new Repository'
            addButtonTooltip='Adding a new repository to read from.'
            listHeaderEl={ <RepositoryListHeader /> } 
            formEl={ <RepositoryForm /> }
            renderListRowEl={(item, handleDelete, handleSave) => (
                <RepositoryRow 
                    key={item.id} 
                    record={item} 
                    formId={newRepositoryFormId}
                    handleSave={handleSave}
                    handleDelete={handleDelete} />
            )}
        />
    )
}

export default RepositoryList;