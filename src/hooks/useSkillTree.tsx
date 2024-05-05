import { useContext } from 'react';
import SkillTreeContext, { UseSkillTreeContextType } from '../context/SkillTreeProvider';

const useSkillTree = (): UseSkillTreeContextType => {
    return useContext(SkillTreeContext)
}

export default useSkillTree