import { useContext } from 'react';
import RepositoryContext, { UseRepositoryContextType } from '../context/RepositoryProvider'

const useRepository = (): UseRepositoryContextType => {
    return useContext(RepositoryContext)
}

export default useRepository