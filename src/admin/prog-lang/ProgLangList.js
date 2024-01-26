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

const ProgLangList = () => {
    const newProgLangFormId = 'newProgLangForm';
    const resourceName = '/prog-langs';
    const [ progLangs, setProgLangs ] = useState([]);
    const { data, isLoading, fetchError } = useAxiosFetch(resourceName);

    useEffect(() => {
        setProgLangs(data);
    }, [data]);

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
        console.log(formDataObj);
        try {
            const resp = await axios({
                method: verb, 
                url: client.defaults.baseURL + resourceName + (verb == 'PUT' ? `/${formDataObj.id}` : ''), 
                data: formDataObj 
            });
            if (verb === 'POST') {
                setProgLangs([...progLangs, resp.data]);
            } else {
                setProgLangs(progLangs.map((progLang) => progLang.id == resp.data.id ? resp.data : progLang));
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
            setProgLangs(progLangs.filter((progLang) => progLang.id !== id));
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
                                {progLangs.map((progLang) => (
                                    <ProgLangRow 
                                        key={progLang.id} 
                                        record={progLang} 
                                        formId={newProgLangFormId}
                                        handleSave={handleSave}
                                        handleDelete={handleDelete} />
                                ))}
                            </tbody>
                        </Table>
                        <ModalForm 
                            body={ <ProgLangForm formId={newProgLangFormId} /> } 
                            title='Add a new Programming Language' 
                            icon={ <Button variant="outline-primary">
                                        Create
                                        <FcAddRow size={25} className='ms-2' role='button'/>
                                   </Button> }
                            handleSave={handleSave} />
                    </div>
                }
            </main>
        </div>
    )
}

export default ProgLangList;