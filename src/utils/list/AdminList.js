import { useEffect, useState } from 'react';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { FcAddRow } from 'react-icons/fc';
import ModalForm from '../../utils/modal/ModalForm';
import axios from 'axios';
import { client } from '../../api/client';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Paginator from '../../utils/Paginator';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AlertMessage from '../../utils/AlertMessage';

const AdminList = ( { resourceName, maxItemsPerPage, title, listHeaderEl, renderListRowEl, formEl, newFormTitleAdd, addButtonTooltip, addToObjectToBeSaved } ) => {
    const newFormId = 'newForm';

    const [ list, setList ] = useState([]);
    const [ showedList, setShowedList ] = useState([]);
    
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ maxPage, setMaxPage ] = useState(0);

    const { data, isLoading, fetchError } = useAxiosFetch(resourceName);

    useEffect(() => {
        setList(sortList(data));
        setShowedList( data.slice(0, maxItemsPerPage) );
    }, [data]);

    useEffect(() => {
        setMaxPage(list.length % maxItemsPerPage === 0 ? 
            Math.floor(list.length / maxItemsPerPage) : 
            Math.floor(list.length / maxItemsPerPage) + 1);
        setShowedList(list.slice( (currentPage-1) * maxItemsPerPage, (currentPage) * maxItemsPerPage ));
    }, [list]);

    const sortList = (l) => {
        l.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 
                        a.name.toLowerCase() === b.name.toLowerCase() ? 0 : -1);
        return l;
    }

    const handleSave = async (e, handleClose, setErrorMessage) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formDataObj = Object.fromEntries(formData.entries());
        let verb = 'PUT';
        if (formDataObj.id == '-1') {
            verb = 'POST';
            formDataObj.id = '';
        }
        if (addToObjectToBeSaved) 
            addToObjectToBeSaved(formDataObj);
        try {
            const resp = await axios({
                method: verb, 
                url: client.defaults.baseURL + resourceName + (verb == 'PUT' ? `/${formDataObj.id}` : ''), 
                data: formDataObj 
            });
            if (verb === 'POST') {
                setList( sortList([...list, resp.data]) );
            } else {
                setList( sortList(list.map((i) => i.id == resp.data.id ? resp.data : i)) );
            }
            handleClose();
        } catch (err) {
            setErrorMessage(err.message);
            console.error(err);
        }
    }

    const handleDelete = async (e, handleClose, setErrorMessage, id) => {
        try {
            await axios({
                method: 'DELETE',
                url: client.defaults.baseURL + resourceName + `/${id}` 
            });
            setList( list.filter((i) => i.id !== id) );
            handleClose();
        } catch(err) {
            setErrorMessage(err.message);
            console.error(err);
        }
    }

    return (
        <div className='admin-container'>
            <div className='adminTitle text-center mb-5 fs-3'>{title}</div>
            <main>
                { isLoading && 
                    <p>List is loading...</p> 
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
                                                variant='outline-primary' 
                                                title={addButtonTooltip}>
                                                    Create
                                                    <FcAddRow 
                                                        size={25} 
                                                        className='ms-2' 
                                                        role='button'/>
                                              </Button> }
                                        handleSave={handleSave} />                                    
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