let elID = 1

export abstract class PElement<CHILD> {

    readonly id = `el-${elID++}`

    readonly tag: EL_TAGS = EL_TAGS.UNKNOW

    offset = { x: 0, y: 0 }

    private _children: CHILD[] = []

    addChild(child: CHILD): void {
        this._children.push(child)
    }

}

export enum EL_TAGS {

    PANNEL,

    LAYER,

    BRUSH,

    UNKNOW,

}