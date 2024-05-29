import { useContext } from 'react';
import DeveloperContext, { UseDeveloperContextType } from '../context/DeveloperProvider';

const useDeveloper = (): UseDeveloperContextType => {
    return useContext(DeveloperContext)
}

export default useDeveloper