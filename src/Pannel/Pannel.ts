import { defaultState } from "../Brush/Pen";
import { BrushState, BRUSH_TYPES } from "../Brush/types/PenInfer";
import { Input } from "../Input";
import { createEmpty, parseEl, stringifyEl } from "../PElement";
import { BrushEl } from "../PElement/BrushEl";
import { LayerEl } from "../PElement/LayerEl";
import { PannelEl } from "../PElement/PannelEl";
import { Recorder } from "../Recorder";
import { RenderEngin } from "../RenderEngine";
import { PannelInfer, PannelOptions } from "./types/PannelInfer";

export class Pannel implements PannelInfer {

    readonly  brushState: BrushState = defaultState;

    brushType: BRUSH_TYPES|string = BRUSH_TYPES.PEN;

    protected pannelEl: PannelEl|null = null

    protected renderEngin: RenderEngin

    protected input: Input

    protected recorder: Recorder

    protected size: { width: number, height: number }

    constructor(container:HTMLElement, _opt?: PannelOptions) {
      this.size = { width: 800, height: 800, ..._opt}
      container.addEventListener('touchstart', e => e.preventDefault())
      this.renderEngin = new RenderEngin(container, this.size)
      this.input = new Input(this.renderEngin.cover, this.brushState)
      this.input.onBegin = this.onInputBegin
      this.input.onUpdate = this.onInputUpdate
      this.input.onEnd = this.onInputEnd
      this.recorder = new Recorder()
    }

    redo() {
      if (this.recorder.redo()) this.renderEngin.renderTree()
    }

    undo() {
      if (this.recorder.undo()) this.renderEngin.renderTree()
    }

    async toJson(): Promise<string> {
      return stringifyEl(this.pannelEl)
    }
    
    async parse(json: string): Promise<PannelEl> {
      const el = parseEl(json)
      return el? el : createEmpty(this.size.width, this.size.height)
    }

    async load(pannelEl?: PannelEl|string|null): Promise<void> {
      if ( typeof pannelEl === 'string' ) {
        pannelEl = await this.parse(pannelEl)
      }
      this.pannelEl = pannelEl? pannelEl : createEmpty(this.size.width, this.size.height)
      this.renderEngin.load(this.pannelEl)
      this.recorder.init(this.pannelEl)
    }

    protected onInputBegin = (brushEl: BrushEl) => {
      if (!this.pannelEl) return
      this.pannelEl.addBrush(brushEl)
      this.renderEngin.renderRealTime(brushEl)
    }

    protected onInputUpdate = (brushEl: BrushEl) => {
      this.renderEngin.renderRealTime(brushEl)
    }

    protected onInputEnd = (brushEl: BrushEl) => {
      if (!this.pannelEl) return
      this.renderEngin.submitRealTime()
      this.recorder.addOperate( { 
        type: 'addBrush', 
        data: { 
          targetLayerId: this.pannelEl.activeLayerId,
          brushEl
        } 
      })
    }

}