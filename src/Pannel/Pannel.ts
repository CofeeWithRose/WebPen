import { defaultState } from "../Brush/Pen";
import { BrushConstructor, BrushState, BRUSH_TYPES } from "../Brush/types/PenInfer";
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
      this.renderEngin = new RenderEngin(container, this.size)
      this.input = new Input(this.renderEngin.cover, this.brushState)
      this.input.onBegin = this.onInputBegin
      this.input.onUpdate = this.onInputUpdate
      this.input.onEnd = this.onInputEnd
      this.recorder = new Recorder()

    }

    redo() {
      if (this.recorder.redo())this.renderEngin.renderTree()
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

   

    private onInputBegin = (brushEl: BrushEl) => {
      if (!this.pannelEl) return
      const activeLayer = this.pannelEl?.getActiveLayer()
      activeLayer?.addChild(brushEl)
      this.renderEngin.renderBrsuh(brushEl)
    }

    private onInputUpdate = (brushEl: BrushEl) => {
      this.renderEngin.renderBrsuh(brushEl)
    }

    private onInputEnd = (brushEl: BrushEl) => {
      if (!this.pannelEl) return
      this.renderEngin.submitActiveLayer()
      this.recorder.addOperate( { 
        type: 'addBrush', 
        data: { 
          targetLayerId: this.pannelEl.activeLayerId,
          brushEl
        } 
      })
      // console.log(JSON.stringify(this.pannelEl));
    }



    useBrush(brushType: string | BRUSH_TYPES): void {
      this.brushType = brushType
    }

    registBrush(brushType: string, brush: BrushConstructor): void {
      throw new Error("Method not implemented.");
    }

    


}