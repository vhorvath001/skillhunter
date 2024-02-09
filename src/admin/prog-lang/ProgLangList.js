import ProgLangListHeader from './ProgLangListHeader';
import ProgLangRow from './ProgLangRow';
import ProgLangForm from './ProgLangForm';
import AdminList from '../../utils/list/AdminList';

const ProgLangList = () => {
    const newProgLangFormId = 'newProgLangForm';
    const resourceName = '/prog-langs';
    const maxItemsPerPage = 2;

    const addToObjectToBeSaved = (formDataObj) => {
        let patterns = [];
        Object.entries(formDataObj).map(([key,value]) => {
            if (key.startsWith('patternListItem_')) {
                if (value) {
                    patterns.push(value);
                }
                delete formDataObj[key];
            }
        });
        formDataObj.pattern = JSON.stringify({'patternList': patterns});
    }

    return (
        <AdminList 
            resourceName={resourceName}
            maxItemsPerPage={maxItemsPerPage}
            title='List of Programming Languages'
            newFormTitleAdd='Add a new Programming Language'
            addButtonTooltip='Adding a new programming language to be processed.'
            listHeaderEl={ <ProgLangListHeader /> } 
            formEl={ <ProgLangForm /> }
            addToObjectToBeSaved={(formDataObj) => addToObjectToBeSaved(formDataObj)}
            renderListRowEl={(item, handleDelete, handleSave) => (
                <ProgLangRow 
                    key={item.id} 
                    record={item} 
                    formId={newProgLangFormId}
                    handleSave={handleSave}
                    handleDelete={handleDelete} />
            )}
        />
    )
}

export default ProgLangList;