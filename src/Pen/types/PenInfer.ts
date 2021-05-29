import { Color } from "../../types/Color";

/**
 * 画笔.
 */
export interface PenInfer {
   state: PenStateInfer
  
}

export interface PenStateInfer {
   /**
    * 画笔颜色.
    */
  color: Color

  /**
   * 画笔粗细.
   */
  width: number

}

export interface PenConstructor {
   new (): PenInfer
}

export interface PenTrackData {

   position: {x: number, y: number }

   press: number
}

export enum PEN_TYPES {

   PEN
}
