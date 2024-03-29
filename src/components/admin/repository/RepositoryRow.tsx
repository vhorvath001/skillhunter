import { FcDeleteRow, FcEditImage } from 'react-icons/fc'
import ModalForm from '../../../utils/modal/ModalForm'
import ModalConfirmation from '../../../utils/modal/ModalConfirmation'
import RepositoryForm from './RepositoryForm'
import { ReactElement } from 'react'
import { RepositoryAction, RepositoryType } from '../../../context/RepositoryProvider'

type PropsType = {
    record: RepositoryType, 
    formId: string, 
    handleSave: any, 
    handleDelete: any,
    dispatch: React.Dispatch<RepositoryAction>
}

const RepositoryRow = ( { record, formId, handleSave, handleDelete, dispatch }: PropsType ): ReactElement => {
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
                    handleSave={handleSave}
                    dispatch={dispatch} />
                <ModalConfirmation
                    icon={<FcDeleteRow 
                            size={25} 
                            role='button'
                            title='Deleting the repository.' />} 
                    message='Are you sure to delete the record?'
                    id={record.id}
                    handleOperation={handleDelete} 
                    dispatch={dispatch}/>
            </td>
        </tr>
    )
}

export default RepositoryRow;