import { FormEvent, ReactElement, useEffect, useState } from 'react';
import { FcAddRow } from 'react-icons/fc';
import ModalForm from '../modal/ModalForm'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Paginator from '../Paginator';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AlertMessage from '../AlertMessage';
import Loading from '../Loading';

type PropsType = {
    list: any[], 
    isLoading: boolean, 
    fetchError: string, 
    maxItemsPerPage: number, 
    handleDelete: (dispatch: React.Dispatch<any>, handleClose: () => void, setErrorMessage: (errorMessage: string) => void, id: string) => void, 
    handleSave: (dispatch: React.Dispatch<any>, e: FormEvent<HTMLFormElement>, handleClose: () => void, setErrorMessage: (errorMessage: string) => void) => void, 
    title: string, 
    listHeaderEl: ReactElement, 
    renderListRowEl: (item: any, handleDelete: any, handleSave: any) => JSX.Element, 
    formEl: ReactElement, 
    newFormTitleAdd: string, 
    addButtonTooltip: string,
    dispatch: React.Dispatch<any>
}

const AdminList = ({ list, isLoading, fetchError, maxItemsPerPage, handleDelete, handleSave, title, listHeaderEl, renderListRowEl, formEl, 
                     newFormTitleAdd, addButtonTooltip, dispatch }: PropsType) => {
    const newFormId = 'newForm';

    const [ showedList, setShowedList ] = useState<any[]>([]);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ maxPage, setMaxPage ] = useState(0);

    useEffect(() => {
        setMaxPage(list.length % maxItemsPerPage === 0 ? 
            Math.floor(list.length / maxItemsPerPage) : 
            Math.floor(list.length / maxItemsPerPage) + 1);
        setShowedList(list.slice( (currentPage-1) * maxItemsPerPage, (currentPage) * maxItemsPerPage ));
    }, [list]);

    return (
        <div className='admin-container'>
            <div className='page-title text-center mb-5'>{title}</div>
            <main className='loadingParent container-fluid'>
                { isLoading && 
                    <Loading message='Loading the list.' />
                }
                { !isLoading && fetchError && 
                    <AlertMessage errorMessage={fetchError} />
                }
                { !isLoading && !fetchError && 
                    <div className='col-6 mx-auto'>
                        <Table striped bordered hover>
                            {listHeaderEl}
                            <tbody>
                                {showedList.map((item) => (
                                    renderListRowEl(item, handleDelete, handleSave)
                                ))}
                            </tbody>
                        </Table>
                        <Container>
                            <Row>
                                <Col className='col-4'>
                                    <ModalForm 
                                        body={ formEl } 
                                        formId={newFormId}
                                        title={newFormTitleAdd} 
                                        icon={ <Button 
                                                variant='primary' 
                                                title={addButtonTooltip}>
                                                    Create
                                                    <FcAddRow 
                                                        size={25} 
                                                        className='ms-2' 
                                                        role='button'/>
                                              </Button> }
                                        handleSave={handleSave}
                                        dispatch={dispatch} />                                    
                                </Col>
                                {showedList && showedList.length > 0 &&
                                    <Col className='col-8'>
                                        <Paginator 
                                            list={list}
                                            maxItemsPerPage={maxItemsPerPage}
                                            maxPage={maxPage}
                                            currentPage={currentPage}
                                            setShowedList={setShowedList}
                                            setCurrentPage={setCurrentPage} />
                                    </Col>
                                }
                            </Row>
                        </Container>
                    </div>
                }
            </main>
        </div>
    )
}

export default AdminList;