import { BrushEl } from "../PElement/BrushEl"
import { createProgram, createShader } from "./glbase"
import { LINE_FRAGMENT_SHADER, LINE_VERTEXT_SHADER } from "./BrushRender/Pen/shaders/line"
import { Pen } from "./BrushRender/Pen"

export class Renderer {

    readonly canvas = document.createElement('canvas')

    private gl: WebGLRenderingContext 

    private pen: Pen
     

    constructor(w: number, h: number) {
        this.canvas.width = w
        this.canvas.height = h
        const gl = this.canvas.getContext('webgl')
        if(!gl) throw new Error('get webgl context faild')
        this.gl = gl
        this.pen = new Pen(gl)
    }



    renderBrush(brushEl: BrushEl): void {
        const { brushType, state, data } = brushEl
        // TODO 根据brushType使用不同的pen.
        this.pen.draw(state, data)
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT|this.gl.STENCIL_BUFFER_BIT)
    }
    
}