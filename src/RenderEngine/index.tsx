import { BrushEl } from "../PElement/BrushEl";
import { PannelEl } from "../PElement/PannelEl";

export interface RenderEnginOpt {
  width: number,
  height: number
}

export const defaultOpt: RenderEnginOpt = {
  width: 800,
  height: 800,
}
export class RenderEngin {

  root: PannelEl| null = null

  private scroller: HTMLDivElement = document.createElement('div')

  private topCanvas: HTMLCanvasElement = document.createElement('canvas')

  private bottomCanvas: HTMLCanvasElement = document.createElement('canvas')

  private activeCanvas: HTMLCanvasElement = document.createElement('canvas')

  constructor(view: HTMLElement, opt: RenderEnginOpt) {
    opt= { ...defaultOpt, ...opt }
    view.appendChild(this.scroller)
    this.scroller.style.width = `${opt.width}px`
    this.scroller.style.height = `${opt.height}px`
    this.topCanvas.width = opt.width
    this.topCanvas.height = opt.height
    
    this.bottomCanvas.width = opt.width
    this.bottomCanvas.height = opt.height

    this.activeCanvas.width = opt.width
    this.activeCanvas.height = opt.height
  }

  async load(root: PannelEl): Promise<void> {
    this.root = root
  }

  async renderTree(): Promise<void> {
    if (!this.root) return
    const activeLayerId = this.root.activeLayerId
    const layers = this.root.getChildren()
    let isTop = true
    layers.forEach((layerEl) => {
      if(layerEl.id === activeLayerId) {

      } 
    })

  }

  private async renderBrushes(
    tagetCanvas: HTMLCanvasElement, 
    brushELList: BrushEl[]
  ):  Promise<void> {

  }

}