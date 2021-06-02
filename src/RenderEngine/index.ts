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

  private realTimeCanvas: HTMLCanvasElement = document.createElement('canvas')

  private activeCanvas: HTMLCanvasElement = document.createElement('canvas')

  private bottomCanvas: HTMLCanvasElement = document.createElement('canvas')

  readonly cover: HTMLDivElement = document.createElement('div')

  protected renderer: Renderer

  constructor(view: HTMLElement, opt: RenderEnginOpt) {
    opt= { ...defaultOpt, ...opt }
    const width = opt.width/window.devicePixelRatio
    const height = opt.height/window.devicePixelRatio
    this.scroller.style.width = `${width}px`
    this.scroller.style.height = `${height}px`

    this.initCanvas(this.bottomCanvas, opt, 'bottomCanvas')
    this.initCanvas(this.activeCanvas, opt, 'active')
    this.initCanvas(this.realTimeCanvas, opt, 'realTime')
    this.initCanvas(this.topCanvas, opt, 'top')

    this.cover.style.width=`${width}px`
    this.cover.style.height=`${height}px`
    this.cover.style.background= '#808080'
    this.cover.style.opacity= '0.1'
    this.cover.style.touchAction = 'none'

    this.scroller.appendChild(this.cover)
    this.setLayoutStyle(this.cover, width, height)
   

    view.appendChild(this.scroller)

    this.renderer = new Renderer(this.realTimeCanvas)

  }

  private initCanvas(canvas:HTMLCanvasElement, opt: RenderEnginOpt, name: string) {
    const width = opt.width/window.devicePixelRatio
    const height = opt.height/window.devicePixelRatio
    canvas.width = opt.width
    canvas.height = opt.height
    canvas.setAttribute(name, 'qq')
    this.setLayoutStyle(canvas, width, height)
    this.scroller.appendChild(canvas)
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
    
    brushELList.forEach( brushEl => {
      this.renderer.clear()
      this.renderer.renderBrush(brushEl) 
      ctx.drawImage(this.realTimeCanvas, 0, 0)
    })
    this.renderer.clear()
  }

  submitActiveLayer() {
    const activeCtx = this.activeCanvas.getContext('2d')
    activeCtx?.drawImage(this.renderer.canvas, 0, 0)
    this.renderer.clear()
    // console.log('render to activeLayer')
 
  }

  renderBrsuh(el: BrushEl) {
    this.renderer.clear()
    this.renderer.renderBrush(el)
  }

}