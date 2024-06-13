import { render, screen } from '@testing-library/react'
import ExtractionFilter from './ExtractionFilter'
import userEvent from '@testing-library/user-event'
import * as UseExtraction from '../../hooks/useExtraction'
import { initState } from '../../context/ExtractionProvider'
import { Mock } from 'vitest'

let mockedSetFilterDateFrom: Mock
let mockedSetFilterDateTo: Mock

beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(1717668252139) // it's 2024-06-06

    mockedSetFilterDateFrom = vi.fn()
    mockedSetFilterDateTo = vi.fn()

    vi
        .spyOn(UseExtraction, 'default')
        .mockImplementation(() => { return {
            ...initState,
            setFilterDateFrom: mockedSetFilterDateFrom,
            setFilterDateTo: mockedSetFilterDateTo
        }})
})

afterEach(() => {
    vi.clearAllMocks()
})

describe('testing changeFilterDateFromTo()', () => {

    test('check if YESTERDAY is set properly', async () => {
        render( <ExtractionFilter/> )

        await userEvent.selectOptions(screen.queryByTestId('sFilterDateType')!, 'YESTERDAY')

        expect(mockedSetFilterDateFrom).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateFrom).toHaveBeenCalledWith('2024-06-05T00:00:00')

        expect(mockedSetFilterDateTo).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateTo).toHaveBeenCalledWith('2024-06-05T23:59:59')
    })

    test('check if THIS_WEEK is set properly', async () => {
        render( <ExtractionFilter/> )

        await userEvent.selectOptions(screen.queryByTestId('sFilterDateType')!, 'THIS_WEEK')

        expect(mockedSetFilterDateFrom).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateFrom).toHaveBeenCalledWith('2024-06-03T00:00:00')

        expect(mockedSetFilterDateTo).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateTo).toHaveBeenCalledWith('2024-06-06T23:59:59')
    })

    test('check if LAST_WEEK is set properly', async () => {
        render( <ExtractionFilter/> )

        await userEvent.selectOptions(screen.queryByTestId('sFilterDateType')!, 'LAST_WEEK')

        expect(mockedSetFilterDateFrom).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateFrom).toHaveBeenCalledWith('2024-05-27T00:00:00')

        expect(mockedSetFilterDateTo).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateTo).toHaveBeenCalledWith('2024-06-02T23:59:59')
    })

    test('check if THIS_MONTH is set properly', async () => {
        render( <ExtractionFilter/> )

        await userEvent.selectOptions(screen.queryByTestId('sFilterDateType')!, 'THIS_MONTH')

        expect(mockedSetFilterDateFrom).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateFrom).toHaveBeenCalledWith('2024-06-01T00:00:00')

        expect(mockedSetFilterDateTo).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateTo).toHaveBeenCalledWith('2024-06-06T23:59:59')
    })

    test('check if LAST_MONTH is set properly', async () => {
        render( <ExtractionFilter/> )

        await userEvent.selectOptions(screen.queryByTestId('sFilterDateType')!, 'LAST_MONTH')

        expect(mockedSetFilterDateFrom).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateFrom).toHaveBeenCalledWith('2024-05-01T00:00:00')

        expect(mockedSetFilterDateTo).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateTo).toHaveBeenCalledWith('2024-05-31T23:59:59')
    })

    test('check if THIS_YEAR is set properly', async () => {
        render( <ExtractionFilter/> )

        await userEvent.selectOptions(screen.queryByTestId('sFilterDateType')!, 'THIS_YEAR')

        expect(mockedSetFilterDateFrom).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateFrom).toHaveBeenCalledWith('2024-01-01T00:00:00')

        expect(mockedSetFilterDateTo).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateTo).toHaveBeenCalledWith('2024-06-06T23:59:59')
    })

    test('check if LAST_YEAR is set properly', async () => {
        render( <ExtractionFilter/> )

        await userEvent.selectOptions(screen.queryByTestId('sFilterDateType')!, 'LAST_YEAR')

        expect(mockedSetFilterDateFrom).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateFrom).toHaveBeenCalledWith('2023-01-01T00:00:00')

        expect(mockedSetFilterDateTo).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateTo).toHaveBeenCalledWith('2023-12-31T23:59:59')
    })

    test('check if LAST_7_DAYS is set properly', async () => {
        render( <ExtractionFilter/> )

        await userEvent.selectOptions(screen.queryByTestId('sFilterDateType')!, 'LAST_7_DAYS')

        expect(mockedSetFilterDateFrom).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateFrom).toHaveBeenCalledWith('2024-05-31T00:00:00')

        expect(mockedSetFilterDateTo).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateTo).toHaveBeenCalledWith('2024-06-06T23:59:59')
    })

    test('check if LAST_30_DAYS is set properly', async () => {
        render( <ExtractionFilter/> )

        await userEvent.selectOptions(screen.queryByTestId('sFilterDateType')!, 'LAST_30_DAYS')

        expect(mockedSetFilterDateFrom).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateFrom).toHaveBeenCalledWith('2024-05-08T00:00:00')

        expect(mockedSetFilterDateTo).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateTo).toHaveBeenCalledWith('2024-06-06T23:59:59')
    })

    test('check if ALL_TIME is set properly', async () => {
        render( <ExtractionFilter/> )

        await userEvent.selectOptions(screen.queryByTestId('sFilterDateType')!, 'ALL_TIME')

        expect(mockedSetFilterDateFrom).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateFrom).toHaveBeenCalledWith('1977-09-13T00:00:00')

        expect(mockedSetFilterDateTo).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterDateTo).toHaveBeenCalledWith('2024-06-06T23:59:59')
    })

})