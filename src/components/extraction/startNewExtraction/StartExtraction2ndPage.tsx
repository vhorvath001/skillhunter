import { ReactElement, useState } from 'react';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import { ProjectsBranchesType } from '../../../context/ExtractionProvider'
import useExtraction from '../../../hooks/useExtraction'
import Loading from '../../../utils/Loading';

type PropsType = {
    projectsBranchesData: ProjectsBranchesType[]
}

const StartExtraction2ndPage = ({ projectsBranchesData }: PropsType): ReactElement => {
    const { isLoading } = useExtraction()

    return (
        <div className='loadingParent container-fluid'>
            {isLoading && 
                <div style={{ height: '200px' }}>
                    <Loading message='Loading the projects and their branches, it might take a while.' />
                </div>
            }
            {!isLoading && 
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>
                                <Form.Check type='checkbox' onChange={() => {
                                    const allCb = (document.querySelectorAll('input[name^="project_"]') as unknown) as HTMLInputElement[]
                                    allCb.forEach((cb) => { cb.click() })
                                }} />
                            </th>
                            <th>Project</th>
                            <th>Branches</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectsBranchesData.map((pb, index) => {
                            const [ enabled, setEnabled ] = useState<boolean>(false)
                            return (
                                <tr key={pb.id}>
                                    <td className={!enabled ? 'opacity-50' : ''}>{index}</td>
                                    <td>
                                        <input type='hidden' name={'projectname_'+pb.id} value={pb.name} />
                                        <Form.Check type='checkbox' name={'project_'+pb.id} onChange={() => { setEnabled(!enabled) }}/>
                                    </td>
                                    <td className={!enabled ? 'opacity-50' : ''}>{pb.name}</td>
                                    <td className={!enabled ? 'opacity-50' : ''}>
                                        <Form.Select disabled={!enabled}  name={'branch_'+pb.id}>
                                            {pb.branches.map(b => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </Form.Select>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            }
        </div>
    )
}

export default StartExtraction2ndPage