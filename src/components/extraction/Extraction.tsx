import { ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import useExtraction from '../../hooks/useExtraction'
import StartExtractionModal from './StartExtractionModal'
import ExtractionFilter from './ExtractionFilter'
import ExtractionCards from './ExtractionCards'
import Loading from '../../utils/Loading'

const Extraction = (): ReactElement => {
    const { setShowStartExtraction, areExtractionsLoading  } = useExtraction()

    return (
        <div className='extraction-container'>
            <div className='page-title text-center mb-5'>Extraction</div>
            
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