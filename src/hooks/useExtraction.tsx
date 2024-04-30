import { useContext } from 'react';
import ExtractionContext, { UseExtractionContextType } from '../context/ExtractionProvider';

const useExtraction = (): UseExtractionContextType => {
    return useContext(ExtractionContext)
}

export default useExtraction