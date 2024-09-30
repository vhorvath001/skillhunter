import { ReactElement } from 'react'
import Button from 'react-bootstrap/Button'
import StartExtractionModal from './startNewExtraction/StartExtractionModal'
import ExtractionFilter from './ExtractionFilter'
import ExtractionCards from './ExtractionCards'
import Loading from '../../utils/Loading'
import useExtractionAdmin from '../../hooks/useExtractionAdmin'
import useExtractionStartNew from '../../hooks/useExtractionStartNew'
import Accordion from 'react-bootstrap/Accordion'
import Alert from 'react-bootstrap/Alert'

const Extraction = (): ReactElement => {
    const { areExtractionsLoading, state, fetchFavouritesErrorMessage, areFavouriteExtractionsLoading  } = useExtractionAdmin()
    const { setShowStartExtraction  } = useExtractionStartNew()

    return (
        <div className='extraction-container'>
            <div className='page-title text-center mb-3'>Extractions</div>
            
            <div>
                <span onClick={() => setShowStartExtraction(true)} className='me-1' data-testid='t-modal-show'>
                    <Button variant='primary'>Start new extraction</Button>
                </span>
                <StartExtractionModal />
            </div>
            
            <hr></hr>

            <Accordion defaultActiveKey='0' flush alwaysOpen>
                <Accordion.Item eventKey='0'>
                    <Accordion.Header>Favourites</Accordion.Header>
                    <Accordion.Body>
                        <div className='loadingParent container-fluid mt-3'>
                            { areFavouriteExtractionsLoading && 
                                <Loading message='Loading the favourite Extraction cards.' /> 
                            }
                            {!areFavouriteExtractionsLoading && !fetchFavouritesErrorMessage && 
                                <ExtractionCards list={state.favouriteList} />
                            }
                            {!areFavouriteExtractionsLoading && fetchFavouritesErrorMessage && 
                                <Alert key='danger' variant='danger'>
                                    {fetchFavouritesErrorMessage}
                                </Alert>
                            }
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey='1'>
                    <Accordion.Header>Search for Extractions</Accordion.Header>
                    <Accordion.Body>
                        <ExtractionFilter />

                        <div className='loadingParent container-fluid mt-3'>
                            {areExtractionsLoading && <Loading message='Loading the Extraction cards.' />}
                            {!areExtractionsLoading && <ExtractionCards list={state.list} />}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export default Extraction