import axios from 'axios'
import { DEVELOPER_ACTION_TYPES, DeveloperAction, DeveloperStateType, DeveloperType, handleDelete, handleSave, reducer, sortList } from './DeveloperProvider'
import { endpointBackEnd } from '../api/client'
import { Mock, MockedFunction } from 'vitest'
import { FormEvent } from 'react'
import { createFormEvent } from './TestUtils'

vi.mock('axios')

afterEach(() => {
    vi.clearAllMocks()
})

describe('testing handleDelete', () => {

    test('successful', async () => {
        const mockedDispatch = vi.fn()
        const mockedHandleClose = vi.fn()
        const mockedSetErrorMessage = vi.fn()
        const id = '1'

        await handleDelete(mockedDispatch, mockedHandleClose, mockedSetErrorMessage, id)

        expect(axios).toHaveBeenCalledTimes(1)
        expect(axios).toHaveBeenCalledWith({
            method: 'DELETE',
            url: `${endpointBackEnd}/developers/${id}`
        })

        expect(mockedDispatch).toHaveBeenCalledTimes(1)
        expect(mockedDispatch).toHaveBeenCalledWith({
            type: DEVELOPER_ACTION_TYPES.DELETE, 
            id: Number(id)
        })

        expect(mockedHandleClose).toHaveBeenCalledTimes(1)

        expect(mockedSetErrorMessage).toHaveBeenCalledTimes(0)
    })

    test('error in call', async () => {
        const mockedDispatch = vi.fn()
        const mockedHandleClose = vi.fn()
        const mockedSetErrorMessage = vi.fn()
        const id = '1'

        const mockedAxios = axios as unknown as Mock
        mockedAxios.mockRejectedValueOnce(new Error('error 500'))

        await handleDelete(mockedDispatch, mockedHandleClose, mockedSetErrorMessage, id)

        expect(axios).toHaveBeenCalledTimes(1)
        expect(axios).toHaveBeenCalledWith({
            method: 'DELETE',
            url: `${endpointBackEnd}/developers/${id}`
        })

        expect(mockedDispatch).toHaveBeenCalledTimes(0)

        expect(mockedHandleClose).toHaveBeenCalledTimes(0)

        expect(mockedSetErrorMessage).toHaveBeenCalledTimes(1)
        expect(mockedSetErrorMessage).toHaveBeenCalledWith('error 500')
    })
})

describe('testing handleSave', () => {

    test('successful', async () => {
        const mockedDispatch = vi.fn()
        const mockedHandleClose = vi.fn()
        const mockedSetErrorMessage = vi.fn()
        const id = 1
        const payload = {
            id: id, name: 'n0', email: 'e0'
        }

        const formEvent: FormEvent<HTMLFormElement> = createFormEvent([['id', String(id)], ['name', 'n0'], ['email', 'e0']])

        const mockedAxios = axios as unknown as MockedFunction<typeof axios>
        mockedAxios.mockResolvedValueOnce({
            data: payload
        })

        await handleSave(mockedDispatch, formEvent, mockedHandleClose, mockedSetErrorMessage)

        expect(axios).toHaveBeenCalledTimes(1)
        expect(axios).toHaveBeenCalledWith({
            method: 'PUT',
            url: `${endpointBackEnd}/developers/${id}`,
            data: payload
        })

        expect(mockedDispatch).toHaveBeenCalledTimes(1)
        expect(mockedDispatch).toHaveBeenCalledWith({
            type: DEVELOPER_ACTION_TYPES.EDIT, 
            payload: {
                id: id, name: 'n0', email: 'e0'
            }
        })

        expect(mockedHandleClose).toHaveBeenCalledTimes(1)

        expect(mockedSetErrorMessage).toHaveBeenCalledTimes(0)
    })

    test('error in call', async () => {
        const mockedDispatch = vi.fn()
        const mockedHandleClose = vi.fn()
        const mockedSetErrorMessage = vi.fn()
        const id = 1
        const payload = {
            id: id, name: 'n0', email: 'e0'
        }

        const formEvent: FormEvent<HTMLFormElement> = createFormEvent([['id', String(id)], ['name', 'n0'], ['email', 'e0']])

        const mockedAxios = axios as unknown as Mock
        mockedAxios.mockRejectedValueOnce(new Error('error 500'))
      
        await handleSave(mockedDispatch, formEvent, mockedHandleClose, mockedSetErrorMessage)

        expect(axios).toHaveBeenCalledTimes(1)
        expect(axios).toHaveBeenCalledWith({
            method: 'PUT',
            url: `${endpointBackEnd}/developers/${id}`,
            data: payload
        })

        expect(mockedDispatch).toHaveBeenCalledTimes(0)

        expect(mockedHandleClose).toHaveBeenCalledTimes(0)

        expect(mockedSetErrorMessage).toHaveBeenCalledTimes(1)
        expect(mockedSetErrorMessage).toHaveBeenCalledWith('error 500')
    })
})

describe('testing reducer', () => {

    test('POPULATE', () => {
        const list: DeveloperType[] = [
            { id: 0, name: 'n0', email: 'e0' },
            { id: 1, name: 'a0', email: 'b0' },
        ]

        const state: DeveloperStateType = {
            list: [],
            originalList: []
        }
        const action: DeveloperAction = {
            type: DEVELOPER_ACTION_TYPES.POPULATE,
            payload: list
        }

        const newState: DeveloperStateType = reducer(state, action)

        expect(newState.list).toEqual(sortList(list))
        expect(newState.originalList).toEqual(sortList(list))
    })

    test('EDIT', () => {
        const list: DeveloperType[] = [
            { id: 0, name: 'n0', email: 'e0' },
            { id: 1, name: 'a0', email: 'b0' },
        ]
        const payload: DeveloperType = {
            id: 1, name: 'a1', email: 'b1'
        }

        const state: DeveloperStateType = {
            list: list,
            originalList: list
        }
        const action: DeveloperAction = {
            type: DEVELOPER_ACTION_TYPES.EDIT,
            payload: payload
        }

        const newState: DeveloperStateType = reducer(state, action)

        const updatedList: DeveloperType[] = [
            { id: 1, name: 'a1', email: 'b1' },
            { id: 0, name: 'n0', email: 'e0' },
        ]
        expect(newState.list).toEqual(sortList(updatedList))
        expect(newState.originalList).toEqual(sortList(updatedList))
    })

    test('DELETE', () => {
        const list: DeveloperType[] = [
            { id: 0, name: 'n0', email: 'e0' },
            { id: 1, name: 'a0', email: 'b0' },
        ]
        const id: number = 1

        const state: DeveloperStateType = {
            list: list,
            originalList: list
        }
        const action: DeveloperAction = {
            type: DEVELOPER_ACTION_TYPES.DELETE,
            id: id
        }

        const newState: DeveloperStateType = reducer(state, action)

        const updatedList: DeveloperType[] = [
            { id: 0, name: 'n0', email: 'e0' },
        ]
        expect(newState.list).toEqual(sortList(updatedList))
        expect(newState.originalList).toEqual(sortList(updatedList))
    })

    test('FILTER', () => {
        const list: DeveloperType[] = [
            { id: 0, name: 'n0', email: 'e0' },
            { id: 1, name: 'a0', email: 'b0' },
            { id: 2, name: 'n1', email: 'b1' },
        ]
        const payload: DeveloperType = {
            name: 'n', email: 'b'
        }

        const state: DeveloperStateType = {
            list: list,
            originalList: list
        }
        const action: DeveloperAction = {
            type: DEVELOPER_ACTION_TYPES.FILTER,
            payload: payload
        }

        const newState: DeveloperStateType = reducer(state, action)

        const filteredList: DeveloperType[] = [
            { id: 2, name: 'n1', email: 'b1' },
        ]
        expect(newState.list).toEqual(sortList(filteredList))
        expect(newState.originalList).toEqual(sortList(list))
    })

})