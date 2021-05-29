import { PenStateInfer, PenTrackData, PEN_TYPES } from "../../Pen/types/PenInfer";
import { LayerId } from "./LayerActionData";

export interface DrawActionData {

    /**
     * 画笔类型.
     */
    penType: PEN_TYPES
    
    /**
     * 画笔版本.
     */
    version: string

    /**
     * 作用的layerId.
     */
    layerId: LayerId

    penState: PenStateInfer
    
    /**
     * 画笔移动数据.
     */
    data: PenTrackData[]
}