import { PannelEl } from "../PElement/PannelEl";
import { addBrushHandle } from "./addBrushHanle";
import { Operate, OperateHandleMap, OperateType } from "./Operate";
import { EventEmitter } from 'events'

export interface UpdateInfo {
  hasRedo: boolean
  hasUndo: boolean
}

export interface RecorderEvent {

  update: (info: UpdateInfo) => void

}
export class Recorder {

  private operateList: Operate<OperateType>[] = []

  private curIndex = -1

  private rootEl: PannelEl|null = null

  private size = 100

  private eventEmitter = new EventEmitter()

  protected operateHandle: OperateHandleMap = {
    'addBrush': addBrushHandle
  }

  init(pannelEl: PannelEl) {
    this.rootEl = pannelEl
  }

  on<EventName extends keyof RecorderEvent>( name: EventName, listener: RecorderEvent[EventName] ) {
    this.eventEmitter.addListener(name, listener)
  }

  off<EventName extends keyof RecorderEvent>( name: EventName, listener: RecorderEvent[EventName] ) {
    this.eventEmitter.removeListener(name, listener)
  }

  protected  emit<EventName extends keyof RecorderEvent>( name: EventName, ...params: Parameters<RecorderEvent[EventName]> ) {
    this.eventEmitter.emit(name, ...params)
  }

  undo(): boolean {
    if (! this.rootEl) return false
    if (this.curIndex < 0) return false
    const operate = this.operateList[this.curIndex--]
    this.operateHandle[operate.type].revert( this.rootEl,  operate)
    this.emit('update', this.getUpdateInfo())
    return true
  }

  protected getUpdateInfo(): UpdateInfo {
    return {
      hasUndo: this.curIndex > -1,
      hasRedo: this.curIndex < this.operateList.length -1
    }
  }

  redo():boolean {
    if (! this.rootEl) return false
    if (this.curIndex >= this.operateList.length -1) return false
    const operate = this.operateList[++this.curIndex]
    this.operateHandle[operate.type].do(this.rootEl, operate)
    this.emit('update', this.getUpdateInfo())
    return true
  }

  addOperate(operate: Operate<OperateType> ) {
    this.operateList.splice(this.curIndex+1)
    this.operateList.push(operate)
    const extraCount = this.operateList.length - this.size
    if ( extraCount > 0) this.operateList.splice(0, extraCount)
    this.curIndex = this.operateList.length -1
    this.emit('update', this.getUpdateInfo())
  }

}