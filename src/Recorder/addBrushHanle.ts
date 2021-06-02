import { PannelEl } from "../PElement/PannelEl"
import { Operate, OperateData, OperateHandle, OperateType } from "./Operate"

export const addBrushHandle: OperateHandle = {

  do: (rootEl: PannelEl, operate: Operate<OperateType>) => {
    const data = operate.data as OperateData['addBrush']
    const layer = rootEl.getChildren().find(({id}) => data.targetLayerId === id)
    layer?.addChild(data.brushEl)
  },

  revert: (rootEl: PannelEl,operate: Operate<OperateType>) => {
    const data = operate.data as OperateData['addBrush']
    const layer = rootEl.getChildren().find(({id}) => data.targetLayerId === id)
    const brushList = layer?.getChildren()
    if (!brushList) return
    const brushIndex = brushList.findIndex( brushEl =>  brushEl === data.brushEl)
    if (brushIndex > -1) brushList.splice(brushIndex, 1)
  }

}