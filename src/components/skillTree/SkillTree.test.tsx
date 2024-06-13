import * as UseSkillTree from '../../hooks/useSkillTree'
import { SkillTreeNodeType, initState } from '../../context/SkillTreeProvider'
import { render, screen } from '@testing-library/react'
import SkillTree from './SkillTree'
import * as Tree from './Tree'

describe('testing to load the programming languages', () => {

    test('in loading', () => {
        vi
            .spyOn(UseSkillTree, 'default')
            .mockImplementation(() => { return {
                ...initState,
                isLoading: true,
                state: {
                    skillTree: []
                }
            }})

        render(
            <SkillTree />
        )

        expect(screen.queryByText(/Loading the programming languages/i)).toBeInTheDocument()
        expect(screen.queryByTestId('dProgLangSelect')).not.toBeInTheDocument()
    })

    test('failed to load', () => {
        vi
            .spyOn(UseSkillTree, 'default')
            .mockImplementation(() => { return {
                ...initState,
                isLoading: false,
                fetchError: 'Error 500',
                state: {
                    skillTree: []
                }
            }})

        render(
            <SkillTree />
        )

        expect(screen.queryByText(/Loading the programming languages/i)).not.toBeInTheDocument()
        expect(screen.queryByTestId('dProgLangSelect')).not.toBeInTheDocument()
        expect(screen.queryByRole('alert')).toBeInTheDocument()
        expect(screen.queryByText(/Error 500/i)).toBeInTheDocument()
    })

    test('loading was successful', () => {
        vi
            .spyOn(UseSkillTree, 'default')
            .mockImplementation(() => { return {
                ...initState,
                isLoading: false,
                progLangs: [
                    {key: 'k0', value: 'v0'},
                    {key: 'k1', value: 'v1'},
                ],
                state: {
                    skillTree: []
                }
            }})

        render(
            <SkillTree />
        )

        screen.debug()
        expect(screen.queryByText(/Loading the programming languages/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        expect(screen.queryByText(/Error 500/i)).not.toBeInTheDocument()
        expect(screen.queryByTestId('dProgLangSelect')).toBeInTheDocument()
        expect(screen.queryByTestId('dProgLangSelect')?.children[0].children[0].children.length).toEqual(3)
    })
})

describe('testing to load the skill tree', () => {

    test('in loading', () => {
        vi
            .spyOn(UseSkillTree, 'default')
            .mockImplementation(() => { return {
                ...initState,
                treeIsLoading: true,
                state: {
                    skillTree: []
                }
            }})

        render(
            <SkillTree />
        )

        expect(screen.queryByText(/Loading the Skill Tree/i)).toBeInTheDocument()
        expect(screen.queryByTestId('dSkillTree')).not.toBeInTheDocument()
    })

    test('failed to load', () => {
        vi
            .spyOn(UseSkillTree, 'default')
            .mockImplementation(() => { return {
                ...initState,
                treeIsLoading: false,
                treeErrorMessage: 'Error 500',
                state: {
                    skillTree: []
                }
            }})

        render(
            <SkillTree />
        )

        expect(screen.queryByText(/Loading the Skill Tree/i)).not.toBeInTheDocument()
        expect(screen.queryByTestId('dSkillTree')).not.toBeInTheDocument()
        expect(screen.queryByRole('alert')).toBeInTheDocument()
        expect(screen.queryByText(/Error 500/i)).toBeInTheDocument()
    })

    test('loading was successful', () => {
        vi
            .spyOn(UseSkillTree, 'default')
            .mockImplementation(() => { return {
                ...initState,
                treeIsLoading: false,
                state: {
                    skillTree: [
                        { id: 0, name: 'n0', enabled: true, children: [], selected: false } as SkillTreeNodeType
                    ]
                }
            }})
        vi
            .spyOn(Tree, 'default')
            .mockImplementation(() => <div data-testid='Tree' />)
        
        render(
            <SkillTree />
        )

        screen.debug()
        expect(screen.queryByText(/Loading the programming languages/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        expect(screen.queryByText(/Error 500/i)).not.toBeInTheDocument()
        expect(screen.queryByTestId('dProgLangSelect')).toBeInTheDocument()
        expect(screen.queryAllByRole('button').length).toEqual(5)
        expect(screen.queryByTestId('Tree')).toBeInTheDocument()
    })

})