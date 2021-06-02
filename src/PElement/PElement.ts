let elID = 1

export abstract class PElement<CHILD extends PElement<any>> {

    readonly id = `el-${elID++}`

    readonly tag: EL_TAGS = EL_TAGS.UNKNOW

    offset = { x: 0, y: 0 }

    // parent: null|PElement<any> = null

    protected children: CHILD[] = []

    addChild(child: CHILD): CHILD {
      this.children.push(child)
      return child
    }

    removeChild(id: string): void {
      const index = this.children.findIndex( ({id:_id}) =>  id === _id )
      if(index > -1)  this.children.splice(index, 1)
    }

    getChildren() {
      return this.children
    }

}

export enum EL_TAGS {

    PANNEL,

    LAYER,

    BRUSH,

    // UNKNOW,

}

export interface ElConstructor {
  new () : PElement<any>
} 