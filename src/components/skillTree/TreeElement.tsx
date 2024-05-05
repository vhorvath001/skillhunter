import { ChangeEvent, ReactElement, useState } from 'react';
import Tree from './Tree';
import { SkillTreeNodeType } from '../../context/SkillTreeProvider';

type PropsType = {
    node: SkillTreeNodeType
}

const TreeElement = ({ node }: PropsType): ReactElement => {
    const [ showChildren, setShowChildren ] = useState<boolean>(false)
    
    const handleClick = (): void => {
        setShowChildren(!showChildren)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        node.selected = e.currentTarget.checked
    }

    return (
        <>
            <div style={{ marginBottom: "10px" }}>
            <i className="bi bi-x-octagon" title='The skill is disabled'></i>
                <span className={node.children.length > 0 ? (showChildren ? 'caret caret-down' : 'caret') : 'caret-no-children'}>
                    <input type='checkbox' onChange={handleChange} id={'cb_selected_'+node.id} />
                    <label className={(node.children.length > 0 ? 'treeLabel pointer' : 'treeLabel')+(!node.enabled ? ' disabledSkill' : '')} onClick={handleClick}>{node.name} ({node.children.length})</label>
                    {!node.enabled && <label className='disabledSkill' title='The skill is disabled.'> &#9746;</label>}
                </span>
            </div>
            <ul style={{ paddingLeft: "10px", borderLeft: "1px solid black" }}>
                {showChildren && <Tree treeNodes={node.children} />}
            </ul>
        </>
    )
}

export default TreeElement