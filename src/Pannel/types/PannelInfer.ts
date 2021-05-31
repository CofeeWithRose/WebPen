import { BrushConstructor, BrushInfer } from "../../Brush/types/PenInfer";
import { PannelEl } from "../../PElement/PannelEl";


/**
 * 画板.
 */
export  interface PannelInfer {

    /**
     * 设置当前画笔类型.
     * @param peninfer 
     */
    useBrush(peninfer: BrushConstructor ): Promise<BrushInfer>


    /**
     * 加载作品.
     * @param pannelEl 
     */
    load(pannelEl: PannelEl): Promise<void>

}

