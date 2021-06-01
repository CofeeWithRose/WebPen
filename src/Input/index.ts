import { BRUSH_TYPES } from "../Brush/types/PenInfer"
import { BrushEl } from "../PElement/BrushEl"

export class Input {

    constructor( private cover: HTMLElement) {
        cover.addEventListener('pointerdown', this.onPointStart)
        cover.addEventListener('pointermove', this.onPointMove)
        cover.addEventListener('pointerup', this.onPointEnd)
    }

    private curBrush: BrushEl|null = null

    public onBegin(brush:BrushEl) {}

    public onUpdate() {}

    public onEnd() {}

    private onPointStart= (e:PointerEvent) => {
        const events: PointerEvent[] = e.getCoalescedEvents? e.getCoalescedEvents() : [e]
        this.curBrush = new BrushEl()
        this.curBrush.brushType = BRUSH_TYPES.PEN // TODO
        this.loadBrushData(events)
        this.onBegin(this.curBrush)
    }

    private loadBrushData = (e: PointerEvent[]) => {
        if (!this.curBrush) return
        const data = this.curBrush.data
        e.forEach(e => {
            data.push({
                position: {x: e.offsetX, y: e.offsetY},
                press: e.pressure
            })
        })
    }


    private onPointMove = (e:PointerEvent) => {
        const events: PointerEvent[] = e.getCoalescedEvents? e.getCoalescedEvents() : [e]
        this.loadBrushData(events)
        this.onUpdate()
    }

    private onPointEnd = (e:PointerEvent) => {
        console.log('end...');
        
        // const events: PointerEvent[] = e.getCoalescedEvents? e.getCoalescedEvents() : [e]
    }
}