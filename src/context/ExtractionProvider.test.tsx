import { FormEvent } from 'react'
import { EXTRACTION_ACTION_TYPES, ExtractionAction, ExtractionStateType, ExtractionType, handleFilterClick, handleStartExtraction, reducer } from './ExtractionProvider'
import { client } from '../api/client'
import { Mock } from 'vitest'
import { createFormEvent } from './TestUtils'
import { RepositoryType } from './RepositoryProvider'

vi.mock('../api/client', () => ({
    __esModule: true,
    client: {
        post: vi.fn(),
        get: vi.fn()
    },
}))

afterEach(() => {
    vi.clearAllMocks()
})

describe('testing handleStartExtraction()', () => {

    test('successful', async () => {
        const repoId = '43'
        const path = '/integration/acme'
        const show2ndPage: boolean = true
        const selectedProgLangs: string[] = ['2', '5']
            const formEvent: FormEvent<HTMLFormElement> = createFormEvent([
            ['project_2', 'NOTUSED'], ['projectname_2', 'acme-ui'], ['branch_2', 'master'],
            ['project_5', 'NOTUSED'], ['projectname_5', 'acme-server'], ['branch_5', 'release/2.3'],
            ['repository', repoId ], ['path', path]
        ])
        const mockedHandleClose = vi.fn()
        const mockedSetShow2ndPage = vi.fn()
        const mockedSetErrorMessage = vi.fn()

        const mockedPost = client.post as Mock
        mockedPost.mockResolvedValueOnce({
            data: null,
            status: 200,
            statusText: 'OK',
            headers: null,
            config: null
        })

        await expect(handleStartExtraction(formEvent, mockedHandleClose, show2ndPage, mockedSetShow2ndPage, mockedSetErrorMessage, selectedProgLangs)).resolves.toBe(undefined)

        expect(client.post).toHaveBeenCalledTimes(1)
        expect(client.post).toHaveBeenCalledWith('extractions', {
            repoId: repoId,
            path: path,
            progLangs: selectedProgLangs,
            projectsBranches: [{
                'branch': 'master',
                'projectId': '2',
                'projectName': 'acme-ui',
            },
            {
                'branch': 'release/2.3',
                'projectId': '5',
                'projectName': 'acme-server',
            }]
         })

        expect(mockedHandleClose).toHaveBeenCalledTimes(1)

        expect(mockedSetShow2ndPage).toHaveBeenCalledTimes(1)
        expect(mockedSetShow2ndPage).toHaveBeenCalledWith(false)

        expect(mockedSetErrorMessage).toHaveBeenCalledTimes(0)
    })

    test('call failed', async () => {
        const repoId = '43'
        const path = '/integration/acme'
        const show2ndPage: boolean = true
        const selectedProgLangs: string[] = ['2', '5']
            const formEvent: FormEvent<HTMLFormElement> = createFormEvent([
            ['project_2', 'NOTUSED'], ['projectname_2', 'acme-ui'], ['branch_2', 'master'],
            ['project_5', 'NOTUSED'], ['projectname_5', 'acme-server'], ['branch_5', 'release/2.3'],
            ['repository', repoId ], ['path', path]
        ])
        const mockedHandleClose = vi.fn()
        const mockedSetShow2ndPage = vi.fn()
        const mockedSetErrorMessage = vi.fn()

        const mockedPost = client.post as Mock
        mockedPost.mockRejectedValueOnce(new Error( 'Exceptione' ))

        await expect(handleStartExtraction(formEvent, mockedHandleClose, show2ndPage, mockedSetShow2ndPage, mockedSetErrorMessage, selectedProgLangs)).resolves.toBe(undefined)

        expect(client.post).toHaveBeenCalledTimes(1)
        expect(client.post).toHaveBeenCalledWith('extractions', {
            repoId: repoId,
            path: path,
            progLangs: selectedProgLangs,
            projectsBranches: [{
                'branch': 'master',
                'projectId': '2',
                'projectName': 'acme-ui',
            },
            {
                'branch': 'release/2.3',
                'projectId': '5',
                'projectName': 'acme-server',
            }]
         })

        expect(mockedHandleClose).toHaveBeenCalledTimes(0)

        expect(mockedSetShow2ndPage).toHaveBeenCalledTimes(0)

        expect(mockedSetErrorMessage).toHaveBeenCalledTimes(1)
        expect(mockedSetErrorMessage).toHaveBeenCalledWith('Exceptione')
    })
})

describe('testing handleFilterClick()', () => {

    test('successful', async () => {
        const filterRepoId: number = 12
        const filterStatus: string = 'COMPLETED'
        const filterDateFrom: string = '2024-06-05T00:00:00'
        const filterDateTo: string = '2024-06-06T00:00:00'

        const mockedSetFilterErrorMessage = vi.fn()
        const mockedDispatch = vi.fn()
        const mockedSetAreExtractionsLoading = vi.fn()

        const payload: ExtractionType = {
            id: 1,
            startDate: new Date(),
            projectsBranches: [],
            path: '',
            status: '',
            repository: {} as RepositoryType,
            progLangs: []
        }

        const mockedGet = client.get as Mock
        mockedGet.mockResolvedValueOnce({
            data: [ payload ],
            status: 200,
            statusText: 'OK',
            headers: null,
            config: null
        })

        await expect(handleFilterClick(
            filterRepoId, 
            filterStatus, 
            filterDateFrom, 
            filterDateTo, 
            mockedSetFilterErrorMessage, 
            mockedDispatch, 
            mockedSetAreExtractionsLoading
        )).resolves.toBe(undefined)

        expect(mockedSetAreExtractionsLoading).toHaveBeenCalledTimes(2)
        expect(mockedSetAreExtractionsLoading).toHaveBeenNthCalledWith(1, true)
        expect(mockedSetAreExtractionsLoading).toHaveBeenNthCalledWith(2, false)

        expect(mockedSetFilterErrorMessage).toHaveBeenCalledTimes(1)
        expect(mockedSetFilterErrorMessage).toHaveBeenCalledWith('')

        expect(mockedDispatch).toHaveBeenCalledTimes(1)
        expect(mockedDispatch).toHaveBeenCalledWith({
            type: EXTRACTION_ACTION_TYPES.POPULATE, 
            payload: [payload]
        })

        expect(client.get).toHaveBeenCalledTimes(1)
        expect(client.get).toHaveBeenCalledWith('extractions', {
            params: {
                repoId: filterRepoId,
                dateFrom: filterDateFrom,
                dateTo: filterDateTo,
                status: filterStatus
            }
         })
        
    })

    test('call failed', async () => {
        const filterRepoId: number = 12
        const filterStatus: string = 'COMPLETED'
        const filterDateFrom: string = '2024-06-05T00:00:00'
        const filterDateTo: string = '2024-06-06T00:00:00'

        const mockedSetFilterErrorMessage = vi.fn()
        const mockedDispatch = vi.fn()
        const mockedSetAreExtractionsLoading = vi.fn()

        const mockedGet = client.get as Mock
        mockedGet.mockRejectedValueOnce(new Error( 'Exceptione' ))

        await expect(handleFilterClick(
            filterRepoId, 
            filterStatus, 
            filterDateFrom, 
            filterDateTo, 
            mockedSetFilterErrorMessage, 
            mockedDispatch, 
            mockedSetAreExtractionsLoading
        )).resolves.toBe(undefined)

        expect(mockedSetAreExtractionsLoading).toHaveBeenCalledTimes(2)
        expect(mockedSetAreExtractionsLoading).toHaveBeenNthCalledWith(1, true)
        expect(mockedSetAreExtractionsLoading).toHaveBeenNthCalledWith(2, false)

        expect(mockedSetFilterErrorMessage).toHaveBeenCalledTimes(2)
        expect(mockedSetFilterErrorMessage).toHaveBeenNthCalledWith(1, '')
        expect(mockedSetFilterErrorMessage).toHaveBeenNthCalledWith(2, 'Exceptione')

        expect(mockedDispatch).toHaveBeenCalledTimes(0)

        expect(client.get).toHaveBeenCalledTimes(1)
        expect(client.get).toHaveBeenCalledWith('extractions', {
            params: {
                repoId: filterRepoId,
                dateFrom: filterDateFrom,
                dateTo: filterDateTo,
                status: filterStatus
            }
         })
        
    })
})

describe('testing reducer', () => {

    test('POPULATE', () => {
        const list: ExtractionType[] = [{
            id: 1, startDate: new Date(), projectsBranches: [], path: '/acme', status: 'COMPLETED', repository: {} as RepositoryType, progLangs: []
        }]
        const state: ExtractionStateType = {
            list: []
        }
        const action: ExtractionAction = {
            type: EXTRACTION_ACTION_TYPES.POPULATE,
            payload: list
        }

        const updatedState: ExtractionStateType = reducer(state, action)

        expect(updatedState.list).toEqual(list)
    })

    test('DELETE', () => {
        const list: ExtractionType[] = [{
            id: 1, startDate: new Date(), projectsBranches: [], path: '/acme', status: 'COMPLETED', repository: {} as RepositoryType, progLangs: []
        }]
        const state: ExtractionStateType = {
            list: list
        }
        const action: ExtractionAction = {
            type: EXTRACTION_ACTION_TYPES.DELETE,
            id: 1
        }

        const updatedState: ExtractionStateType = reducer(state, action)

        expect(updatedState.list).toEqual([])
    })

})