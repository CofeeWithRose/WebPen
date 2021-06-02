import { PannelEl } from "../PElement/PannelEl";
import { addBrushHandle } from "./addBrushHanle";
import { Operate, OperateHandleMap, OperateType } from "./Operate";

export class Recorder {

  private operateList: Operate<OperateType>[] = []

  private curIndex = -1

  private rootEl: PannelEl|null = null

  protected operateHandle: OperateHandleMap = {
    'addBrush': addBrushHandle
  }

  init(pannelEl: PannelEl) {
    this.rootEl = pannelEl
  }

  undo(): boolean {
    if (! this.rootEl) return false
    if (this.curIndex < 0) return false
    const operate = this.operateList[this.curIndex--]
    this.operateHandle[operate.type].revert( this.rootEl,  operate)
    return true
  }

  redo():boolean {
    if (! this.rootEl) return false
    if (this.curIndex >= this.operateList.length -1) return false
    const operate = this.operateList[++this.curIndex]
    this.operateHandle[operate.type].do(this.rootEl, operate)
    return true
  }

  addOperate(operate: Operate<OperateType> ) {
    this.operateList.splice(this.curIndex+1)
    this.operateList.push(operate)
    this.curIndex = this.operateList.length -1
  }

}