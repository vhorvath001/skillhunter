import { FcDeleteRow, FcEditImage } from 'react-icons/fc'
import ModalForm from '../../../utils/modal/ModalForm'
import ModalConfirmation from '../../../utils/modal/ModalConfirmation'
import { ReactElement } from 'react'
import { DeveloperAction, DeveloperType } from '../../../context/DeveloperProvider'
import DeveloperForm from './DeveloperForm'

type PropsType = {
    record: DeveloperType, 
    formId: string, 
    handleSave: any, 
    handleDelete: any,
    dispatch: React.Dispatch<DeveloperAction>
}

const DeveloperRow = ({ record, formId, handleSave, handleDelete, dispatch }: PropsType): ReactElement => {
    return (
        <tr>
            <td>
                <span>{record.name}</span>
            </td>
            <td>
                <span>{record.email}</span>
            </td>
            <td className='adminIconsCell'>
                <ModalForm 
                    body={ <DeveloperForm record={record} />} 
                    formId={formId}
                    title='Edit an existing Developer' 
                    icon={ <FcEditImage 
                            size={25} 
                            role='button'
                            title='Editing the developer.' /> }
                    handleSave={handleSave}
                    dispatch={dispatch} />
                <ModalConfirmation
                    icon={<FcDeleteRow 
                            size={25} 
                            role='button'
                            title='Deleting the developer.' />} 
                    message='Are you sure to delete the record?'
                    id={record.id!}
                    handleOperation={handleDelete}
                    dispatch={dispatch} />
            </td>
        </tr>
    )
}

export default DeveloperRow