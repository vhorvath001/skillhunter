import { FormEvent, useState } from 'react'
import { handleStartExtraction } from './ExtractionProvider'

test('testing handleStartExtraction', () => {
    const mockedFormEvent = { 
        target: { querySelectorAll: jest.fn() }, 
        preventDefault: jest.fn() 
    }
    const mockedHandleClose = jest.fn()
    const [ show2ndPage, setShow2ndPage ] = useState<boolean>(false)
    const mockedSetErrorMessage = jest.fn()
    const selectedProgLangs: string[] = ['3', '6']

    // handleStartExtraction(mockedFormEvent, mockedHandleClose, show2ndPage, setShow2ndPage, mockedSetErrorMessage, selectedProgLangs)
    throw Error('Not implemented yet!')
})