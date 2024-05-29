import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EditableList from '../../../utils/list/EditableList'
import { BsInfoSquare } from 'react-icons/bs';
import { FaStarOfLife } from 'react-icons/fa';
import { ReactElement } from 'react'
import { PackageRemovalPatternType, ProgLangType } from '../../../context/ProgLangProvider'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

type PropsType = {
    record?: ProgLangType
}

const ProgLangForm = ( { record }: PropsType ): ReactElement => {

    type SelectPropsType = {
        originalRecord: PackageRemovalPatternType,
        index: number
    }

    const PackageRemovalTypeSelect = ({ originalRecord, index }: SelectPropsType): ReactElement => {

        // for the documentation:
        // &#013;The "?<=" is the lookbehind expression, this part will not be replaced but the others (outside parenthesis) will.
        // https://stackoverflow.com/a/57450029/1269572
        return (
            <>
                <BsInfoSquare className='me-3 mb-1' size={20} title='"Removing from package": the found text will be removed from the package and the remaining part will be used.&#013;For example: in Java the package might contain the class name if the "level" property is too high: org.junit.Test -> what we need is to remove the trailing ".Test" and just use the "org.junit".&#013;The following pattern can let us do that:&#013;(?<=[a-zA-Z0-9\.]+)[\.]{1}[A-Z]{1}[a-zA-Z0-9]*$&#013;IMPORTANT! Please use lookbehind and lookahead in the regular expression! (please see the documentation for more info)&#013;&#013;"Ignoring the whole package": the package that matches the regular expression will be ignored&#013;For example in Javascript the following import refers to a local package which needs to be ignored:&#013;import GitlabAPI from "../init/gitlabAPI"&#013;=> the "../init/gitlabAPI" will be extracted as package (by the "Patterns" declaration) and the following regular expression can be used to decide if the package starts with "../" (i.e. it needs to be removed) :&#013;^[\.]{2}[\/]{1}.+'/>

                <Form.Select name={'packageRemovalPatternListItem_type_'+index} defaultValue={originalRecord?.type} className='mb-2 me-3 w-auto d-lg-inline' >
                    <option value='REMOVING_FROM_PACKAGE'>Removing from package</option>
                    <option value='IGNORING_PACKAGE'>Ignoring the whole package</option>
                </Form.Select>
            </>
        )
    }
    return (
        <>
            <input type='hidden' name='id' value={record ? record.id : '-1'} />
            <Tabs defaultActiveKey='basic' className='mb-3'>
                <Tab eventKey='basic' title='Basic'>
                    <Row>
                        <Col>
                            <Form.Group className='mb-3' controlId='name'>
                                <Form.Label className='fw-bolder'>Name</Form.Label>
                                <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                                <Form.Control 
                                    type='text' 
                                    defaultValue={record?.name}
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
                                    defaultValue={record?.sourceFiles} 
                                    required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className='mb-3' controlId='desc'>
                        <Form.Label className='fw-bolder'>Description</Form.Label>
                        <Form.Control 
                            type='text'
                            name='desc' 
                            defaultValue={record?.desc} />
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
                                    defaultValue={record?.level}
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
                                    defaultValue={record?.packageSeparator} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='mb-3' controlId='removingTLDPackages'>
                                <Form.Label className='fw-bolder'>Removing TLD-like packages?</Form.Label>
                                <BsInfoSquare className='ms-2' size={20} title="Top level domain names can occur in the package names which migt need to be removed.&#013;&#013;For example: in Java the package names can start with 'org', 'com, etc. like 'org.springframework.integration...', these package names are not skills, by checking this checkbox these packages will be removed.&#013;The full exclusion list is specified in config file. "/>
                                <Form.Check 
                                    type='checkbox'
                                    name='removingTLDPackages' 
                                    defaultChecked={record?.removingTLDPackages} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className='mb-3' controlId='patterns'>
                                <Form.Label className='fw-bolder'>Patterns</Form.Label>
                                <FaStarOfLife size={15} title='Mandatory field' className='ms-2'/>
                                <BsInfoSquare className='ms-2' size={20} title='The regular expression patterns are used to find the import statements in the code. More patterns can be specified.&#013;&#013;Please do not forget to specify capturing group in the regular expression! For example (Java import statement):&#013;import ([a-zA-Z0-9\.]+);&#013;&#013;You can set where the pattern will be looked for:&#013; * only the first occurence (it means that the source file will be examined from the beginning, when the pattern is found first then only those lines are used from that point which match the pattern, if a not matching line is found then will ignore the rest of the file -> in Java usually the first line is the package declaration which will be ignored then the package declaration is followed by the import statemements which will be used and after the import lines the rest of the class fill will be ignored)&#013; * everywhere in the file.'/>
                                <Form.Select className='w-auto mb-2' name='scope' defaultValue={record?.scope}>
                                    <option value='FIRST_OCCURRENCE'>First Occurence</option>
                                    <option value='EVERYWHERE'>Everywhere</option>
                                </Form.Select>
                                <EditableList 
                                    list={record?.patterns} 
                                    required={true} 
                                    inputName='patternListItem_' />
                            </Form.Group>                
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey='PackageRemovalPatterns' title='Package removal patterns'>
                    <Row>
                        <Col>
                            <Form.Group className='mb-3' controlId='packageRemovalPatterns'>
                                <Form.Label className='fw-bolder'>Package removal patterns</Form.Label>
                                <BsInfoSquare className='ms-2' size={20} title='After the package has been extracted from the import statement (see the Patterns property) additional alteration can be performed on the package (remove specific parts or just ignore the whole package).&#013;Only one pattern will be applied and the order is important (i.e. the first matching pattern will be used)!&#013;Please find more at the checkbox below.'/>
                                <EditableList 
                                    list={record?.packageRemovalPatterns.map(p => p.value)} originalList={record?.packageRemovalPatterns} 
                                    required={false} 
                                    inputName='packageRemovalPatternListItem_value_' 
                                    beforeTextField={(originalRecord: any, index: number) => (
                                        <PackageRemovalTypeSelect originalRecord={originalRecord} index={index} />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey='IgnoringLinesPatterns' title='Patterns to ignore lines'>
                    <Row>
                        <Col>
                            <Form.Group className='mb-3' controlId='ignoringLinesPatterns'>
                                <Form.Label className='fw-bolder'>Patterns to ignore lines</Form.Label>
                                <BsInfoSquare className='ms-2' size={20} title="During the extraction the commits of the selected branch are retrieved. Along with the commits the diffs (code lines that were changed) are queried too. With the 'Patterns to ignore lines' patterns you can ignore changed code lines so they will not be taken account in the extraction.&#013;For example the diff returns something like:&#013;&#013;-private int i = 0;&#013;+//public int i = 0;&#013;&#013;(The line starting with '-' represents the line before the change, the '+' shows what it was altered to. The '-' and '+' characters do not have to be put to the reg exp, they will be automatically removed in the extraction.)&#013;If you specify a pattern for the lines starting with '//' (the line is commented out) to be removed then they won't be calculted in to the score.&#013;If the '+' line would be something like&#013;&#013;+;&#013;&#013;then you could add the pattern&#013;^(?![\s\S]*.*([a-zA-Z0-9]){2}.*)[\s\S]*$&#013;(i.e. the line has to contain at least 2 consecutive alphanumeric characters) so this change will be ignored too.&#013;The pattern will be applied to the '+' line(s) only.&#013;With these patterns you can make sure that the code lines will be skipped which might distort the calculated score of the changed code (how much the developer changed the code in the specific commit)."/>
                                <EditableList 
                                    list={record?.ignoringLinesPatterns} 
                                    required={false} 
                                    inputName='ignoringLinesPatternListItem_' />
                            </Form.Group>
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </>        
    )
}

export default ProgLangForm;