import { defaultState } from "../Brush/Pen";
import { BrushConstructor, BrushState, BRUSH_TYPES } from "../Brush/types/PenInfer";
import { PannelEl } from "../PElement/PannelEl";
import { PannelInfer, PannelOptions } from "./types/PannelInfer";

export class Pannel implements PannelInfer {

    brushState: BrushState = defaultState;

    brushType: BRUSH_TYPES|string = BRUSH_TYPES.PEN;

    pannelEl: PannelEl|null = null

    constructor(container:HTMLElement, opt: PannelOptions) {}

    async load(pannelEl: PannelEl): Promise<void> {
      this.pannelEl = pannelEl
    }

    useBrush(brushType: string | BRUSH_TYPES): void {
      this.brushType = brushType
    }

    registBrush(brushType: string, brush: BrushConstructor): void {
      throw new Error("Method not implemented.");
    }

    


}