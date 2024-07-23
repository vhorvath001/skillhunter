import { FormEvent, ReactElement } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import SkillTreeSelectionModal from '../SkillTreeSelectionModal'
import Form from 'react-bootstrap/Form'
import useSkillTree from '../../../../hooks/useSkillTree'
import BarDiagram from './BarDiagram'
import useExtractionMap from '../../../../hooks/useExtractionMap'
import ProgLangFormRanking from '../../../admin/prog-lang/ProgLangFormRanking'
import ModalConfirmation from '../../../../utils/modal/ModalConfirmation'
import Alert from 'react-bootstrap/Alert';
import AlertMessage from '../../../../utils/AlertMessage'
import SkillTreeSelectionComponent from '../SkillTreeSelectionComponent'

const ExtractionMapDevelopersScores = (): ReactElement => {
    const { showSkillTreeSelection, selectedSkill, developersScoresColSize, handleGenerateRankingsSubmit, extraction, showSaveSuccssfulCalculateRanking, setShowSaveSuccssfulCalculateRanking, setErrorMessageCalculateRankings, errorMessageCalculateRankings } = useExtractionMap()
    const { selectedProgLang } = useSkillTree()

    const handleConfirmationQuestion = (dispatch: React.Dispatch<any> | null, handleClose: () => void, setErrorMessage: (errorMessage: string) => void, id: any): void => {
        setShowSaveSuccssfulCalculateRanking(false)
        setErrorMessageCalculateRankings('')
        const formGenerateRankings: HTMLFormElement = document.getElementById('formGenerateRankings')! as HTMLFormElement
        formGenerateRankings.requestSubmit()
        handleClose()
    }

    return (
        <>
            <Row className='mb-4'>
                <Col>
                    <SkillTreeSelectionComponent />
                </Col>
            </Row>
            <Row>
                <Col xs={developersScoresColSize}>
                    <BarDiagram />
                </Col>
                {12-developersScoresColSize > 0 &&
                    <Col xs={12-developersScoresColSize} className='p-4 mb-3 bg-light bg-gradient border'>

                        <Form.Label className='fw-bolder mb-3'>Please specify the rankings of the selected skill!</Form.Label>
                        <Form id='formGenerateRankings' onSubmit={(e: FormEvent<HTMLFormElement>) => {handleGenerateRankingsSubmit(e, setErrorMessageCalculateRankings, setShowSaveSuccssfulCalculateRanking)}}>
                            <input type='hidden' value={selectedProgLang} name='selectedProgLang' />
                            <input type='hidden' value={extraction?.id} name='extractionId' />
                            <input type='hidden' value={selectedSkill[0]} name='skillId' />

                            <ProgLangFormRanking showAttention={false} />

                            <ModalConfirmation
                                icon={<Button>Overwrite rankings</Button>} 
                                message='Are you sure to overwrite the existing rankings?'
                                id={null}
                                handleOperation={handleConfirmationQuestion}
                                dispatch={null} />
                        </Form>
                        { showSaveSuccssfulCalculateRanking &&
                            <Alert variant='success' className='mt-2'>The rankings of the selected programming language is successfully updated.</Alert>
                        }
                        { errorMessageCalculateRankings &&
                            <AlertMessage errorMessage={errorMessageCalculateRankings} />
                        }
                    </Col>
                }
            </Row>

            {showSkillTreeSelection && 
                <SkillTreeSelectionModal />
            }
        </>
    )
}

export default ExtractionMapDevelopersScores