import { PannelEl } from "../PElement/PannelEl";
import { Operate, OperateData, OperateType } from "./Operate";

export class Recorder {

  private operateList: Operate<OperateType>[] = []

  private curIndex = -1

  private rootEl: PannelEl|null = null


  protected operateHandle: { [ opType in OperateType ]: { 
    do: (operate: Operate<OperateType>) => void
    revert: (operate: Operate<OperateType>) => void
   }} = {
      'addBrush': {
        do: (operate: Operate<OperateType>) => {
          const data = operate.data as OperateData['addBrush']
          const layer = this.rootEl?.getChildren().find((id) => data.targetLayerId)
          layer?.addChild(data.brushEl)
        },
        revert: (operate: Operate<OperateType>) => {
          const data = operate.data as OperateData['addBrush']
          const layer = this.rootEl?.getChildren().find((id) => data.targetLayerId)
          const brushList = layer?.getChildren()
          if (!brushList) return
          const brushIndex = brushList.findIndex( brushEl =>  brushEl === data.brushEl)
          if (brushIndex > -1) brushList.splice(brushIndex, 1)
        }
      }
  }

  init(pannelEl: PannelEl) {
    this.rootEl = pannelEl
  }

  undo(): boolean {
    if (this.curIndex < 0) return false
    const operate = this.operateList[this.curIndex--]
    this.operateHandle[operate.type].revert(operate)
    return true
  }

  redo():boolean {
    if (this.curIndex >= this.operateList.length -1) return false
    const operate = this.operateList[++this.curIndex]
    this.operateHandle[operate.type].do(operate)
    return true
  }

  addOperate(operate: Operate<OperateType> ) {
    this.operateList.splice(this.curIndex+1)
    this.operateList.push(operate)
    this.curIndex = this.operateList.length -1
  }

}