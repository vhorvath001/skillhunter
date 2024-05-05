export default class TreeNode {

    private _id?: string
    private _name: string | null
    private _parent: TreeNode | null
    private _score: number | null
    private _progLangId: number | null
    private _children: TreeNode[]

    constructor(_name: string | null, _parent: TreeNode | null, _score: number | null, _progLangId: number | null) {
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

    addScore(_score: number): void {
        this._score = (this._score ?? 0) + _score;
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

    get score(): number | null {
        return this._score
    }

    get id(): string | undefined {
        return this._id
    }

    set id(_id: string) {
        this._id = _id
    }
}