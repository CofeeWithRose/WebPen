import { BrushConstructor, BrushInfer, BrushState, BRUSH_TYPES } from "../../Brush/types/PenInfer";
import { PannelEl } from "../../PElement/PannelEl";


/**
 * 画板.
 */
export  interface PannelInfer {

    brushState: BrushState
    
    brushType: string

    /**
     * 设置当前画笔类型.
     * @param peninfer 
     */
    useBrush( brushType: BRUSH_TYPES|string ): void

    registBrush(brushType: string, brush: BrushConstructor): void

    /**
     * 加载作品.
     * @param pannelEl 
     */
    load(pannelEl: PannelEl): Promise<void>

}


export interface PannelOptions {

  size: { w : number, h: number }
}

