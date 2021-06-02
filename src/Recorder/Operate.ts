import { BrushEl } from "../PElement/BrushEl";


export interface OperateData {

  addBrush: { targetLayerId: string, brushEl: BrushEl  }

}

export type OperateType = keyof OperateData

export interface Operate<T extends OperateType> {

  type: T

  data: OperateData[T]

}