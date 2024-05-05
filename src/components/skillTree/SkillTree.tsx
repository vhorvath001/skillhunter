import { Form } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import useSkillTree from '../../hooks/useSkillTree'
import { ChangeEvent } from 'react'
import Tree from './Tree'
import Loading from '../../utils/Loading'
import AlertMessage from '../../utils/AlertMessage'
import Button from 'react-bootstrap/Button'
import { SkillTreeNodeType } from '../../context/SkillTreeProvider'

const SkillTree = () => {
    const { dispatch, state, progLangs, setSelectedProgLang, isLoading, treeIsLoading, fetchError, treeErrorMessage, handleStatusChange, handleDelete} = useSkillTree()

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

    return (
        <div className='admin-container'>
            <div className='page-title text-center'>Skill Tree</div>

            <div className='loadingParent container'>
                { isLoading && <Loading /> }
                { !isLoading && fetchError && 
                    <div className='mt-3 w-50 ml-0 mr-0 mx-auto text-center'>
                        <AlertMessage errorMessage={fetchError} />
                    </div>
                }
                { !isLoading && !fetchError &&
                    <div className='mt-3 w-50 ml-0 mr-0 mx-auto text-center'>
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

                { treeIsLoading && <Loading />}
                { !treeIsLoading && treeErrorMessage && 
                    <div className='mt-3 w-50 ml-0 mr-0 mx-auto text-center'>
                        <AlertMessage errorMessage={treeErrorMessage} />
                    </div>
                }
                { !treeIsLoading && !treeErrorMessage && 
                    <div className='mt-3 w-50 ml-0 mr-0 mx-auto '>
                        {state.skillTree.length > 0 &&
                            <>
                            <Button className='m-3' size='sm' variant='outline-secondary' onClick={() => changeAllSelected(true)}>Select all</Button>
                            <Button className='m-3' size='sm' variant='outline-secondary' onClick={() => changeAllSelected(false)}>Unselect all</Button>
                            <Tree treeNodes={state.skillTree} />
                            <Button className='mx-2 mt-3 mb-4' variant='primary' onClick={ () => handleStatusChange('ENABLE', state.skillTree, dispatch) }>Enable</Button>
                            <Button className='mx-2 mt-3 mb-4' variant='secondary' onClick={ () => handleStatusChange('DISABLE', state.skillTree, dispatch) }>Disable</Button>
                            <Button className='mx-2 mt-3 mb-4' variant='danger' onClick={() => handleDelete(state.skillTree, dispatch)}>Delete</Button>
                            </>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default SkillTree