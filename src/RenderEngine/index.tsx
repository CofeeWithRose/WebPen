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

  readonly cover: HTMLDivElement = document.createElement('div')

  protected renderer: Renderer

  constructor(view: HTMLElement, opt: RenderEnginOpt) {
    opt= { ...defaultOpt, ...opt }
    const width = opt.width/window.devicePixelRatio
    const height = opt.height/window.devicePixelRatio
    this.scroller.style.width = `${width}px`
    this.scroller.style.height = `${height}px`
    this.topCanvas.width = opt.width
    this.topCanvas.height = opt.height
    
    this.bottomCanvas.width = opt.width
    this.bottomCanvas.height = opt.height

    this.activeCanvas.width = opt.width
    this.activeCanvas.height = opt.height

    this.cover.style.width=`${width}px`
    this.cover.style.height=`${height}px`
    this.cover.style.background= '#808080'
    this.cover.style.opacity= '0.1'
    this.cover.style.touchAction = 'none'

    this.scroller.appendChild(this.bottomCanvas)
    this.scroller.appendChild(this.activeCanvas)
    this.scroller.appendChild(this.topCanvas)
    this.scroller.appendChild(this.cover)

    this.setLayoutStyle(this.bottomCanvas, width, height)
    this.setLayoutStyle(this.activeCanvas, width, height)
    this.setLayoutStyle(this.topCanvas, width, height)
    this.setLayoutStyle(this.cover, width, height)
   

    view.appendChild(this.scroller)

    this.renderer = new Renderer(opt.width, opt.height)
  }

  private setLayoutStyle(el:HTMLElement, w: number, h: number) {
    el.style.position = 'absolute'
    el.style.top= '0'
    el.style.left = '0'
    el.style.width = `${w}px`
    el.style.height = `${h}px`
  }

  async load(root: PannelEl): Promise<void> {
    this.root = root
    this.renderTree()
  }

  async renderTree(): Promise<void> {
    if (!this.root) return
    console.time('r')
    const activeLayerId = this.root.activeLayerId
    const layers = this.root.getChildren()
    let targetCanvas = this.topCanvas
    layers.forEach((layerEl) => {
      if(layerEl.id === activeLayerId) {
        targetCanvas = this.bottomCanvas
      } 
      this.renderBrushes( targetCanvas, layerEl.getChildren() )
    })
    console.timeEnd('r')
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

  submitActiveLayer() {
    const bottomCtx = this.bottomCanvas.getContext('2d')
    bottomCtx?.drawImage(this.activeCanvas, 0, 0)
    const activeCtx = this.activeCanvas.getContext('2d')
    activeCtx?.clearRect(0, 0, this.activeCanvas.width, this.activeCanvas.height)
  }

  renderBrsuh(el: BrushEl) {
    // console.time('rb')
    const ctx = this.activeCanvas.getContext('2d')
    ctx?.clearRect(0, 0, this.activeCanvas.width, this.activeCanvas.height)
    this.renderer.clear()
    this.renderer.renderBrush(el)
    ctx?.drawImage(this.renderer.canvas, 0, 0)
    // console.timeEnd('rb')
  }

}