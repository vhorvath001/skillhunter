import { ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import useSkillTree from '../../../hooks/useSkillTree'
import Form from 'react-bootstrap/Form'
import SkillTreeSelectionModal from './SkillTreeSelectionModal'

type PropsType = {
    selectedSkill: string[],
    setSelectedSkill: (s: string[]) => void,
    showSkillTreeSelection: boolean, 
    setShowSkillTreeSelection: (b: boolean) => void
}

const SkillTreeSelectionComponent = ({ selectedSkill, setSelectedSkill, showSkillTreeSelection, setShowSkillTreeSelection }: PropsType): ReactElement => {
    const { state, setTreeOperationErrorMessage, setSelectedProgLang } = useSkillTree()

    const handleShowSkillTreeSelection = (): void => {
        setShowSkillTreeSelection(true)
        setSelectedSkill([])
        state.skillTree = []
        setTreeOperationErrorMessage('')
        setSelectedProgLang(-1)
    }

    return (
        <>
            <Button onClick={handleShowSkillTreeSelection} className='ms-5'>Choose a skill</Button>
            {selectedSkill.length > 0 &&
                <>
                    <Form.Label className='ms-4 me-2 fw-bolder'>The selected skill:</Form.Label>
                    {selectedSkill[1]}
                </>
            }
            {showSkillTreeSelection && 
                <SkillTreeSelectionModal 
                    showSkillTreeSelection={showSkillTreeSelection}
                    setShowSkillTreeSelection={setShowSkillTreeSelection}
                    setSelectedSkill={setSelectedSkill} />
            }        
        </>
    )
}

export default SkillTreeSelectionComponent