import { useContext } from 'react';
import ExtractionMapContext, { UseExtractionMapContextType } from '../context/ExtractionMapProvider';

const useExtractionMap = (): UseExtractionMapContextType => {
    return useContext(ExtractionMapContext)
}

export default useExtractionMap