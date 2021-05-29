import { PenConstructor, PenInfer } from "../Pen/types/PenInfer";
import { Work } from "./Work";

/**
 * 画板.
 */
export  interface PenPannel {

    /**
     * 设置当前画笔类型.
     * @param peninfer 
     */
    usePen(peninfer: PenConstructor ): Promise<PenInfer>

    /**
     * 获取作品.
     */
    getWork(): Promise<Work>

    /**
     * 加载作品.
     * @param work 
     */
    loadWork(work:Work): Promise<void>

}

