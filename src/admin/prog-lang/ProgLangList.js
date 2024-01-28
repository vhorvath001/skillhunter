import { useEffect, useState } from 'react';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import ProgLangListHeader from './ProgLangListHeader';
import ProgLangRow from './ProgLangRow';
import ProgLangForm from './ProgLangForm';
import { FcAddRow } from 'react-icons/fc';
import ModalForm from '../../utils/modal/ModalForm';
import axios from 'axios';
import { client } from '../../api/client';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Paginator from '../../utils/Paginator';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ProgLangList = () => {
    const newProgLangFormId = 'newProgLangForm';
    const resourceName = '/prog-langs';
    const maxItemsPerPage = 4;

    const [ progLangs, setProgLangs ] = useState([]);
    const [ showedProgLangs, setShowedProgLangs] = useState([]);
    
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ maxPage, setMaxPage ] = useState(0);

    const { data, isLoading, fetchError } = useAxiosFetch(resourceName);

    useEffect(() => {
        setProgLangs(sortProgLangs(data));
        setShowedProgLangs(data.slice(0,maxItemsPerPage));
    }, [data]);

    useEffect(() => {
        setMaxPage(progLangs.length % maxItemsPerPage === 0 ? 
            Math.floor(progLangs.length / maxItemsPerPage) : 
            Math.floor(progLangs.length / maxItemsPerPage) + 1);
    }, [progLangs]);

    const sortProgLangs = (l) => {
        l.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 
                        a.name.toLowerCase() === b.name.toLowerCase() ? 0 : -1);
        return l;
    }

    const handleSave = async (e, handleClose, setErrorMessage) => {
        e.preventDefault();
        const formData = new FormData(document.getElementById(newProgLangFormId));
        const formDataObj = Object.fromEntries(formData.entries());
        let verb = 'PUT';
        if (formDataObj.id == '-1') {
            verb = 'POST';
            formDataObj.id = '';
        }
        let patterns = [];
        Object.entries(formDataObj).map(([key,value]) => {
            if (key.startsWith('patternListItem_')) {
                if (value) {
                    patterns.push(value);
                }
                delete formDataObj[key];
            }
        });
        formDataObj.pattern = JSON.stringify({'patternList': patterns});
        try {
            const resp = await axios({
                method: verb, 
                url: client.defaults.baseURL + resourceName + (verb == 'PUT' ? `/${formDataObj.id}` : ''), 
                data: formDataObj 
            });
            if (verb === 'POST') {
                setProgLangs( sortProgLangs([...progLangs, resp.data]) );
            } else {
                setProgLangs( sortProgLangs(progLangs.map((progLang) => progLang.id == resp.data.id ? resp.data : progLang)) );
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
            setProgLangs( sortProgLangs(progLangs.filter((progLang) => progLang.id !== id)) );
            handleClose()
        } catch(err) {
            setErrorMessage(err.message);
            console.error(err);
        }
    }

    return (
        <div className='adminContainer'>
            <div className='adminTitle text-center mb-5 fs-3'>List of Programming Languages</div>
            <main>
                { isLoading && 
                    <p>List is loading...</p> }
                { !isLoading && fetchError && 
                    <div className='col-6 mx-auto'>
                        <Alert key='danger' variant='danger' className='justify-content-center'>
                            {fetchError}
                        </Alert>
                    </div>}
                { !isLoading && !fetchError && 
                    <div className='col-6 mx-auto'>
                        <Table striped bordered hover>
                            <ProgLangListHeader />
                            <tbody>
                                {showedProgLangs.map((progLang) => (
                                    <ProgLangRow 
                                        key={progLang.id} 
                                        record={progLang} 
                                        formId={newProgLangFormId}
                                        handleSave={handleSave}
                                        handleDelete={handleDelete} />
                                ))}
                            </tbody>
                        </Table>
                        <Container>
                            <Row>
                                <Col className='col-4'>
                                    <ModalForm 
                                        body={ <ProgLangForm formId={newProgLangFormId} /> } 
                                        title='Add a new Programming Language' 
                                        icon={ <Button variant="outline-primary">
                                                    Create
                                                    <FcAddRow size={25} className='ms-2' role='button'/>
                                              </Button> }
                                        handleSave={handleSave} />                                    
                                </Col>
                                <Col className='col-8'>
                                    <Paginator 
                                        list={progLangs}
                                        maxItemsPerPage={maxItemsPerPage}
                                        maxPage={maxPage}
                                        currentPage={currentPage}
                                        setShowedList={setShowedProgLangs}
                                        setCurrentPage={setCurrentPage} />
                                </Col>
                            </Row>
                        </Container>
                    </div>
                }
            </main>
        </div>
    )
}

export default ProgLangList;