import { ReactElement } from 'react'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import ProgLangFormBasic from './ProgLangFormBasic'
import ProgLangFormPackageRemoval from './ProgLangFormPackageRemoval'
import ProgLangFormIgnoringLines from './ProgLangFormIgnoringLines'
import ProgLangFormRanking from './ProgLangFormRanking'
import { ProgLangType } from '../../../context/AppTypes'

type PropsType = {
    record?: ProgLangType
}
const ProgLangForm = ( { record }: PropsType ): ReactElement => {

    return (
        <>
            <input type='hidden' name='id' value={record ? record.id : '-1'} />
            <Tabs defaultActiveKey='basic' className='mb-3'>
                <Tab eventKey='basic' title='Basic'>
                    <ProgLangFormBasic record={record} />
                </Tab>
                <Tab eventKey='PackageRemovalPatterns' title='Package removal patterns'>
                    <ProgLangFormPackageRemoval record={record} />
                </Tab>
                <Tab eventKey='IgnoringLinesPatterns' title='Patterns to ignore lines'>
                    <ProgLangFormIgnoringLines record={record} />
                </Tab>
                <Tab eventKey='Ranking' title='Ranking'>
                    <ProgLangFormRanking record={record} />
                </Tab>
            </Tabs>
        </> 
    )
}

export default ProgLangForm;