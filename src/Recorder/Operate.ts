import { BrushEl } from "../PElement/BrushEl";
import { PannelEl } from "../PElement/PannelEl";


export interface OperateData {

  addBrush: { targetLayerId: string, brushEl: BrushEl  }

}

export type OperateType = keyof OperateData

export interface Operate<T extends OperateType> {

  type: T

  data: OperateData[T]

}

export type OperateHandle = { 
  do: ( rootEl: PannelEl,  operate: Operate<OperateType>) => void
  revert: ( rootEl: PannelEl, operate: Operate<OperateType>) => void
 }

export  type  OperateHandleMap  = { [ opType in OperateType ]:  OperateHandle }