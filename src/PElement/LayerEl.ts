import { BrushEl } from "./BrushEl";
import { EL_TAGS, PElement } from "./PElement";

export type LayerElChild = BrushEl

export class LayerEl extends PElement<LayerElChild> {

    readonly tag = EL_TAGS.LAYER


}