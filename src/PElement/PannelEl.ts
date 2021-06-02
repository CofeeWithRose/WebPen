import { LayerEl } from "./LayerEl"
import { EL_TAGS, PElement } from "./PElement"

export type PannelElChild = LayerEl

export class PannelEl extends PElement<PannelElChild> {

    readonly tag = EL_TAGS.PANNEL

    activeLayerId = ''

    width = 0

    height = 0

    getActiveLayer() {
        return this.children.find( ({id}) => id === this.activeLayerId )
    }

    addChild(child: PannelElChild) {
        if(!this.activeLayerId) this.activeLayerId = child.id
        return super.addChild(child)
    }


}