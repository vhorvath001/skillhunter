import { Mock, vi } from 'vitest'
import { ProgLangProvider, callRESTDelete, handleDelete, handleError } from './ProgLangProvider'
import axios from 'axios'

test('Testing "handleError" when string passed', () => {
    const mockedSetErrorMessage = vi.fn()

    handleError('Error!', mockedSetErrorMessage)

    expect(mockedSetErrorMessage).toHaveBeenCalledTimes(1)
    expect(mockedSetErrorMessage).toHaveBeenCalledWith('Error!')
})

test('Testing "handleError" when Error passed', () => {
    const mockedSetErrorMessage = vi.fn()

    handleError(new Error('Error!'), mockedSetErrorMessage)

    expect(mockedSetErrorMessage).toHaveBeenCalledTimes(1)
    expect(mockedSetErrorMessage).toHaveBeenCalledWith('Error!')
})

// test('Testing "handleDelete"', () => {
//     const mockedSetErrorMessage = vi.fn()
//     const mockedDispatch = vi.fn()
//     const mockedHandleClose = vi.fn()
//     const mockedClient = vi.fn()

//     const spyProgLangProvider = vi.spyOn('./ProgLangProvider', 'callRESTDelete');//.mockImplementation(() => {})

//     handleDelete(mockedDispatch, mockedHandleClose, mockedSetErrorMessage, '12')

//     expect(axios.delete).toHaveBeenCalledTimes(1)
//     expect(axios.delete).toHaveBeenCalledWith({
//         method: 'DELETE',
//         url: '/prog-langs/12'
//     })
// })