import { BrushEl } from "../PElement/BrushEl"
import { createProgram, createShader } from "./glbase"
import { LINE_FRAGMENT_SHADER, LINE_VERTEXT_SHADER } from "./BrushRender/Pen/shaders/line"
import { Pen } from "./BrushRender/Pen"

export class Renderer {

    readonly canvas: HTMLCanvasElement

    private gl: WebGLRenderingContext 

    private pen: Pen
     

    constructor(realtimeCanvas:HTMLCanvasElement) {
        // this.canvas.width = w
        // this.canvas.height = h
        this.canvas = realtimeCanvas
        const gl = realtimeCanvas.getContext('webgl', {preserveDrawingBuffer: true})
        if(!gl) throw new Error('get webgl context faild')
        this.gl = gl
        this.pen = new Pen(gl)
    }



    renderBrush(brushEl: BrushEl): void {
        const { brushType, state, data, nextData } = brushEl
        // TODO 根据brushType使用不同的pen.
        this.pen.draw(state, [...data, ...nextData])
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)
    }
    
}