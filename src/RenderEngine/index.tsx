import { BrushEl } from "../PElement/BrushEl";
import { PannelEl } from "../PElement/PannelEl";
import { Renderer } from "./Renderer";

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

  protected renderer: Renderer

  constructor(view: HTMLElement, opt: RenderEnginOpt) {
    opt= { ...defaultOpt, ...opt }
    this.scroller.style.width = `${opt.width}px`
    this.scroller.style.height = `${opt.height}px`
    this.topCanvas.width = opt.width
    this.topCanvas.height = opt.height
    
    this.bottomCanvas.width = opt.width
    this.bottomCanvas.height = opt.height

    this.activeCanvas.width = opt.width
    this.activeCanvas.height = opt.height

    this.scroller.appendChild(this.bottomCanvas)
    this.scroller.appendChild(this.activeCanvas)
    this.scroller.appendChild(this.topCanvas)
    view.appendChild(this.scroller)

    this.renderer = new Renderer(opt.width, opt.height)
  }

  async load(root: PannelEl): Promise<void> {
    this.root = root
    this.renderTree()
  }

  async renderTree(): Promise<void> {
    if (!this.root) return
    const activeLayerId = this.root.activeLayerId
    const layers = this.root.getChildren()
    let targetCanvas = this.topCanvas
    layers.forEach((layerEl) => {
      if(layerEl.id === activeLayerId) {
        this.renderBrushes( this.activeCanvas, layerEl.getChildren() )
        targetCanvas = this.bottomCanvas
      } 
      this.renderBrushes( targetCanvas, layerEl.getChildren() )
    })

  }

  private async renderBrushes(
    tagetCanvas: HTMLCanvasElement, 
    brushELList: BrushEl[]
  ):  Promise<void> {
    const ctx = tagetCanvas.getContext('2d')
    if (!ctx) return
    this.renderer.clear()
    brushELList.forEach( brushEl => this.renderer.renderBrush(brushEl) )
    ctx.drawImage(this.renderer.canvas, 0, 0)
  }

}