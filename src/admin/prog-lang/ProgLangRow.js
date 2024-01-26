import { FcDeleteRow, FcEditImage } from 'react-icons/fc';
import ModalForm from '../../utils/modal/ModalForm';
import ModalConfirmation from '../../utils/modal/ModalConfirmation';
import ProgLangForm from './ProgLangForm';

const ProgLangRow = ( { record, formId, handleSave, handleDelete } ) => {
    return (
        <tr>
            <td>{record.name}</td>
            <td>
                <ModalForm 
                    body={ <ProgLangForm 
                                record={record} 
                                formId={formId} />} 
                    title='Edit an existing Programming Language' 
                    icon={ <FcEditImage size={25} role='button' /> }
                    handleSave={handleSave} className='me-1' />
                <ModalConfirmation
                    icon={<FcDeleteRow size={25} role='button' />} 
                    message='Are you sure to delete the record?'
                    id={record.id}
                    handleOperation={handleDelete} />
            </td>
        </tr>
    )
}

export default ProgLangRow;