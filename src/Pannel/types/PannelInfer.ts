import { BrushState, BRUSH_TYPES } from "../../Brush/types/PenInfer";
import { PannelEl } from "../../PElement/PannelEl";


/**
 * 画板.
 */
export  interface PannelInfer {

    readonly brushState: BrushState
    
    /**
     * 当前画笔类型
     */
    brushType: string | BRUSH_TYPES 

    // registBrush(brushType: string, brush: BrushConstructor): void

    /**
     * 加载作品.
     * @param pannelEl 
     */
    load(pannelEl?: PannelEl|string|null): Promise<void>

    /**
     * 序列化.
     */
    toJson(): Promise<string>

    /**
     * 反序列化.
     * @param json 
     */
    parse(json: string): Promise<PannelEl>

    undo(): void

    redo(): void

}


export interface PannelOptions {

  width : number, 
  height: number
}

