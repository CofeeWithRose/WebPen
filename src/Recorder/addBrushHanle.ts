import { PannelEl } from "../PElement/PannelEl"
import { Operate, OperateData, OperateHandle, OperateType } from "./Operate"

export const addBrushHandle: OperateHandle = {

  do: (rootEl: PannelEl, operate: Operate<OperateType>) => {
    const data = operate.data as OperateData['addBrush']
    rootEl.addBrush(data.brushEl, data.targetLayerId)
  },

  revert: (rootEl: PannelEl,operate: Operate<OperateType>) => {
    const data = operate.data as OperateData['addBrush']
    rootEl.removeBrush(data.brushEl, data.targetLayerId)
  }

}