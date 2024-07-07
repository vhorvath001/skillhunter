import { useContext } from 'react';
import ExtractionStartNewContext, { UseExtractionStartNewContextType } from '../context/ExtractionStartNewProvider';

const useExtractionStartNew = (): UseExtractionStartNewContextType => {
    return useContext(ExtractionStartNewContext)
}

export default useExtractionStartNew