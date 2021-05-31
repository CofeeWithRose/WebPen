import { BrushState, BrushTrackData } from "../../../Brush/types/PenInfer"
import { Color } from "../../../Color"
import { createProgram, createShader } from "../../glbase"
import { FRAGMENT_SHADER, VERTEXT_SHADER } from "./shader"

export class Pen {

    private program: WebGLProgram

    private bufferInfo: { [key: string]: { location: GLint, buffer: WebGLBuffer } } = {}

    private count = 0

    private gl: WebGLRenderingContext

    constructor(gl: WebGLRenderingContext) {
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEXT_SHADER)
        const program = createProgram(gl, vertexShader, fragmentShader)
        if (!program) throw new Error('fail create program')
        this.program = program
        this.gl = gl
         // gl窗口大小.
        // uniform vec2 u_windowSize;

        // // 笔刷颜色.
        // uniform vec4 u_brushColor;

        // // 笔刷宽度.
        // uniform float u_brushWidth;

        // // 压感 0~1.
        this.createAttrBuffer('a_press')

        // // 偏移方向 -1/1.
        this.createAttrBuffer('a_offetDirection')

        // // 开始坐标.
        this.createAttrBuffer('a_position0')

        // // 结束坐标.
        this.createAttrBuffer('a_position1')

        // // 当前坐标.
        this.createAttrBuffer('a_position')
        
    }

    private createAttrBuffer(name: string) {
        const location = this.gl.getAttribLocation(this.program, name);
        const buffer = this.gl.createBuffer();
        if(!buffer) throw new Error('Fail create buffer')
        this.bufferInfo[name] = { buffer, location }
    }

    protected setAttrData(name: string, data: ArrayBuffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferInfo[name].buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    }

    private setBrushWidth( val: number) {
        const location = this.gl.getUniformLocation(this.program, 'u_brushWidth')
        this.gl.uniform1f(location, val )
    }

    private setWindowSize(...valus: [number, number]) {
        const location = this.gl.getUniformLocation(this.program, 'u_windowSize')
        this.gl.uniform2f(location, ...valus )
    }

    private setBrushColor(...valus: [number, number, number, number]) {
        const location = this.gl.getUniformLocation(this.program, 'u_brushColor')
        this.gl.uniform4f(location, ...valus )
    }

    active() {
        this.gl.useProgram(this.program)
        this.setWindowSize(this.gl.canvas.width, this.gl.canvas.height)
    }

    setInfo(state: BrushState, data: BrushTrackData[]) {
        const { width, color } = state
        this.setBrushWidth(width)
        this.setBrushColor(color.r, color.g, color.b, color.a)
        if (data.length < 2 ) return
        const pointCount = (data.length -1) *2 *6
        
        const position = new Float32Array( pointCount*2)
        const position0 = new Float32Array(pointCount *2)
        const position1 = new Float32Array(pointCount *2)
        const offetDirection = new Float32Array(pointCount)
        const press = new Float32Array(pointCount)
       
        for(let i = 1; i< data.length; i++) {
            const { position: {x, y}, press } = data[i]
            // position1[i*2] =  
        }
        this.setAttrData('a_position', position)
        this.setAttrData('a_position0', position0)
        this.setAttrData('a_position1', position1)
        this.setAttrData('a_offetDirection', offetDirection)
        this.setAttrData('a_press', press)
        this.count = (data.length -1) * 2
        
    }

    draw(): void {
        console.log('draw...');
        
        this.gl.drawArrays( this.gl.TRIANGLES, 0,  this.count)
    }



}