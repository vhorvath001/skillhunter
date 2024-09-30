import { ChangeEvent, ReactElement, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form'
import { MdMerge } from "react-icons/md"
import { BsInfoSquare } from 'react-icons/bs'
import useDeveloper from '../../../hooks/useDeveloper';

type PropsType = {
    id: number
}

const DeveloperMergeModal = ({ id }: PropsType): ReactElement => {
    const { data, handleClickOnMerge, dispatch } = useDeveloper()
    const [ show, setShow ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>('');
    const [ disableMergeButton, setDisableMergeButton ] = useState<boolean>(true) 
    const [ mergeIntoDeveloper, setMergeIntoDeveloper ] = useState<string>('')

    const handleMergeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setDisableMergeButton(e.target.value === '-1')
        setMergeIntoDeveloper(e.target.value)
    }

    const handleClose = (): void => {
        setShow(false);
        setErrorMessage('');
    }

    return (
        <>
            <span onClick={() => setShow(true)} className='me-1' data-testid='t-modal-show'>
                <MdMerge
                    size={25} 
                    role='button'
                    title='Merging the developer in to another one.' />
            </span>
            <Modal show={show} onHide={handleClose} dialogClassName="modal-80w">
                <Modal.Header closeButton>
                    <Modal.Title>Merging the developer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            Merge into
                            <BsInfoSquare className='ms-2 mb-1 me-4' size={20} title="The current developer's score will be merged in to the selected developer and the current developer will be removed." />
                            <Form.Select onChange={handleMergeChange} className='w-auto d-lg-inline'>
                                <option key='-1' value='-1'>---</option>
                                { data.map(r => (
                                    <>
                                        {r.id !== id &&
                                            <option key={r.id} value={r.id}>{r.name} ({r.email})</option>
                                        }
                                    </>
                                ))}
                            </Form.Select>                            
                            <Button 
                                variant='primary' 
                                className='ms-4' 
                                disabled={disableMergeButton} 
                                onClick={() => handleClickOnMerge(id!, 
                                                                  Number(mergeIntoDeveloper),
                                                                  dispatch,
                                                                  handleClose, 
                                                                  setErrorMessage)}>
                                Merge
                            </Button>
                        </Col>
                    </Row>
                    {errorMessage &&
                        <Row className='mt-3'>
                            <Col xs={12} md={9}>
                                <Alert key='danger' variant='danger'>
                                    {errorMessage}
                                </Alert>
                            </Col>
                        </Row>
                    }
                </Modal.Body>
            </Modal>
        </>        
    )
}

export default DeveloperMergeModal