import { Color } from "../../Color";

/**
 * 画笔.
 */
export interface BrushInfer {

   /**
    * 画笔状态.
    */
   state: BrushState
  
}

/**
 * 画笔状态.
 */
export interface BrushState {

   /**
    * 画笔颜色.
    */
  color: Color

  /**
   * 画笔粗细.
   */
  width: number

}

export interface BrushConstructor {
   new (): BrushInfer
}

export interface BrushTrackData {

   position: {x: number, y: number }

   press: number
}

export enum BRUSH_TYPES {

   PEN='PEN',
   
}
