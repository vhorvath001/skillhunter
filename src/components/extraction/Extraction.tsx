import { ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import StartExtractionModal from './startNewExtraction/StartExtractionModal'
import ExtractionFilter from './ExtractionFilter'
import ExtractionCards from './ExtractionCards'
import Loading from '../../utils/Loading'
import useExtractionAdmin from '../../hooks/useExtractionAdmin'
import useExtractionStartNew from '../../hooks/useExtractionStartNew'

const Extraction = (): ReactElement => {
    const { areExtractionsLoading  } = useExtractionAdmin()
    const { setShowStartExtraction  } = useExtractionStartNew()

    return (
        <div className='extraction-container'>
            <div className='page-title text-center mb-5'>Extractions</div>
            
            <div>
                <span onClick={() => setShowStartExtraction(true)} className='me-1' data-testid='t-modal-show'>
                    <Button variant='primary'>Start new extraction</Button>
                </span>
                <StartExtractionModal />
            </div>
            
            <hr></hr>

            <ExtractionFilter />

            <div className='loadingParent container-fluid'>
                {areExtractionsLoading && <Loading message='Loading the Extraction cards.' />}
                {!areExtractionsLoading && <ExtractionCards />}
            </div>
        </div>
    )
}

export default Extraction