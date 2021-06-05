import { BrushState, BrushTrackData, BRUSH_TYPES } from "../Brush/types/PenInfer"
import { BrushEl } from "../PElement/BrushEl"

export class Input {

    private state:BrushState

    constructor( private cover: HTMLElement, state:BrushState) {
        cover.addEventListener('pointerdown', this.onPointStart, {passive: false})
        cover.addEventListener('pointermove', this.onPointMove, {passive: false})
        cover.addEventListener('pointerup', this.onPointEnd, {passive: false})
        cover.addEventListener('pointercancel', this.onPointEnd, {passive: false})
        cover.addEventListener('pointerout', this.onPointEnd, {passive: false})
        this.state = state
    }

    private curBrush: BrushEl|null = null

    public onBegin(brush:BrushEl) {}

    public onUpdate(brush:BrushEl) {}

    public onEnd(brush:BrushEl) {}

    private dpi = NaN


    protected pointId: number = NaN

    private onPointStart= (e:PointerEvent) => {
        console.log('point start');
        if ( isNaN(this.pointId) ) this.pointId = e.pointerId     
        e.preventDefault()
        // if (e.pointerType !== 'pen') return
        // this.dpr = window.devicePixelRatio
        const events: PointerEvent[] = e.getCoalescedEvents? e.getCoalescedEvents() : [e]
        // const nextEvents:PointerEvent[] = e.getPredictedEvents? e.getPredictedEvents(): []
        this.curBrush = new BrushEl()
        this.curBrush.brushType = BRUSH_TYPES.PEN // TODO
        this.curBrush.state.width = this.state.width
        this.curBrush.state.color = this.state.color
        
        this.loadBrushData(events, [])
        this.onBegin(this.curBrush)
        this.preEventInfo.timeStamp = NaN
        this.prePress = 0
    }

    
    protected getDPI = (): number => {
        const div = document.createElement('div')
        div.style.width = '1in'
        document.body.appendChild(div)
        this.dpi = div.clientWidth * window.devicePixelRatio
        console.log(this.dpi);
        
        this.getDPI = () => this.dpi
        return this.dpi
    }

    private loadBrushData = (e: PointerEvent[], nextE: PointerEvent[]) => {
        if (!this.curBrush) return
        const data = this.curBrush.data
        e.forEach( e => {
            data.push({
                position: {x:Math.round(e.offsetX), y: Math.round(e.offsetY ) },
                press: this.getPress(e)
            })
        })
        this.curBrush.nextData = nextE.map ( e =>  ({
            position: {x: e.offsetX, y: e.offsetY },
            press: e.pressure||1
        }))
    }

    protected preEventInfo = { x: 0, y: 0, timeStamp: NaN}

    protected prePress = 0


    protected getPress(nextEvent: PointerEvent) {

        if (nextEvent.pointerType === 'pen') {
            return nextEvent.pressure
        }
        
        if (nextEvent.pointerType === 'touch') {
            let curPress = ((nextEvent.width * nextEvent.height) -1)
            this.prePress += 0.1*(curPress - this.prePress)
            this.prePress = Math.min(Math.max(this.prePress, 0), 1)  
            return  this.prePress
        }
        
        if (!this.preEventInfo.timeStamp) {
            this.preEventInfo  = {
                x:nextEvent.offsetY,
                y: nextEvent.offsetY,
                timeStamp: nextEvent.timeStamp,
            }
            return 0
        }
        const {x, y, timeStamp} = this.preEventInfo
        const now = Date.now()
        const dist = Math.sqrt ((x - nextEvent.offsetX) **2 + ( y - nextEvent.offsetY) **2)/this.getDPI()
        const deltaTime =  ( now - timeStamp)|| 1
        const vec = dist/deltaTime
        let curPress = Math.min(Math.max(1- 0.5 *vec, 0), 1)  
        // console.log(vec, dist, deltaTime,now);
        
        this.prePress += 0.2 * (curPress - this.prePress)
        this.prePress = Math.min(Math.max(this.prePress, 0), 1)  
        this.preEventInfo  = {
            x:nextEvent.offsetY,
            y: nextEvent.offsetY,
            timeStamp: now,
        }
        return this.prePress

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
      this.preEventInfo.timeStamp = NaN
      console.timeEnd('onPointEnd');
      // const events: PointerEvent[] = e.getCoalescedEvents? e.getCoalescedEvents() : [e]
    }
}