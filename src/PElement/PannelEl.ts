import { LayerEl } from "./LayerEl"
import { EL_TAGS, PElement } from "./PElement"

export type PannelElChild = LayerEl

export class PannelEl extends PElement<PannelElChild> {

    readonly tag = EL_TAGS.LAYER

}