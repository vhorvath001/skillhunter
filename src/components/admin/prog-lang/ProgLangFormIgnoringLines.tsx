import { ReactElement } from 'react'
import { ProgLangType } from '../../../context/ProgLangProvider'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsInfoSquare } from 'react-icons/bs'
import EditableList from '../../../utils/list/EditableList'

type PropsType = {
    record?: ProgLangType
}

const ProgLangFormIgnoringLines = ({ record }: PropsType): ReactElement => {
    return (
        <>
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
        </>
    )
}

export default ProgLangFormIgnoringLines