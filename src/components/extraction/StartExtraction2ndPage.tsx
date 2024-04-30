import { ReactElement, useState } from 'react';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import { ProjectsBranchesType } from '../../context/ExtractionProvider';

type PropsType = {
    projectBranchesData: ProjectsBranchesType[]
}

const StartExtraction2ndPage = ({ projectBranchesData }: PropsType): ReactElement => {
    return (
        <>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>
                            <Form.Check type='checkbox' onChange={() => {
                                const allCb = (document.querySelectorAll('input[name^="project_"]') as unknown) as HTMLInputElement[]
                                allCb.forEach((cb) => { cb.click() })}} />
                        </th>
                        <th>Project</th>
                        <th>Branches</th>
                    </tr>
                </thead>
                <tbody>
                    {projectBranchesData.map((pb, index) => {
                        const [ enabled, setEnabled ] = useState<boolean>(false)
                        return (
                            <tr key={pb.id}>
                                <td className={!enabled ? 'opacity-50' : ''}>{index}</td>
                                <td>
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
                    )})}
                </tbody>
            </Table>
        </>
    )
}

export default StartExtraction2ndPage