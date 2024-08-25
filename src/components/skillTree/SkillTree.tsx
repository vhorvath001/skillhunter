import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import useSkillTree from '../../hooks/useSkillTree'
import { ChangeEvent, useEffect } from 'react'
import Tree from './Tree'
import Loading from '../../utils/Loading'
import AlertMessage from '../../utils/AlertMessage'
import Button from 'react-bootstrap/Button'
import ModalConfirmation from '../../utils/modal/ModalConfirmation'
import useExtractionMap from '../../hooks/useExtractionMap'
import { SkillTreeNodeType } from '../../context/AppTypes'

type PropsType = {
    mode: string,
    extractionId?: number
}

const SkillTree = ({ mode, extractionId }: PropsType) => {
    const { dispatch, state, progLangs, setSelectedProgLang, isLoading, treeIsLoading, fetchError, treeErrorMessage, 
            handleStatusChange, handleDelete, treeOperationErrorMessage, setTreeOperationErrorMessage, treeMode, setTreeMode, setExtractionId } = useSkillTree()
    const { setShowSkillTreeSelection, setSelectedSkill } = useExtractionMap()

    const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setSelectedProgLang(Number(e.currentTarget.value))
    }

    const changeAllSelected = (isSelected: boolean): void => {
        changeSelectedOfTree(state.skillTree, isSelected)
        const allCb = (document.querySelectorAll('input[id^="cb_selected_"]') as unknown) as HTMLInputElement[]
        allCb.forEach((cb) => { cb.checked = isSelected })
    }

    const changeSelectedOfTree = (nodes: SkillTreeNodeType[], isSelected: boolean): void => {
        for(const node of nodes) {
            node.selected = isSelected
            changeSelectedOfTree(node.children, isSelected)
        }
    }

    const handleClose = (): void => {
        setShowSkillTreeSelection(false)
    }

    const handleSelect = (treeData: SkillTreeNodeType[]): void => {
        const ids = collectSelected(treeData, '/')
        if (ids.length > 1)
            setTreeOperationErrorMessage('Only one skill can be selected!')
        else if (ids.length === 0)
            setTreeOperationErrorMessage('Please select a skill!')
        else {
            setSelectedSkill(ids[0])
            setShowSkillTreeSelection(false)
        }
    }

    const collectSelected = (nodes: SkillTreeNodeType[], parentName: string): any[][] => {
        let ids: any[][] = nodes.filter(n => n.selected).map(n => [n.id, parentName + n.name])
        for (const node of nodes) {
            if (node.children)
                ids.push(...collectSelected(node.children, parentName + node.name + '/'))
        }
        return ids
    }

    useEffect(() => {
        setTreeMode(mode)
        setExtractionId(extractionId)
    }, [])


    return (
        <div className='admin-container'>
            <div className='page-title text-center'>Skill Tree</div>

            <div className='loadingParent container'>
                { isLoading && <Loading message='Loading the programming languages.' /> }
                { !isLoading && fetchError && 
                    <div className='mt-3 w-50 ml-0 mr-0 mx-auto text-center'>
                        <AlertMessage errorMessage={fetchError} />
                    </div>
                }
                { !isLoading && !fetchError &&
                    <div className='mt-3 w-50 ml-0 mr-0 mx-auto text-center' data-testid='dProgLangSelect'>
                        <FloatingLabel label="Choose a programming language to view the skill tree">
                            <Form.Select onChange={handleChange}>
                                <option key='-1' value='-1'>---</option>
                                {progLangs.map(pg => (
                                    <option key={pg.key} value={pg.key}>{pg.value}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                        <hr />
                    </div>
                }

                { treeIsLoading && <Loading message='Loading the Skill Tree.' />}
                { !treeIsLoading && treeErrorMessage && 
                    <div className='mt-3 w-50 ml-0 mr-0 mx-auto text-center'>
                        <AlertMessage errorMessage={treeErrorMessage} />
                    </div>
                }
                { !treeIsLoading && !treeErrorMessage && 
                    <div className='mt-3 w-50 ml-0 mr-0 mx-auto' data-testid='dSkillTree'>
                        {state.skillTree.length > 0 &&
                            <>
                                { treeMode !== 'select' &&
                                    <Button className='m-3' size='sm' variant='outline-secondary' onClick={() => changeAllSelected(true)}>Select all</Button>
                                }
                                <Button className='m-3' size='sm' variant='outline-secondary' onClick={() => changeAllSelected(false)}>Unselect all</Button>

                                <Tree treeNodes={state.skillTree} />

                                {treeOperationErrorMessage && 
                                    <div className='mt-3 w-90 ml-0 mr-0 mx-auto text-center'>
                                        <AlertMessage errorMessage={treeOperationErrorMessage} />
                                    </div>
                                }

                                { treeMode === 'admin' &&
                                    <>
                                        <Button className='mx-2 mt-3 mb-4' variant='primary' onClick={ () => handleStatusChange('ENABLE', state.skillTree, dispatch, setTreeOperationErrorMessage) }>Enable</Button>
                                        <Button className='mx-2 mt-3 mb-4' variant='secondary' onClick={ () => handleStatusChange('DISABLE', state.skillTree, dispatch, setTreeOperationErrorMessage) }>Disable</Button>

                                        <ModalConfirmation
                                            icon={<Button className='mx-2 mt-3 mb-4' variant='danger'>Delete</Button>} 
                                            message='Are you sure to delete the skill(s)?'
                                            id={state.skillTree}
                                            handleOperation={handleDelete}
                                            dispatch={dispatch} />
                                    </>
                                }
                                { treeMode === 'select' &&
                                    <>
                                        <Button className='mx-2 mt-3 mb-4' variant='primary' onClick={() => handleSelect(state.skillTree)}>Select</Button>
                                        <Button className='mx-2 mt-3 mb-4' variant='secondary' onClick={handleClose}>Close</Button>
                                    </>
                                }
                            </>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default SkillTree