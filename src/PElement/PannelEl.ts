import { BrushEl } from "./BrushEl"
import { LayerEl } from "./LayerEl"
import { EL_TAGS, PElement } from "./PElement"

export type PannelElChild = LayerEl

export class PannelEl extends PElement<PannelElChild> {

    readonly tag = EL_TAGS.PANNEL

    activeLayerId = ''

    width = 0

    height = 0

    name: string 

    constructor() {
      super()
      this.name =  `default-${this.id}`
    }


    addChild(child: PannelElChild): PannelElChild {
        if(!this.activeLayerId) this.activeLayerId = child.id
        return super.addChild(child)
    }

    addBrush(brushEl: BrushEl, layerId=this.activeLayerId): BrushEl|null {
      if(!layerId) return null
      const layer = this.children.find( ({id}) => id === layerId )
      if (!layer) return null
      layer.addChild(brushEl)
      return brushEl
    }

    removeBrush(brushEl: BrushEl, layerId=this.activeLayerId): BrushEl|null {
      if(!layerId) return null
      const layer = this.children.find( ({id}) => id === layerId )
      if (!layer) return null
      const brushList = layer.getChildren()
      const brushIndex = brushList.findIndex( _brushEl => _brushEl === brushEl)
      if (brushIndex > -1) brushList.splice(brushIndex, 1)
      return brushEl
    }

}