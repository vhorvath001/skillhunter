import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import Extraction from './Extraction'
import { initState } from '../../context/ExtractionProvider'
import * as ExtractionCards from './ExtractionCards';
import * as UseExtraction from '../../hooks/useExtraction';

vi.mock('./ExtractionCards')

test('check if Loading appears', () => {
    vi
      .spyOn(UseExtraction, 'default')
      .mockImplementation(() => { return {
        ...initState,
        setShowStartExtraction: () => {},
        areExtractionsLoading: true
    }})

    render( <Extraction /> )

    expect(screen.queryByText(/Loading the Extraction cards/i)).toBeInTheDocument()
})

test('check if ExtractionCards appears but Loading does not', () => {
    vi.spyOn(UseExtraction, 'default')
      .mockImplementation(() => { return {
        ...initState,
        setShowStartExtraction: () => {},
        areExtractionsLoading: false
    }})

    vi.spyOn(ExtractionCards, 'default').mockImplementation(() => <div data-testid="ExtractionCards"/>) 

    render( <Extraction /> )

    screen.debug()
    expect(screen.queryByTestId('ExtractionCards')).toBeInTheDocument()
    expect(screen.queryByText(/Loading the Extraction cards/i)).not.toBeInTheDocument()
})