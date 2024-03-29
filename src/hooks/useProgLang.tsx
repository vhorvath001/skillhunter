import { useContext } from 'react';
import ProgLangContext, { UseProgLangContextType } from '../context/ProgLangProvider';

const useProgLang = (): UseProgLangContextType => {
    return useContext(ProgLangContext)
}

export default useProgLang