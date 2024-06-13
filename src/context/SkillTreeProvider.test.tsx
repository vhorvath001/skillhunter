import { Mock } from 'vitest'
import { client } from '../api/client'
import { SKILL_TREE_ACTION_TYPE, SkillTreeAction, SkillTreeNodeType, SkillTreeStateType, handleDelete, handleStatusChange, reducer } from './SkillTreeProvider'

vi.mock('../api/client', () => ({
    __esModule: true,
    client: {
        post: vi.fn(),
        get: vi.fn(),
        delete: vi.fn()
    },
}))

afterEach(() => {
    vi.clearAllMocks()
})

describe('testing handleStatusChange()', () => {

    test('disable all the skills', async () => {
        const operation: string = 'DISABLE'
        const treeData: SkillTreeNodeType[] = buildTree(['springframework'])
        const mockedDispatch = vi.fn()
        const mockedSetTreeOperationErrorMessage = vi.fn()

        const mockedPost = client.post as Mock
        mockedPost.mockResolvedValueOnce({
            data: null,
            status: 200,
            statusText: 'OK',
            headers: null,
            config: null
        })

        await expect(handleStatusChange(operation, treeData, mockedDispatch, mockedSetTreeOperationErrorMessage)).resolves.toBe(undefined)

        const ids = [0,1,4,2,3,5,7,6]
        expect(client.post).toHaveBeenCalledTimes(1)
        expect(client.post).toHaveBeenCalledWith('/skills/status', {
            ids: ids,
            status: operation
        })

        expect(mockedDispatch).toHaveBeenCalledTimes(1)
        expect(mockedDispatch).toHaveBeenCalledWith({
            type: SKILL_TREE_ACTION_TYPE.STATUS_CHANGE,
            payload: treeData,
            ids: ids,
            status: operation
        })
    })

    test(`disable 'jdbc' skill`, async () => {
        const operation: string = 'DISABLE'
        const treeData: SkillTreeNodeType[] = buildTree(['jdbc'])
        const mockedDispatch = vi.fn()
        const mockedSetTreeOperationErrorMessage = vi.fn()

        const mockedPost = client.post as Mock
        mockedPost.mockResolvedValueOnce({
            data: null,
            status: 200,
            statusText: 'OK',
            headers: null,
            config: null
        })

        await expect(handleStatusChange(operation, treeData, mockedDispatch, mockedSetTreeOperationErrorMessage)).resolves.toBe(undefined)

        const ids = [1,2,3]
        expect(client.post).toHaveBeenCalledTimes(1)
        expect(client.post).toHaveBeenCalledWith('/skills/status', {
            ids: ids,
            status: operation
        })

        expect(mockedDispatch).toHaveBeenCalledTimes(1)
        expect(mockedDispatch).toHaveBeenCalledWith({
            type: SKILL_TREE_ACTION_TYPE.STATUS_CHANGE,
            payload: treeData,
            ids: ids,
            status: operation
        })
    })

    test(`enable 'core2' skill -> the following will be enabled: core2, scope, batch, springfremwork`, async () => {
        let operation: string = 'DISABLE'
        let treeData: SkillTreeNodeType[] = buildTree(['springframework'])
        const mockedDispatch = vi.fn()
        const mockedSetTreeOperationErrorMessage = vi.fn()

        const mockedPost = client.post as Mock
        mockedPost.mockResolvedValue({
            data: null,
            status: 200,
            statusText: 'OK',
            headers: null,
            config: null
        })

        // first disable all
        await expect(handleStatusChange(operation, treeData, mockedDispatch, mockedSetTreeOperationErrorMessage)).resolves.toBe(undefined)

        // then enable 'core2'
        operation = 'ENABLE'
        treeData = buildTree(['core2'])

        await expect(handleStatusChange(operation, treeData, mockedDispatch, mockedSetTreeOperationErrorMessage)).resolves.toBe(undefined)

        const ids = [5,6,0,4]
        expect(client.post).toHaveBeenCalledTimes(2)
        expect(client.post).toHaveBeenNthCalledWith(2, '/skills/status', {
            ids: ids,
            status: operation
        })

        expect(mockedDispatch).toHaveBeenCalledTimes(2)
        expect(mockedDispatch).toHaveBeenNthCalledWith(2, {
            type: SKILL_TREE_ACTION_TYPE.STATUS_CHANGE,
            payload: treeData,
            ids: ids,
            status: operation
        })
    })

})

describe('testing handleDelete()', () => {

    test(`delete 'jdbc' skill`, async () => {
        const treeData: SkillTreeNodeType[] = buildTree(['jdbc'])
        const mockedDispatch = vi.fn()
        const mockedSetTreeOperationErrorMessage = vi.fn()
        const mockedHandleClose = vi.fn()

        const mockedDelete = client.delete as Mock
        mockedDelete.mockResolvedValueOnce({
            data: null,
            status: 200,
            statusText: 'OK',
            headers: null,
            config: null
        })

        await expect(handleDelete(mockedDispatch, mockedHandleClose, mockedSetTreeOperationErrorMessage, treeData)).resolves.toBe(undefined)

        const ids = [1,2,3]
        expect(client.delete).toHaveBeenCalledTimes(1)
        expect(client.delete).toHaveBeenCalledWith('/skills', {
            data: { ids: ids }
        })

        expect(mockedDispatch).toHaveBeenCalledTimes(1)
        expect(mockedDispatch).toHaveBeenCalledWith({
            type: SKILL_TREE_ACTION_TYPE.DELETE,
            payload: treeData,
            ids: ids
        })
    })

})

describe('testing reducer()', () => {

    test('POPULATE', () => {
        const treeData: SkillTreeNodeType[] = buildTree(['jdbc'])
        const state: SkillTreeStateType = {
            skillTree: []
        }
        const action: SkillTreeAction = {
            type: SKILL_TREE_ACTION_TYPE.POPULATE,
            payload: treeData
        }

        const updatedState: SkillTreeStateType = reducer(state, action)

        expect(updatedState.skillTree).toEqual(treeData)
    })

    test(`STATUS_CHANGE - disable 'jdbc'`, () => {
        const treeData: SkillTreeNodeType[] = buildTree(['XXX'])
        const state: SkillTreeStateType = {
            skillTree: treeData
        }
        const action: SkillTreeAction = {
            type: SKILL_TREE_ACTION_TYPE.STATUS_CHANGE,
            payload: treeData,
            ids: [1,2,3],
            status: 'DISABLE'
        }

        const updatedState: SkillTreeStateType = reducer(state, action)

        expect(updatedState.skillTree[0].enabled).toEqual(true)
        expect(updatedState.skillTree[0].children[0].enabled).toEqual(false)
        expect(updatedState.skillTree[0].children[1].enabled).toEqual(true)
        expect(updatedState.skillTree[0].children[0].children[0].enabled).toEqual(false)
        expect(updatedState.skillTree[0].children[0].children[1].enabled).toEqual(false)
    })

    test(`DELETE - disable 'jdbc'`, () => {
        const treeData: SkillTreeNodeType[] = buildTree(['XXX'])
        const state: SkillTreeStateType = {
            skillTree: treeData
        }
        const action: SkillTreeAction = {
            type: SKILL_TREE_ACTION_TYPE.DELETE,
            payload: treeData,
            ids: [1,2,3]
        }

        const updatedState: SkillTreeStateType = reducer(state, action)

        expect(updatedState.skillTree[0].children[0].name).toEqual('batch')
    })
})

const buildTree = (selected: string[]): SkillTreeNodeType[] => {
    /* springframework
           jdbc
               core
               datasource
            batch
                core2
                    scope
                integration */
    const datasource: SkillTreeNodeType = buildSkillTreeNode(3, 'datasource', [], selected.includes('datasource'))
    const core: SkillTreeNodeType = buildSkillTreeNode(2, 'core', [], selected.includes('core'))
    const jdbc: SkillTreeNodeType = buildSkillTreeNode(1, 'jdbc', [core, datasource], selected.includes('jdbc'))
    const integration: SkillTreeNodeType = buildSkillTreeNode(7, 'integration', [], selected.includes('integration'))
    const scope: SkillTreeNodeType = buildSkillTreeNode(6, 'scope', [], selected.includes('scope'))
    const core2: SkillTreeNodeType = buildSkillTreeNode(5, 'core2', [scope], selected.includes('core2'))
    const batch: SkillTreeNodeType = buildSkillTreeNode(4, 'batch', [core2, integration], selected.includes('batch'))
    const springframework: SkillTreeNodeType = buildSkillTreeNode(0, 'springframework', [jdbc, batch], selected.includes('springframework'))

    return [springframework]
}

const buildSkillTreeNode = (id: number, name: string, children: SkillTreeNodeType[], selected: boolean) => {
    return {
        id: id,
        name: name,
        enabled: true,
        children: children,
        selected: selected
    }
}