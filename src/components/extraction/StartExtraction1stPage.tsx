import { ReactElement } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import MultiSelectDropdown from './MultiSelectDropdown';
import useExtraction from '../../hooks/useExtraction';

const StartExtraction1stPage = (): ReactElement => {
    const { repositoryOptions, setPathTextfield, progLangOptions, setSelectedProgLangs, pathTextfield, selectedProgLangs } = useExtraction()

    return (
        <>
            <Form.Group as={Row} className='mb-3' controlId='repository'>
                <Form.Label column sm='2'>Repository</Form.Label>
                <Col>
                    <Form.Select name='repository'>
                        {repositoryOptions.map(ro => (
                            <option key={ro.key} value={ro.key}>
                                {ro.value}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className='mb-3' controlId='progLang'>
                <Form.Label column sm='2'>Programming languages</Form.Label>
                <Col>
                    <MultiSelectDropdown 
                        options={progLangOptions} 
                        selectedOptions={selectedProgLangs}
                        setSelectedOptions={setSelectedProgLangs} />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className='mb-3' controlId='path'>
                <Form.Label column sm='2'>Path</Form.Label>
                <Col>
                    <Form.Control name='path' type='text' value={pathTextfield} onChange={e => setPathTextfield(e.target.value)}/>
                </Col>
            </Form.Group>
        </>
    )
}

export default StartExtraction1stPage