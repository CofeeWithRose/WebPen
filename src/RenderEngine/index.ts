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

  //Here  is a realTimeCanvas.

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
    const realTimeCanvas: HTMLCanvasElement = document.createElement('canvas')
    this.initCanvas(realTimeCanvas, opt, 'realTime')
    this.initCanvas(this.topCanvas, opt, 'top')

    this.cover.style.width=`${width}px`
    this.cover.style.height=`${height}px`
    this.cover.style.background= '#808080'
    this.cover.style.opacity= '0.1'
    this.cover.style.touchAction = 'none'
    this.cover.style.userSelect='none'
    // this.cover.tabIndex = 0

    this.scroller.appendChild(this.cover)
    this.setLayoutStyle(this.cover, width, height)
   

    view.appendChild(this.scroller)

    this.renderer = new Renderer(realTimeCanvas)

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
    // TODO cnavas size 从 pannelEl中提取.
    this.root = root
    this.renderTree()
  }

  protected clear () {
    const canvaes: HTMLCanvasElement[] = [ 
      this.topCanvas,
      this.activeCanvas,
      this.bottomCanvas,
    ]
    canvaes.forEach(  canvas => {
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0,0, canvas.width, canvas.height)
    })
    this.renderer.clear()
  }

  async renderTree(): Promise<void> {
    if (!this.root) return
    console.time('r')
    this.clear()
    const activeLayerId = this.root.activeLayerId
    const layers = this.root.getChildren()
    let targetCanvas = this.topCanvas
    layers.forEach((layerEl) => {
      if(layerEl.id === activeLayerId) {
        this.renderBrushes( this.activeCanvas, layerEl.getChildren() )
        targetCanvas = this.bottomCanvas
        return
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
    brushELList.forEach( brushEl => { 
      this.renderer.renderBrush(brushEl) 
    })
    ctx.drawImage(this.renderer.canvas, 0, 0)
    this.renderer.clear()
  }

  submitActiveLayer() {
    const activeCtx = this.activeCanvas.getContext('2d')
    if ( !activeCtx) return
    activeCtx?.drawImage(this.renderer.canvas, 0, 0)
    this.renderer.clear()
    // console.log('render to activeLayer')
  }

  renderBrsuh(el: BrushEl) {
    this.renderer.clear()
    this.renderer.renderBrush(el)
  }

}