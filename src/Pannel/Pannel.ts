import { defaultState } from "../Brush/Pen";
import { BrushConstructor, BrushState, BRUSH_TYPES } from "../Brush/types/PenInfer";
import { Input } from "../Input";
import { BrushEl } from "../PElement/BrushEl";
import { LayerEl } from "../PElement/LayerEl";
import { PannelEl } from "../PElement/PannelEl";
import { RenderEngin } from "../RenderEngine";
import { PannelInfer, PannelOptions } from "./types/PannelInfer";

export class Pannel implements PannelInfer {

    brushState: BrushState = defaultState;

    brushType: BRUSH_TYPES|string = BRUSH_TYPES.PEN;

    pannelEl: PannelEl|null = null

    renderEngin: RenderEngin

    input: Input

    constructor(container:HTMLElement, opt?: PannelOptions) {
      opt = { width: 800, height: 800, ...opt}
      this.renderEngin = new RenderEngin(container, opt)
      this.input = new Input(this.renderEngin.cover)
      this.input.onBegin = this.onInputBegin
      this.input.onUpdate = this.onInputUpdate
    }

    async load(pannelEl?: PannelEl): Promise<void> {
      this.pannelEl = pannelEl? pannelEl : this.createEmpty()
      this.renderEngin.load(this.pannelEl)
    }

    private createEmpty() {
      const root = new PannelEl()
      root.addChild(new LayerEl())
      return root
    }

    private onInputBegin = (brushEl: BrushEl) => {
      if (!this.pannelEl) return
      const activeLayer = this.pannelEl?.getActiveLayer()
      activeLayer?.addChild(brushEl)
      this.renderEngin.renderTree()
    }

    private onInputUpdate = () => {
      this.renderEngin.renderTree()
    }



    useBrush(brushType: string | BRUSH_TYPES): void {
      this.brushType = brushType
    }

    registBrush(brushType: string, brush: BrushConstructor): void {
      throw new Error("Method not implemented.");
    }

    


}