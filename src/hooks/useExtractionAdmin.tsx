import { useContext } from 'react'
import ExtractionAdminContext, { UseExtractionAdminContextType } from '../context/ExtractionAdminProvider'

const useExtractionAdmin = (): UseExtractionAdminContextType => {
    return useContext(ExtractionAdminContext)
}

export default useExtractionAdmin