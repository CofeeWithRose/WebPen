import { BrushEl } from "../PElement/BrushEl"
import { createProgram, createShader } from "./glbase"
import { FRAGMENT_SHADER, VERTEXT_SHADER } from "./BrushRender/Pen/shader"
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
        this.canvas.setAttribute('hhh', '123123')
        document.body.appendChild(this.canvas)
    }



    renderBrush(brushEl: BrushEl): void {
        const { brushType, state, data } = brushEl
        this.pen.active()
        
        this.pen.setInfo(state, data)
        this.pen.draw()
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT|this.gl.STENCIL_BUFFER_BIT)
    }
    
}