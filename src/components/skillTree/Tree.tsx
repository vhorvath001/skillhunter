import { ReactElement } from 'react';
import TreeElement from './TreeElement';
import { SkillTreeNodeType } from '../../context/SkillTreeProvider';

type PropsType = {
    treeNodes: SkillTreeNodeType[]
}

const Tree = ({ treeNodes }: PropsType): ReactElement => {
    return (
        <ul>
            {treeNodes.map(n => (
                <TreeElement node={n} key={n.id} />
            ))}
        </ul>
    )
}

export default Tree