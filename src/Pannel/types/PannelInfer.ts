import { BrushConstructor, BrushInfer, BrushState, BRUSH_TYPES } from "../../Brush/types/PenInfer";
import { PannelEl } from "../../PElement/PannelEl";


/**
 * 画板.
 */
export  interface PannelInfer {

    readonly brushState: BrushState
    
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
    load(pannelEl?: PannelEl|string|null): Promise<void>

    toJson(): Promise<string>

    parse(json: string): Promise<PannelEl>

}


export interface PannelOptions {

  width : number, 
  height: number
}

