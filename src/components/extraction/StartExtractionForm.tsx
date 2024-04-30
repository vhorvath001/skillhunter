import { ReactElement } from 'react';
import StartExtraction1stPage from './StartExtraction1stPage';
import StartExtraction2ndPage from './StartExtraction2ndPage';
import { ProjectsBranchesType } from '../../context/ExtractionProvider';
import useExtraction from '../../hooks/useExtraction';

type PropsType = {
    projectBranchesData: ProjectsBranchesType[],
}

const StartExtractionForm = ({ projectBranchesData }: PropsType): ReactElement => {
    const {show2ndPage } = useExtraction()

    return (
        <>
            <span style={{display: (!show2ndPage) ? 'block' : 'none'}}>
                <StartExtraction1stPage />
            </span>
            { show2ndPage &&
                <StartExtraction2ndPage projectBranchesData={projectBranchesData} />
            }
        </>
    )
}

export default StartExtractionForm