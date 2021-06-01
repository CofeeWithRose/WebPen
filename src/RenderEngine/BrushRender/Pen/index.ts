import { BrushState, BrushTrackData } from "../../../Brush/types/PenInfer"
import { Color } from "../../../Color"
import { createProgram, createShader } from "../../glbase"
import { LINE_FRAGMENT_SHADER, LINE_VERTEXT_SHADER } from "./shaders/line"
import { ROUND_FRAGMENT_SHADER, ROUND_VERTEXT_SHADER } from "./shaders/round";

type BufferInfo = { [key: string]: { location: GLint, buffer: WebGLBuffer } }

export class Pen {

    private programs: { lineProgram: WebGLProgram, dotProgram: WebGLProgram};

    private lineBufferInfo: BufferInfo  = {}

    private dotBufferInfo: BufferInfo = {}

    private count = 0

    private gl: WebGLRenderingContext

    constructor(gl: WebGLRenderingContext) {

        const lineFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, LINE_FRAGMENT_SHADER)
        const lineVertexShader = createShader(gl, gl.VERTEX_SHADER, LINE_VERTEXT_SHADER)
        const lineProgram = createProgram(gl, lineVertexShader, lineFragmentShader)

        const dotFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, ROUND_FRAGMENT_SHADER)
        const dotVertexShader = createShader(gl, gl.VERTEX_SHADER, ROUND_VERTEXT_SHADER)
        const dotProgram = createProgram(gl, dotVertexShader, dotFragmentShader)

        this.programs = { lineProgram, dotProgram }
        this.gl = gl
        this.initLineProgram()
        this.initRoundProgram()
    }

    private initLineProgram() {
       // gl窗口大小.
        // uniform vec2 u_windowSize;

        // // 笔刷颜色.
        // uniform vec4 u_brushColor;

        // // 笔刷宽度.
        // uniform float u_brushWidth;

        // // 压感 0~1.
        this.createAttrBuffer(this.programs.lineProgram, this.lineBufferInfo, 'a_press')
       
        // // 偏移方向 -1/1.
        this.createAttrBuffer(this.programs.lineProgram, this.lineBufferInfo, 'a_offetDirection')
        

        // // 开始坐标.
        this.createAttrBuffer(this.programs.lineProgram,this.lineBufferInfo, 'a_position0')
       

        // // 结束坐标.
        this.createAttrBuffer(this.programs.lineProgram,this.lineBufferInfo, 'a_position1')
      
        // // 当前坐标.
        this.createAttrBuffer(this.programs.lineProgram, this.lineBufferInfo, 'a_position')
    }

    private initRoundProgram() {
       // 压感 0~1.
      // attribute float a_press;
      this.createAttrBuffer(this.programs.dotProgram, this.dotBufferInfo, 'a_press')

      // // 当前坐标.
      // attribute vec2 a_position;
      this.createAttrBuffer(this.programs.dotProgram, this.dotBufferInfo, 'a_position')

      // // 偏移方向坐标.
      // attribute vec2 a_offset;
      this.createAttrBuffer(this.programs.dotProgram, this.dotBufferInfo, 'a_offset')
    }

    private createAttrBuffer(program: WebGLProgram, bufferInfo: BufferInfo, name: string ) {
        const location = this.gl.getAttribLocation(program, name);
        const buffer = this.gl.createBuffer();
        if(!buffer) throw new Error('Fail create buffer')
        bufferInfo[name] = { buffer, location }
    }

    protected setAttrData(name: string, bufferInfo: BufferInfo, data: ArrayBuffer ) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferInfo[name].buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    }

    private setBrushWidth( program: WebGLProgram, val: number) {
        const location = this.gl.getUniformLocation(program, 'u_brushWidth')
        this.gl.uniform1f(location, val )
    }

    private setWindowSize(program: WebGLProgram, ...valus: [number, number]) {
        const location = this.gl.getUniformLocation(program, 'u_windowSize')
        this.gl.uniform2f(location, ...valus )
    }

    private setBrushColor(program: WebGLProgram, r: number, g: number, b: number, a: number) {
        const location = this.gl.getUniformLocation(program, 'u_brushColor')
        this.gl.uniform4f(location, r/ 255, g/255, b/255, a )
    }


    private drawLines(state: BrushState, data: BrushTrackData[]) {
        // data=[ { position: {x: 100, y: 100}, press: 1}, { position: {x: 400, y: 100}, press: 1} ]
        const { width, color } = state
        this.gl.useProgram(this.programs.lineProgram)
        this.setWindowSize(this.programs.lineProgram, this.gl.canvas.width, this.gl.canvas.height)
        this.setBrushWidth(this.programs.lineProgram, width)
        this.setBrushColor(this.programs.lineProgram, color.r, color.g, color.b, color.a)
        if (data.length < 2 ) return
        const pointCount = (data.length -1) *2 *3
        
        const position = new Float32Array( pointCount*2)
        const position0 = new Float32Array(pointCount *2)
        const position1 = new Float32Array(pointCount *2)
        const offetDirection = new Float32Array(pointCount)
        const press = new Float32Array(pointCount)

        for(let i = 1; i< data.length; i++) {
            const { position: {x: x0, y: y0}, press: press0 } = data[i-1]
            const { position: {x: x1, y: y1}, press: press1 } = data[i]
            const index = i-1
            const pCount = 6 *2
            const xCount = 6
            position0[ index * pCount ] = x0
            position0[ index*  pCount + 1 ] = y0
            position0[ index * pCount + 2 ] = x0
            position0[ index*  pCount + 3 ] = y0
            position0[ index * pCount + 4] = x0
            position0[ index*  pCount + 5 ] = y0
            position0[ index * pCount +6] = x0
            position0[ index*  pCount + 7 ] = y0
            position0[ index * pCount +8] = x0
            position0[ index*  pCount + 9 ] = y0
            position0[ index * pCount +10 ] = x0
            position0[ index*  pCount + 11 ] = y0

            position1[ index *  pCount ] = x1
            position1[ index *  pCount + 1] = y1
            position1[ index *  pCount + 2 ] = x1
            position1[ index *  pCount + 3 ] = y1
            position1[ index *  pCount + 4] = x1
            position1[ index *  pCount + 5 ] = y1
            position1[ index *  pCount + 6] = x1
            position1[ index *  pCount + 7 ] = y1
            position1[ index *  pCount + 8] = x1
            position1[ index *  pCount + 9 ] = y1
            position1[ index *  pCount + 10] = x1
            position1[ index *  pCount + 11 ] = y1

            position[ index *  pCount ] = x0
            position[ index *  pCount + 1 ] = y0
            position[ index *  pCount + 2] = x0
            position[ index *  pCount + 3 ] = y0
            position[ index *  pCount + 4] = x1
            position[ index *  pCount + 5 ] = y1
            position[ index *  pCount + 6] = x1
            position[ index *  pCount + 7 ] = y1
            position[ index *  pCount + 8] = x1
            position[ index *  pCount + 9 ] = y1
            position[ index *  pCount + 10] = x0
            position[ index *  pCount + 11 ] = y0

            

            offetDirection[ index *  xCount ] = 1
            offetDirection[ index *  xCount +1] = -1
            offetDirection[ index *  xCount +2] = -1
            offetDirection[ index *  xCount +3] = 1
            offetDirection[ index *  xCount +4] = -1
            offetDirection[ index *  xCount +5] = 1

            
            press[ index *  xCount ] = press0
            press[ index *  xCount +1] = press0
            press[ index *  xCount +2] = press1
            press[ index *  xCount +3] = press1
            press[ index *  xCount +4] = press1
            press[ index *  xCount +5] = press0

           
        }
        
        this.setAttrData('a_position', this.lineBufferInfo, position)
        this.gl.enableVertexAttribArray(this.lineBufferInfo['a_position'].location)
        this.gl.vertexAttribPointer(this.lineBufferInfo['a_position'].location, 2, this.gl.FLOAT, false, 0,0)

        this.setAttrData('a_position0', this.lineBufferInfo, position0)
        this.gl.enableVertexAttribArray(this.lineBufferInfo['a_position0'].location)
        this.gl.vertexAttribPointer(this.lineBufferInfo['a_position0'].location, 2, this.gl.FLOAT, false, 0,0)

        this.setAttrData('a_position1', this.lineBufferInfo, position1)
        this.gl.enableVertexAttribArray(this.lineBufferInfo['a_position1'].location)
        this.gl.vertexAttribPointer(this.lineBufferInfo['a_position1'].location, 2, this.gl.FLOAT, false, 0,0)

        this.setAttrData('a_offetDirection', this.lineBufferInfo, offetDirection)
        this.gl.enableVertexAttribArray(this.lineBufferInfo['a_offetDirection'].location)
        this.gl.vertexAttribPointer(this.lineBufferInfo['a_offetDirection'].location, 1, this.gl.FLOAT, false, 0,0)

        this.setAttrData('a_press', this.lineBufferInfo, press)
        this.gl.enableVertexAttribArray(this.lineBufferInfo['a_press'].location)
        this.gl.vertexAttribPointer(this.lineBufferInfo['a_press'].location, 1, this.gl.FLOAT, false, 0,0)


        this.gl.drawArrays( this.gl.TRIANGLES, 0,  (data.length -1) * 2 * 3)

    }



    private drawDot(state: BrushState, data: BrushTrackData[]) {
    //   data=[ { position: {x: 100, y: 100}, press: 1}, { position: {x: 400, y: 100}, press: 1} ]
      if(!data.length) return
      const { width, color } = state
      this.gl.useProgram(this.programs.dotProgram)
      this.setWindowSize(this.programs.dotProgram, this.gl.canvas.width, this.gl.canvas.height)
      this.setBrushWidth(this.programs.dotProgram, width)
      this.setBrushColor(this.programs.dotProgram, color.r, color.g, color.b, color.a)
      this.gl.enable(this.gl.BLEND)
      
      const pointCount = data.length *2 *3

      const press = new Float32Array(pointCount)
      const position = new Float32Array( pointCount*2)
      const offset = new Float32Array(pointCount *2)

      const pCount = 6 *2
      const count = 6

      data.forEach( ({position: {x, y}, press: p}, index) => {
          
          press[index * count ] = p
          press[index * count +1] = p
          press[index * count +2] = p
          press[index * count +3] = p
          press[index * count +4] = p
          press[index * count +5] = p

          position[index * pCount ] = x
          position[index * pCount +1 ] = y
          position[index * pCount +2] = x
          position[index * pCount +3] = y
          position[index * pCount +4] = x
          position[index * pCount +5] = y
          position[index * pCount +6] = x
          position[index * pCount +7] = y
          position[index * pCount +8] = x
          position[index * pCount +9] = y
          position[index * pCount +10] = x
          position[index * pCount +11] = y

          offset[index * pCount ] = -1
          offset[index * pCount +1 ] = 1
          offset[index * pCount +2] = -1
          offset[index * pCount +3] = -1
          offset[index * pCount +4] = 1
          offset[index * pCount +5] = -1
          offset[index * pCount +6] = 1
          offset[index * pCount +7] = -1
          offset[index * pCount +8] = 1
          offset[index * pCount +9] = 1
          offset[index * pCount +10] = -1
          offset[index * pCount +11] = 1

      })

      this.setAttrData('a_press', this.dotBufferInfo, press)
      this.gl.enableVertexAttribArray(this.dotBufferInfo['a_press'].location)
      this.gl.vertexAttribPointer(this.dotBufferInfo['a_press'].location, 1, this.gl.FLOAT, false, 0,0)

      this.setAttrData('a_position', this.dotBufferInfo, position)
      this.gl.enableVertexAttribArray(this.dotBufferInfo['a_position'].location)
      this.gl.vertexAttribPointer(this.dotBufferInfo['a_position'].location, 2, this.gl.FLOAT, false, 0,0)
     
      this.setAttrData('a_offset', this.dotBufferInfo, offset)
      this.gl.enableVertexAttribArray(this.dotBufferInfo['a_offset'].location)
      this.gl.vertexAttribPointer(this.dotBufferInfo['a_offset'].location, 2, this.gl.FLOAT, false, 0,0)
      
      this.gl.drawArrays( this.gl.TRIANGLES, 0,  data.length *2 *3)
      // this.gl.disableVertexAttribArray(this.dotBufferInfo['a_position'].location)
      // this.gl.disableVertexAttribArray(this.dotBufferInfo['a_offset'].location)
      // this.gl.disableVertexAttribArray(this.dotBufferInfo['a_press'].location)
      
    }

    draw(state: BrushState, data: BrushTrackData[]): void {
        // console.log('draw...');
        // console.time('dd')
        this.drawLines(state, data)
        this.drawDot(state, data)
        
        // console.timeEnd('dd')
    }



}