export type ScoreType = {
    score: number,
    developerId: number
}

export default class TreeNode {

    private _id?: string
    private _name: string | null
    private _parent: TreeNode | null
    private _score: ScoreType[]
    private _progLangId: number | null
    private _children: TreeNode[]

    constructor(_name: string | null, _parent: TreeNode | null, _score: ScoreType[], _progLangId: number | null) {
        this._name = _name;
        this._score = _score;
        this._children = [];
        this._parent = _parent;
        if (_parent)
            this._parent!.addToChildren(this)
        this._progLangId = _progLangId;
    }

    hasPackage(packageName: string): boolean {
        return this._children?.find(e => e._name === packageName) ? true : false;
    }

    addToChildren(node: TreeNode): void {
        this._children?.push(node);
    }

    getChild(packageName: string): TreeNode | undefined {
        return this._children?.find(e => e._name === packageName);
    }

    addScore(_score: number, _developerId: number): void {
        const found: ScoreType[] = this._score.filter(s => s.developerId === _developerId)
        if (found.length > 0)
            found[0].score = found[0].score + _score
        else
            this._score.push({
                score: _score,
                developerId: _developerId
            })
    }

    get children(): TreeNode[] {
        return this._children;
    }

    set children(_children: TreeNode[]) {
        this._children = _children;
    }

    get name(): string | null {
        return this._name
    }

    set name(_name: string) {
        this._name = _name
    }

    get progLangId(): number | null {
        return this._progLangId
    }

    get score(): ScoreType[] {
        return this._score
    }

    get id(): string | undefined {
        return this._id
    }

    set id(_id: string) {
        this._id = _id
    }
}