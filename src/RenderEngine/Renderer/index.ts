import { BrushState } from "../../Brush/types/PenInfer"
import { BrushEl } from "../../PElement/BrushEl"
import { Pen } from "../BrushRender/Pen"
import { BufferInfo, createAttrBuffer, createProgram, createShader, setAttrData } from "../glbase"
import { FRAGMENT_SHADER, VERTEXT_SHADER } from "./shader"

export class Renderer {

    readonly canvas: HTMLCanvasElement

    private gl: WebGLRenderingContext 

    private pen: Pen

    protected targetTexture: WebGLTexture| null = null

    protected frameBuffer: WebGLFramebuffer| null = null

    protected renderToCanvasProgram: WebGLProgram

    protected bufferInfo: BufferInfo = {}
     

    constructor(realtimeCanvas:HTMLCanvasElement) {
        this.canvas = realtimeCanvas
        const gl = realtimeCanvas.getContext('webgl', {
            preserveDrawingBuffer: true, 
            alpha: true,
            depth: false,
            stencil: false,
        })
        if(!gl) throw new Error('get webgl context faild')
        this.gl = gl
        this.gl.enable(this.gl.BLEND)
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        
        const vertextShader = createShader(this.gl, this.gl.VERTEX_SHADER, VERTEXT_SHADER)
        const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
        this.renderToCanvasProgram = createProgram(this.gl, vertextShader, fragmentShader)

        createAttrBuffer(this.gl, this.renderToCanvasProgram, this.bufferInfo, 'a_position')
       

        this.targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.targetTexture, 0);


        this.pen = new Pen(gl)

    }


   
    protected bind2FrameBuffer() {

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
    
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.targetTexture);
    
        // this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    
        this.gl.clearColor(0,0,0, 0);  
        this.gl.clear(this.gl.COLOR_BUFFER_BIT| this.gl.DEPTH_BUFFER_BIT);
    }


    protected bind2Canvas() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.targetTexture);

        // this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
          
    }

    private setWindowSize(program: WebGLProgram, ...valus: [number, number]) {
        const location = this.gl.getUniformLocation(program, 'u_windowSize')
        this.gl.uniform2f(location, ...valus )
    }

    private setBrushColor(program: WebGLProgram, r: number, g: number, b: number, a: number) {
        const location = this.gl.getUniformLocation(program, 'u_brushColor')
        this.gl.uniform4f(location, r/255, g/255, b/255, a )
    }

    protected renderTexture(state: BrushState) {

        const {  color } = state
        this.gl.useProgram(this.renderToCanvasProgram)
        this.setWindowSize(this.renderToCanvasProgram, this.gl.canvas.width, this.gl.canvas.height)
        this.setBrushColor(this.renderToCanvasProgram, color.r, color.g, color.b, color.a)
        const w = this.gl.canvas.width
        const h = this.gl.canvas.height
        const position = new Float32Array([
            0, 0,
            w, 0,
            w, h,
            0,0,
            0, h,
            w, h,
        ])
        setAttrData(this.gl, 'a_position', this.bufferInfo, position)
        this.gl.enableVertexAttribArray(this.bufferInfo['a_position'].location)
        this.gl.vertexAttribPointer(this.bufferInfo['a_position'].location, 2, this.gl.FLOAT, false, 0,0)


        this.gl.drawArrays( this.gl.TRIANGLES, 0,  6)
    }

    renderBrush(brushEl: BrushEl): void {
        const { brushType, state, data, nextData } = brushEl
        // // TODO 根据brushType使用不同的pen.

        this.bind2FrameBuffer()
        this.pen.draw(state, [...data, ...nextData])

        this.bind2Canvas()
        this.renderTexture(state)
    }

    

    clear() {
        this.gl.clearColor(0,0,0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)
    }
    
}