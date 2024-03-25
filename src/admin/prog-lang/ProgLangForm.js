import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EditableList from '../../utils/list/EditableList';
import { BsInfoSquare } from 'react-icons/bs';
import { FaStarOfLife } from 'react-icons/fa';

const ProgLangForm = ( { record } ) => {
    const patternList = record && record.pattern ? JSON.parse(record.pattern).patternList : [''];
    
    return (
        <>
            <input type='hidden' name='id' value={record ? record.id : '-1'} />
            <Row>
                <Col>
                    <Form.Group className='mb-3' controlId='name'>
                        <Form.Label className='fw-bolder'>Name</Form.Label>
                        <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                        <Form.Control 
                            type='text' 
                            defaultValue={record ? record.name : ''}
                            name='name'
                            required
                            autoFocus />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className='mb-3' controlId='sourceFiles'>
                        <Form.Label className='fw-bolder'>Source files</Form.Label>
                        <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                        <BsInfoSquare className='ms-2' size={20} title='Patterns of the source file names can be specified which are belong to the programming language. 
                        Only these files will be examined for this programming language. More file name patterns can be defined separated by comma. For example: *.js, *.java, bu*.gr* '/>
                        <Form.Control 
                            type='text'
                            name='sourceFiles'
                            defaultValue={record ? record.sourceFiles : ''} 
                            required />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className='mb-3' controlId='desc'>
                <Form.Label className='fw-bolder'>Description</Form.Label>
                <Form.Control 
                    type='text'
                    name='desc' 
                    defaultValue={record ? record.desc : ''} />
            </Form.Group>
            <Row>
                <Col>
                    <Form.Group className='mb-3' controlId='level'>
                        <Form.Label className='fw-bolder'>Level</Form.Label>
                        <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                        <BsInfoSquare className='ms-2' size={20} title='It specifies how many package levels should be included. It has to be a number.'/>
                        <Form.Control 
                            type='number'
                            name='level'
                            defaultValue={record ? record.level : ''}
                            required />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className='mb-3' controlId='packageSeparator'>
                        <Form.Label className='fw-bolder'>Package separator</Form.Label>
                        <BsInfoSquare className='ms-2' size={20} title="The character can be set which separates the packages in import statement (for example in Java it will be '.' -> com.acme.utitls, in Go it is '/' -> crypto/rand, etc)."/>
                        <Form.Control 
                            type='text'
                            name='packageSeparator'
                            defaultValue={record ? record.packageSeparator : ''} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className='mb-3' controlId='removingTLDPackages'>
                        <Form.Label className='fw-bolder'>Removing TLD-like packages?</Form.Label>
                        <BsInfoSquare className='ms-2' size={20} title="Top level domain names can occur in the package names which migt need to be removed.&#013;&#013;For example: in Java the package names can start with 'org', 'com, etc. like 'org.springframework.integration...', these package names are not skills, by checking this checkbox these packages will be removed.&#013;The full exclusion list is specified in config file. "/>
                        <Form.Check 
                            type='checkbox'
                            name='removingTLDPackages' 
                            defaultChecked={record && record.removingTLDPackages === 'on' ? true : false } />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className='mb-3' controlId='patterns'>
                <Form.Label className='fw-bolder'>Patterns</Form.Label>
                <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                <BsInfoSquare className='ms-2' size={20} title='The regular expression patterns are used to find the import statements in the code. More patterns can be specified.&#013;&#013;Please do not forget to specify capturing group in the regular expression! For example (Java import statement):&#013;import ([a-z0-9\.]+);&#013;&#013;You can set where the pattern will be looked for:&#013; * only the first occurence (it means that the source file will be examined from the beginning, when the pattern is found first then only those lines are used from that point which match the pattern, if a not matching line is found then will ignore the rest of the file -> in Java usually the first line is the package declaration which will be ignored then the package declaration is followed by the import statemements which will be used and after the import lines the rest of the class fill will be ignored)&#013; * everywhere in the file.'/>
                <Form.Select className='mb-2' name='scope' defaultValue={record.scope}>
                    <option value='FIRST_OCCURRENCE'>First Occurence</option>
                    <option value='EVERYWHERE'>Everywhere</option>
                </Form.Select>
                <EditableList list={patternList} required={true} />
            </Form.Group>
        </>        
    )
}

export default ProgLangForm;