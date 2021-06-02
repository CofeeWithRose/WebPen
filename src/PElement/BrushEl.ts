import { BRUSH_TYPES, BrushState, BrushTrackData } from "../Brush/types/PenInfer";
import { Color } from "../Color";
import { EL_TAGS, PElement } from "./PElement";

export class BrushEl extends PElement<never> {

    readonly tag = EL_TAGS.BRUSH

    brushType: BRUSH_TYPES = BRUSH_TYPES.UNKNOW

    readonly  state: BrushState = { width:10, color: new Color() }

    data: BrushTrackData[]= []

    nextData: BrushTrackData[]= []

}
