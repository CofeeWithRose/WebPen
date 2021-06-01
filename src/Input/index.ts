import { BrushState, BRUSH_TYPES } from "../Brush/types/PenInfer"
import { BrushEl } from "../PElement/BrushEl"

export class Input {

    private state:BrushState

    private dpr = window.devicePixelRatio

    constructor( private cover: HTMLElement, state:BrushState) {
        cover.addEventListener('pointerdown', this.onPointStart, {passive: false})
        cover.addEventListener('pointermove', this.onPointMove, {passive: false})
        cover.addEventListener('pointerup', this.onPointEnd, {passive: false})
        this.state = state
    }

    private curBrush: BrushEl|null = null

    public onBegin(brush:BrushEl) {}

    public onUpdate(brush:BrushEl) {}

    public onEnd() {}

    private onPointStart= (e:PointerEvent) => {
        e.preventDefault()
        // if (e.pointerType !== 'pen') return
        this.dpr = window.devicePixelRatio
        const events: PointerEvent[] = e.getCoalescedEvents? e.getCoalescedEvents() : [e]
        this.curBrush = new BrushEl()
        this.curBrush.brushType = BRUSH_TYPES.PEN // TODO
        this.curBrush.state.width = this.state.width
        this.curBrush.state.color = this.state.color
        
        // this.curBrush.state.
        this.loadBrushData(events)
        this.onBegin(this.curBrush)
    }

    private loadBrushData = (e: PointerEvent[]) => {
        if (!this.curBrush) return
        const data = this.curBrush.data
        e.forEach(e => {
            data.push({
                position: {x: e.clientX * this.dpr, y: e.clientY * this.dpr },
                press: e.pressure||1
            })
        })
    }


    private onPointMove = (e:PointerEvent) => {
        console.time('mm');
        e.preventDefault()
        // if (e.pointerType !== 'pen') return
        if (!this.curBrush) return
        const events: PointerEvent[] = e.getCoalescedEvents? e.getCoalescedEvents() : [e]
        this.loadBrushData(events)
        this.onUpdate(this.curBrush)
        console.timeEnd('mm');
    }

    private onPointEnd = (e:PointerEvent) => {
      // if (e.pointerType !== 'pen') return
        console.log('end..', Date.now() * 0.001);
        this.curBrush = null
        this.onEnd()
       
        
        // const events: PointerEvent[] = e.getCoalescedEvents? e.getCoalescedEvents() : [e]
    }
}