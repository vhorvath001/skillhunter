import { render, screen } from '@testing-library/react'
import * as UseExtraction from '../../../hooks/useExtraction'
import StartExtractionForm from './StartExtractionForm'
import * as StartExtraction1stPage from './StartExtraction1stPage'
import * as StartExtraction2ndPage from './StartExtraction2ndPage'
import { initState } from '../../../context/ExtractionProvider'

vi.mock('./StartExtraction1stPage')
vi.mock('./StartExtraction2ndPage')

test('show 1st page', () => {
    vi
        .spyOn(UseExtraction, 'default')
        .mockImplementation(() => { return {
            ...initState,
            show2ndPage: false
        }})

    vi
        .spyOn(StartExtraction1stPage, 'default')
        .mockImplementation(() => <div data-testid='StartExtraction1stPage' />)
    vi
        .spyOn(StartExtraction2ndPage, 'default')
        .mockImplementation(() => <div data-testid='StartExtraction2ndPage' />)

    render(
        <StartExtractionForm projectsBranchesData={[]} />
    )

    expect(screen.queryByTestId('StartExtraction1stPage')?.closest('span')).toHaveStyle('display: block;')
    expect(screen.queryByTestId('StartExtraction2ndPage')).not.toBeInTheDocument()
})

test('show 2nd page', () => {
    vi
        .spyOn(UseExtraction, 'default')
        .mockImplementation(() => { return {
            ...initState,
            show2ndPage: true
        }})

    vi
        .spyOn(StartExtraction1stPage, 'default')
        .mockImplementation(() => <div data-testid='StartExtraction1stPage' />)
    vi
        .spyOn(StartExtraction2ndPage, 'default')
        .mockImplementation(() => <div data-testid='StartExtraction2ndPage' />)

    render(
        <StartExtractionForm projectsBranchesData={[]} />
    )

    screen.debug()
    expect(screen.queryByTestId('StartExtraction1stPage')?.closest('span')).toHaveStyle('display: none;')
    expect(screen.queryByTestId('StartExtraction2ndPage')).toBeInTheDocument()
})