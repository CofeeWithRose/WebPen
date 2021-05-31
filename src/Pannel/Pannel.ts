import { BrushConstructor, BrushInfer } from "../Brush/types/PenInfer";
import { PannelInfer } from "./types/PannelInfer";

export class Pannel implements PannelInfer {

    private brush: null|BrushInfer = null

    

    async load() {

    }

    async useBrush(BrushConstructor: BrushConstructor): Promise<BrushInfer> {
        this.brush =  new BrushConstructor()
        return this.brush
    }

}