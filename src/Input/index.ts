import { BrushState, BRUSH_TYPES } from "../Brush/types/PenInfer"
import { BrushEl } from "../PElement/BrushEl"

export class Input {

    private state:BrushState

    private dpr = window.devicePixelRatio

    constructor( private cover: HTMLElement, state:BrushState) {
        cover.addEventListener('pointerdown', this.onPointStart, {passive: false})

        cover.addEventListener('pointermove', this.onPointMove, {passive: false})
        
        cover.addEventListener('pointerup', this.onPointEnd, {passive: false})
        cover.addEventListener('pointercancel', this.onPointEnd, {passive: false})
        this.state = state
    }

    private curBrush: BrushEl|null = null

    public onBegin(brush:BrushEl) {}

    public onUpdate(brush:BrushEl) {}

    public onEnd(brush:BrushEl) {}


    protected pointId: number = NaN

    private onPointStart= (e:PointerEvent) => {
        console.log('point start');
        if ( isNaN(this.pointId) ) this.pointId = e.pointerId     
        e.preventDefault()
        // if (e.pointerType !== 'pen') return
        this.dpr = window.devicePixelRatio
        const events: PointerEvent[] = e.getCoalescedEvents? e.getCoalescedEvents() : [e]
        // const nextEvents:PointerEvent[] = e.getPredictedEvents? e.getPredictedEvents(): []
        this.curBrush = new BrushEl()
        this.curBrush.brushType = BRUSH_TYPES.PEN // TODO
        this.curBrush.state.width = this.state.width
        this.curBrush.state.color = this.state.color
        
        this.loadBrushData(events, [])
        this.onBegin(this.curBrush)
    }

    private loadBrushData = (e: PointerEvent[], nextE: PointerEvent[]) => {
        if (!this.curBrush) return
        const data = this.curBrush.data
        
        e.forEach(e => {
            data.push({
                position: {x:Math.round(e.offsetX * this.dpr), y: Math.round(e.offsetY * this.dpr) },
                press: (  e.pointerType !== 'pen' && !e.pressure)? 1: e.pressure
            })
        })
        this.curBrush.nextData = nextE.map ( e =>  ({
            position: {x: e.offsetX * this.dpr, y: e.offsetY * this.dpr },
            press: e.pressure||1
        }))
    }


    private onPointMove = (e:PointerEvent) => {
        console.time('onPointMove');
        e.preventDefault()
        if(e.pointerId !== this.pointId) return
        // if (e.pointerType !== 'pen') return
        if (!this.curBrush) return
        const events: PointerEvent[] = e.getCoalescedEvents? e.getCoalescedEvents() : []
        // const nextEvents:PointerEvent[] = e.getPredictedEvents? e.getPredictedEvents(): []
        events.push(e)
        this.loadBrushData(events, [])
        this.onUpdate(this.curBrush)
        console.timeEnd('onPointMove');
    }

    private onPointEnd = (e:PointerEvent) => {
      // if (e.pointerType !== 'pen') return
      // console.log('end..', Date.now() * 0.001);
      console.time('onPointEnd');
      if(e.pointerId !== this.pointId) return
      if(!this.curBrush)  return
      this.curBrush.nextData = []
      this.onEnd(this.curBrush)
      this.curBrush = null
      this.pointId = NaN
      console.timeEnd('onPointEnd');
      // const events: PointerEvent[] = e.getCoalescedEvents? e.getCoalescedEvents() : [e]
    }
}