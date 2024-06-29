import { FcDeleteRow, FcEditImage } from 'react-icons/fc'
import ModalForm from '../../../utils/modal/ModalForm';
import ModalConfirmation from '../../../utils/modal/ModalConfirmation';
import ProgLangForm from './ProgLangForm';
import { ProgLangAction, ProgLangType } from '../../../context/ProgLangProvider';
import { ReactElement } from 'react';

type PropsType = {
    record: ProgLangType, 
    formId: string, 
    handleSave: any, 
    handleDelete: any,
    dispatch: React.Dispatch<ProgLangAction>
}

const ProgLangRow = ({ record, formId, handleSave, handleDelete, dispatch }: PropsType): ReactElement => {
    return (
        <tr>
            <td title={record.desc}>
                <span>{record.name}</span>
            </td>
            <td className='adminIconsCell'>
                <ModalForm 
                    body={ <ProgLangForm record={record} />} 
                    formId={formId}
                    title='Edit an existing Programming Language' 
                    icon={ <FcEditImage 
                            size={25} 
                            role='button'
                            title='Editing the programming language.' /> }
                    handleSave={handleSave}
                    dispatch={dispatch}
                     />
                <ModalConfirmation
                    icon={<FcDeleteRow 
                            size={25} 
                            role='button'
                            title='Deleting the programming language.' />} 
                    message='Are you sure to delete the record?'
                    id={record.id!}
                    handleOperation={handleDelete}
                    dispatch={dispatch} />
            </td>
        </tr>
    )
}

export default ProgLangRow;