import { PackageRemovalPatternType, ProgLangType } from '../../../context/ProgLangProvider'
import { ReactElement } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { BsInfoSquare } from 'react-icons/bs'
import EditableList from '../../../utils/list/EditableList'

type PropsType = {
    record?: ProgLangType
}

const ProgLangFormPackageRemoval = ({ record }: PropsType): ReactElement => {

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
                            beforeTextFieldWidth={3}
                        />
                    </Form.Group>
                </Col>
            </Row>
        </>
    )
}

export default ProgLangFormPackageRemoval