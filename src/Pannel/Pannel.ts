import { defaultState } from "../Brush/Pen";
import { BrushConstructor, BrushState, BRUSH_TYPES } from "../Brush/types/PenInfer";
import { Input } from "../Input";
import { createEmpty, parseEl, stringifyEl } from "../PElement";
import { BrushEl } from "../PElement/BrushEl";
import { LayerEl } from "../PElement/LayerEl";
import { PannelEl } from "../PElement/PannelEl";
import { RenderEngin } from "../RenderEngine";
import { PannelInfer, PannelOptions } from "./types/PannelInfer";

export class Pannel implements PannelInfer {

    readonly  brushState: BrushState = defaultState;

    brushType: BRUSH_TYPES|string = BRUSH_TYPES.PEN;

    protected pannelEl: PannelEl|null = null

    renderEngin: RenderEngin

    input: Input

    constructor(container:HTMLElement, opt?: PannelOptions) {
      opt = { width: 800, height: 800, ...opt}
      this.renderEngin = new RenderEngin(container, opt)
      this.input = new Input(this.renderEngin.cover, this.brushState)
      this.input.onBegin = this.onInputBegin
      this.input.onUpdate = this.onInputUpdate
      this.input.onEnd = this.onInputEnd
    }

    async toJson(): Promise<string> {
      return stringifyEl(this.pannelEl)
    }
    
    async parse(json: string): Promise<PannelEl> {
      return parseEl(json)
    }

    async load(pannelEl?: PannelEl|string|null): Promise<void> {
     
      if ( typeof pannelEl === 'string' ) {
        pannelEl = await this.parse(pannelEl)
      }
      this.pannelEl = pannelEl? pannelEl : createEmpty()
      this.renderEngin.load(this.pannelEl)
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

    private onInputEnd = () => {
      this.renderEngin.submitActiveLayer()
      // console.log(JSON.stringify(this.pannelEl));
    }



    useBrush(brushType: string | BRUSH_TYPES): void {
      this.brushType = brushType
    }

    registBrush(brushType: string, brush: BrushConstructor): void {
      throw new Error("Method not implemented.");
    }

    


}