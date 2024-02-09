import { FcDeleteRow, FcEditImage } from 'react-icons/fc';
import ModalForm from '../../utils/modal/ModalForm';
import ModalConfirmation from '../../utils/modal/ModalConfirmation';
import RepositoryForm from './RepositoryForm';

const RepositoryRow = ( { record, formId, handleSave, handleDelete } ) => {
    return (
        <tr>
            <td>
                <span title={record.desc}>{record.name}</span>
            </td>
            <td>
                {record.url}
            </td>
            <td>
                <ModalForm 
                    body={ <RepositoryForm record={record} />} 
                    formId={formId}
                    title='Edit an existing Repository' 
                    icon={ <FcEditImage 
                            size={25} 
                            role='button'
                            title='Editing the repository.' /> }
                    handleSave={handleSave} className='me-1' />
                <ModalConfirmation
                    icon={<FcDeleteRow 
                            size={25} 
                            role='button'
                            title='Deleting the repository.' />} 
                    message='Are you sure to delete the record?'
                    id={record.id}
                    handleOperation={handleDelete} />
            </td>
        </tr>
    )
}

export default RepositoryRow;