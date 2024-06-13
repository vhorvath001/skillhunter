import { JSDOM } from 'jsdom'
import { FormEvent } from 'react'

export const createFormEvent = (pairs: string[][]): FormEvent<HTMLFormElement> => {
    const dom = new JSDOM('<!DOCTYPE html>'), doc = dom.window.document
    const formElement = doc.createElement('form')

    for (const pair of pairs) {
        const formFieldId = doc.createElement('input')
        formElement.append(formFieldId)
        formFieldId.name = pair[0]
        formFieldId.value = pair[1]
    }
    
    return {
        currentTarget: formElement,
        preventDefault: () => {}
    } as FormEvent<HTMLFormElement>
}
