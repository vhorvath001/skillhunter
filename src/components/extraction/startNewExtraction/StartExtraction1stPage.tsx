import { ChangeEvent, ReactElement } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import MultiSelectDropdown from './MultiSelectDropdown'
import Loading from '../../../utils/Loading'
import useExtractionStartNew from '../../../hooks/useExtractionStartNew';

const StartExtraction1stPage = (): ReactElement => {
    const { repositoryOptions, setPathTextfield, progLangOptions, setSelectedProgLangs, pathTextfield, selectedProgLangs, setRepoId, isLoading } = useExtractionStartNew()

    const changeRepositoryOptions = (e: ChangeEvent<HTMLSelectElement>) => {
        setRepoId(Number(e.target.value))
    }

    const repoSelectInitValue: string | null = (document.getElementById('s_repo') as HTMLSelectElement)?.value
    setRepoId(Number(repoSelectInitValue ?? '-13'))

    return (
        <>
            <Form.Group as={Row} className='mb-3' controlId='repository'>
                <Form.Label column sm='2'>Repository</Form.Label>
                <Col>
                    <div className='loadingParent'>
                        {isLoading && <Loading message='Loading the repositories.' />}
                        {!isLoading && 
                            <Form.Select name='repository' onChange={changeRepositoryOptions} id='s_repo'>
                                {repositoryOptions.map(ro => (
                                    <option key={ro.key} value={ro.key}>
                                        {ro.value}
                                    </option>
                                ))}
                            </Form.Select>                
                        }
                    </div>
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