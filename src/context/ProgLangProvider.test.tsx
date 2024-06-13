import axios from 'axios'
import { endpointBackEnd } from '../api/client'
import { Mock, MockedFunction } from 'vitest'
import { FormEvent } from 'react'
import { createFormEvent } from './TestUtils'
import { PROG_LANG_ACTION_TYPES, PackageRemovalPatternType, ProgLangAction, ProgLangStateType, ProgLangType, handleDelete, handleSave, reducer, sortList } from './ProgLangProvider'

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
            url: `${endpointBackEnd}/prog-langs/${id}`
        })

        expect(mockedDispatch).toHaveBeenCalledTimes(1)
        expect(mockedDispatch).toHaveBeenCalledWith({
            type: PROG_LANG_ACTION_TYPES.DELETE, 
            id: id
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
            url: `${endpointBackEnd}/prog-langs/${id}`
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
        const id = 0
        const payload: ProgLangType = buildProgLang0()

        const formEvent: FormEvent<HTMLFormElement> = createFormEvent([
            ['id', String(id)], 
            ['name', 'pl0'],
            ['desc', 'd0'], 
            ['sourceFiles', '*.java'],
            ['level', '3'],
            ['removingTLDPackages', 'on'],
            ['patternListItem_0', '.*'],
            ['packageRemovalPatternListItem_type_0', 'IGNORING_PACKAGE'],
            ['packageRemovalPatternListItem_value_0', '^[j]{1}[a]{1}[v]{1}[a]{1}[x]{1}[\\.]{1}.+'],
            ['scope', 'EVERYWHERE'],
            ['ignoringLinesPatternListItem_0', '^(?![\\s\\S]*.*([a-zA-Z0-9]){2}.*)[\\s\\S]*$'],
        ])

        const mockedAxios = axios as unknown as MockedFunction<typeof axios>
        mockedAxios.mockResolvedValueOnce({
            data: payload
        })

        await handleSave(mockedDispatch, formEvent, mockedHandleClose, mockedSetErrorMessage)

        expect(axios).toHaveBeenCalledTimes(1)
        expect(axios).toHaveBeenCalledWith({
            method: 'PUT',
            url: `${endpointBackEnd}/prog-langs/${id}`,
            data: payload
        })

        expect(mockedDispatch).toHaveBeenCalledTimes(1)
        expect(mockedDispatch).toHaveBeenCalledWith({
            type: PROG_LANG_ACTION_TYPES.EDIT, 
            payload: payload
        })

        expect(mockedHandleClose).toHaveBeenCalledTimes(1)

        expect(mockedSetErrorMessage).toHaveBeenCalledTimes(0)
    })

    test('error in call', async () => {
        const mockedDispatch = vi.fn()
        const mockedHandleClose = vi.fn()
        const mockedSetErrorMessage = vi.fn()
        const id = 1

        const formEvent: FormEvent<HTMLFormElement> = createFormEvent([
            ['id', String(id)], 
            ['name', 'pl0'], 
            ['sourceFiles', '*.java'],
            ['level', '3'],
            ['removingTLDPackages', 'on'],
            ['patternListItem_1', '.*'],
            ['packageRemovalPatternListItem_1', 'IGNORING_PACKAGE'],
            ['packageRemovalPatternListItem_value_1', '^[j]{1}[a]{1}[v]{1}[a]{1}[x]{1}[\\.]{1}.+'],
            ['scope', 'EVERYWHERE'],
            ['ignoringLinesPatternListItem_1', '^(?![\\s\\S]*.*([a-zA-Z0-9]){2}.*)[\\s\\S]*$'],
        ])

        const mockedAxios = axios as unknown as Mock
        mockedAxios.mockRejectedValueOnce(new Error('error 500'))
      
        await handleSave(mockedDispatch, formEvent, mockedHandleClose, mockedSetErrorMessage)

        expect(axios).toHaveBeenCalledTimes(1)
        expect(axios).toHaveBeenCalledWith({
            method: 'PUT',
            url: `${endpointBackEnd}/prog-langs/${id}`,
            data: expect.anything()
        })

        expect(mockedDispatch).toHaveBeenCalledTimes(0)

        expect(mockedHandleClose).toHaveBeenCalledTimes(0)

        expect(mockedSetErrorMessage).toHaveBeenCalledTimes(1)
        expect(mockedSetErrorMessage).toHaveBeenCalledWith('error 500')
    })
})

describe('testing reducer', () => {

    test('POPULATE', () => {
        const list: ProgLangType[] = [ buildProgLang0() ]

        const state: ProgLangStateType = {
            list: [],
            originalList: []
        }
        const action: ProgLangAction = {
            type: PROG_LANG_ACTION_TYPES.POPULATE,
            payload: list
        }

        const newState: ProgLangStateType = reducer(state, action)

        expect(newState.list).toEqual(sortList(list))
        expect(newState.originalList).toEqual(sortList(list))
    })

    test('EDIT', () => {
        const list: ProgLangType[] = [ buildProgLang0(), buildProgLang1() ]
        const payload: ProgLangType = buildUpdatedProgLang1()

        const state: ProgLangStateType = {
            list: list,
            originalList: list
        }
        const action: ProgLangAction = {
            type: PROG_LANG_ACTION_TYPES.EDIT,
            payload: payload
        }

        const newState: ProgLangStateType = reducer(state, action)

        const updatedList: ProgLangType[] = [buildProgLang0(), buildUpdatedProgLang1() ]
        expect(newState.list).toEqual(sortList(updatedList))
        expect(newState.originalList).toEqual(sortList(updatedList))
    })

    test('DELETE', () => {
        const list: ProgLangType[] = [ buildProgLang0(), buildProgLang1() ]
        const id: string = '1'

        const state: ProgLangStateType = {
            list: list,
            originalList: list
        }
        const action: ProgLangAction = {
            type: PROG_LANG_ACTION_TYPES.DELETE,
            id: id
        }

        const newState: ProgLangStateType = reducer(state, action)

        const updatedList: ProgLangType[] = [ buildProgLang0() ]
        expect(newState.list).toEqual(sortList(updatedList))
        expect(newState.originalList).toEqual(sortList(updatedList))
    })

    test('FILTER', () => {
        const list: ProgLangType[] = [ buildProgLang0(), buildProgLang1() ]

        const state: ProgLangStateType = {
            list: list,
            originalList: list
        }
        const action: ProgLangAction = {
            type: PROG_LANG_ACTION_TYPES.FILTER,
            filter: '1'
        }

        const newState: ProgLangStateType = reducer(state, action)

        const filteredList: ProgLangType[] = [ buildProgLang1() ]
        expect(newState.list).toEqual(sortList(filteredList))
        expect(newState.originalList).toEqual(sortList(list))
    })

})

const buildProgLang0 = (): ProgLangType => {
    return {
        id: String(0), 
        name: 'pl0', 
        desc: 'd0',
        sourceFiles: '*.java', 
        level: 3, 
        removingTLDPackages: true, 
        patterns: ['.*'], 
        packageRemovalPatterns: [{
            type: 'IGNORING_PACKAGE', 
            value: '^[j]{1}[a]{1}[v]{1}[a]{1}[x]{1}[\\.]{1}.+'} as PackageRemovalPatternType
        ],
        scope: 'EVERYWHERE',
        ignoringLinesPatterns: ['^(?![\\s\\S]*.*([a-zA-Z0-9]){2}.*)[\\s\\S]*$']
    }
}

const buildProgLang1 = (): ProgLangType => {
    return {
        id: String(1), 
        name: 'pl1', 
        desc: 'd1',
        sourceFiles: '*.java', 
        level: 3, 
        removingTLDPackages: true, 
        patterns: ['.*'], 
        packageRemovalPatterns: [{
            type: 'IGNORING_PACKAGE', 
            value: '^[j]{1}[a]{1}[v]{1}[a]{1}[x]{1}[\\.]{1}.+'} as PackageRemovalPatternType
        ],
        scope: 'EVERYWHERE',
        ignoringLinesPatterns: ['^(?![\\s\\S]*.*([a-zA-Z0-9]){2}.*)[\\s\\S]*$']
    }
}

const buildUpdatedProgLang1 = (): ProgLangType => {
    return {
        id: String(1), 
        name: 'proglang0', 
        desc: 'd0',
        sourceFiles: '*Test.java', 
        level: 3, 
        removingTLDPackages: true, 
        patterns: ['.*'], 
        packageRemovalPatterns: [{
            type: 'IGNORING_PACKAGE', 
            value: '^[j]{1}[a]{1}[v]{1}[a]{1}[x]{1}[\\.]{1}.+'} as PackageRemovalPatternType
        ],
        scope: 'EVERYWHERE',
        ignoringLinesPatterns: ['^(?![\\s\\S]*.*([a-zA-Z0-9]){2}.*)[\\s\\S]*$']
}
}