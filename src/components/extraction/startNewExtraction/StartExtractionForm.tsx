import { ReactElement } from 'react';
import StartExtraction1stPage from './StartExtraction1stPage';
import StartExtraction2ndPage from './StartExtraction2ndPage';
import { ProjectsBranchesType } from '../../../context/AppTypes';
import useExtractionStartNew from '../../../hooks/useExtractionStartNew';

type PropsType = {
    projectsBranchesData: ProjectsBranchesType[],
}

const StartExtractionForm = ({ projectsBranchesData }: PropsType): ReactElement => {
    const { show2ndPage } = useExtractionStartNew()

    return (
        <>
            <span style={{display: (!show2ndPage) ? 'block' : 'none'}}>
                <StartExtraction1stPage />
            </span>
            { show2ndPage &&
                <StartExtraction2ndPage projectsBranchesData={projectsBranchesData} />
            }
        </>
    )
}

export default StartExtractionForm