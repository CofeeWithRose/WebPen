import { BrushState, BrushTrackData } from "../../../Brush/types/PenInfer"
import { Color } from "../../../Color"
import { BufferInfo, createAttrBuffer, createProgram, createShader, setAttrData } from "../../glbase"
import { LINE_FRAGMENT_SHADER, LINE_VERTEXT_SHADER } from "./shaders/line"


enum Attrs {
    
    /**
     * 偏移方向 -1/1.
     */
    a_direction= 'a_direction',

    /**
     *  开始坐标.
     *  attribute vec2 a_position0;
     */
    a_position0 = 'a_position0',
    a_press0='a_press0',
    a_position1='a_position1',
    a_press1='a_press1',
    a_position0_0='a_position0_0',
    a_position1_1='a_position1_1'
}

export class Pen {

    private program: WebGLProgram;

    private bufferInfo: Partial<BufferInfo<Attrs>> = {}

    private gl: WebGLRenderingContext

    constructor(gl: WebGLRenderingContext) {

        const lineFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, LINE_FRAGMENT_SHADER)
        const lineVertexShader = createShader(gl, gl.VERTEX_SHADER, LINE_VERTEXT_SHADER)
        this.program = createProgram(gl, lineVertexShader, lineFragmentShader)
        this.gl = gl
        this.initProgram()
    }

    private initProgram() {

        createAttrBuffer<Attrs>(this.gl, this.program, this.bufferInfo, Attrs.a_direction)

        createAttrBuffer<Attrs>(this.gl, this.program, this.bufferInfo, Attrs.a_position0)
        // // 起始点压感 0~1.
        // attribute float a_press0;
        createAttrBuffer<Attrs>(this.gl, this.program, this.bufferInfo, Attrs.a_press0)

        // // 结束坐标.
        // attribute vec2 a_position1;
        createAttrBuffer<Attrs>(this.gl, this.program, this.bufferInfo, Attrs.a_position1)

        // // 结束点压感 0~1.
        // attribute float a_press1;
        createAttrBuffer<Attrs>(this.gl, this.program, this.bufferInfo, Attrs.a_press1)

        // // 开始坐标之前的坐标.
        // attribute vec2 a_position0_0;
        createAttrBuffer<Attrs>(this.gl, this.program, this.bufferInfo, Attrs.a_position0_0)

        // // 结束坐标之后的坐标.
        // attribute vec2 a_position1_1;
        createAttrBuffer<Attrs>(this.gl, this.program, this.bufferInfo, Attrs.a_position1_1)
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
        this.gl.uniform4f(location, r/255, g/255, b/255, a )
    }


    private drawLines(state: BrushState, data: BrushTrackData[]) {
        data=[ 
            { position: {x: 0, y: 100}, press: 1}, 
            { position: {x: 400, y: 100}, press: 1},
            // { position: {x: 400, y: 800}, press: 1}  
        ]
        const { width, color } = state
        this.gl.useProgram(this.program)
        this.setWindowSize(this.program, this.gl.canvas.width, this.gl.canvas.height)
        this.setBrushWidth(this.program, width)
        this.setBrushColor(this.program, color.r, color.g, color.b, color.a)
        if (data.length < 2 ) return
        const pointCount = (data.length -1) *2 *3
        
         // 偏移方向 -1/1.
        // attribute vec2 a_direction;
        const direction = new Float32Array( pointCount*2)
        // // 开始坐标.
        // attribute vec2 a_position0;
        const position0 = new Float32Array( pointCount*2)
        // // 起始点压感 0~1.
        // attribute float a_press0;
        const a_press0 = new Float32Array( pointCount* 1)

        // // 结束坐标.
        // attribute vec2 a_position1;
        const position1 = new Float32Array( pointCount*2)
        // // 结束点压感 0~1.
        // attribute float a_press1;
        const a_press1 = new Float32Array( pointCount*1)

        // // 开始坐标之前的坐标.
        // attribute vec2 a_position0_0;
        const position0_0 = new Float32Array( pointCount*2)

        // // 结束坐标之后的坐标.
        // attribute vec2 a_position1_1;
        const position1_1 = new Float32Array( pointCount*2)
       

        for(let i = 1; i< data.length; i++) {
    
            const { position: {x: x0_0, y: y0_0} } = data[i-2]||data[i-1]
            const { position: {x: x0, y: y0}, press: press0 } = data[i-1]
    
            const { position: {x: x1, y: y1}, press: press1 } = data[i]
            const { position: {x: x1_1, y: y1_1} } = data[i+1]||data[i]
             
            const index = i-1
            const pCount = 6 *2
            const xCount = 6

            position0_0[ index * pCount     ] = x0_0
            position0_0[ index*  pCount + 1 ] = y0_0
            position0_0[ index * pCount + 2 ] = x0_0
            position0_0[ index*  pCount + 3 ] = y0_0
            position0_0[ index * pCount + 4 ] = x0_0
            position0_0[ index*  pCount + 5 ] = y0_0
            position0_0[ index * pCount + 6 ] = x0_0
            position0_0[ index*  pCount + 7 ] = y0_0
            position0_0[ index * pCount + 8 ] = x0_0
            position0_0[ index*  pCount + 9 ] = y0_0
            position0_0[ index * pCount + 10] = x0_0
            position0_0[ index*  pCount + 11] = y0_0

            position0[ index * pCount     ] = x0
            position0[ index*  pCount + 1 ] = y0
            position0[ index * pCount + 2 ] = x0
            position0[ index*  pCount + 3 ] = y0
            position0[ index * pCount + 4 ] = x0
            position0[ index*  pCount + 5 ] = y0
            position0[ index * pCount + 6 ] = x0
            position0[ index*  pCount + 7 ] = y0
            position0[ index * pCount + 8 ] = x0
            position0[ index*  pCount + 9 ] = y0
            position0[ index * pCount + 10] = x0
            position0[ index*  pCount + 11] = y0

            position1[ index *  pCount    ] = x1
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

            position1_1[ index *  pCount     ] = x1_1
            position1_1[ index *  pCount + 1 ] = y1_1
            position1_1[ index *  pCount + 2 ] = x1_1
            position1_1[ index *  pCount + 3 ] = y1_1
            position1_1[ index *  pCount + 4 ] = x1_1
            position1_1[ index *  pCount + 5 ] = y1_1
            position1_1[ index *  pCount + 6 ] = x1_1
            position1_1[ index *  pCount + 7 ] = y1_1
            position1_1[ index *  pCount + 8] = x1_1
            position1_1[ index *  pCount + 9 ] = y1_1
            position1_1[ index *  pCount + 10] = x1_1
            position1_1[ index *  pCount + 11 ] = y1_1

            direction[ index *  pCount ] = -1
            direction[ index *  pCount + 1 ] = 1
            direction[ index *  pCount + 2] = -1
            direction[ index *  pCount + 3 ] = -1
            direction[ index *  pCount + 4] = 1
            direction[ index *  pCount + 5 ] = -1

            direction[ index *  pCount + 6] = 1
            direction[ index *  pCount + 7 ] = -1
            direction[ index *  pCount + 8] = 1
            direction[ index *  pCount + 9 ] = 1
            direction[ index *  pCount + 10] = -1
            direction[ index *  pCount + 11 ] = 1


            a_press0[ index *  xCount   ] = press0
            a_press0[ index *  xCount +1] = press0
            a_press0[ index *  xCount +2] = press0
            a_press0[ index *  xCount +3] = press0
            a_press0[ index *  xCount +4] = press0
            a_press0[ index *  xCount +5] = press0

            a_press1[ index *  xCount   ] = press1
            a_press1[ index *  xCount +1] = press1
            a_press1[ index *  xCount +2] = press1
            a_press1[ index *  xCount +3] = press1
            a_press1[ index *  xCount +4] = press1
            a_press1[ index *  xCount +5] = press1
           
        }
        const bufferInfo = this.bufferInfo as Required<BufferInfo<Attrs>>

        setAttrData( this.gl, Attrs.a_position0, bufferInfo, position0)
        this.gl.enableVertexAttribArray(bufferInfo[Attrs.a_position0].location)
        this.gl.vertexAttribPointer(bufferInfo[Attrs.a_position0].location, 2, this.gl.FLOAT, false, 0,0)

        setAttrData( this.gl,Attrs.a_position0_0, bufferInfo, position0_0)
        this.gl.enableVertexAttribArray(bufferInfo[Attrs.a_position0_0].location)
        this.gl.vertexAttribPointer(bufferInfo[Attrs.a_position0_0].location, 2, this.gl.FLOAT, false, 0,0)

        setAttrData( this.gl,'a_position1', bufferInfo, position1)
        this.gl.enableVertexAttribArray(bufferInfo['a_position1'].location)
        this.gl.vertexAttribPointer(bufferInfo['a_position1'].location, 2, this.gl.FLOAT, false, 0,0)

        setAttrData( this.gl,Attrs.a_position1_1, bufferInfo, position1_1)
        this.gl.enableVertexAttribArray(bufferInfo[Attrs.a_position1_1].location)
        this.gl.vertexAttribPointer(bufferInfo[Attrs.a_position1_1].location, 2, this.gl.FLOAT, false, 0,0)

        setAttrData( this.gl,'a_press0', bufferInfo, a_press0)
        this.gl.enableVertexAttribArray(bufferInfo['a_press0'].location)
        this.gl.vertexAttribPointer(bufferInfo['a_press0'].location, 1, this.gl.FLOAT, false, 0,0)

        setAttrData( this.gl,'a_press1', bufferInfo, a_press1)
        this.gl.enableVertexAttribArray(bufferInfo['a_press1'].location)
        this.gl.vertexAttribPointer(bufferInfo['a_press1'].location, 1, this.gl.FLOAT, false, 0,0)

        setAttrData( this.gl,Attrs.a_direction, bufferInfo, direction)
        this.gl.enableVertexAttribArray(bufferInfo[Attrs.a_direction].location)
        this.gl.vertexAttribPointer(bufferInfo[Attrs.a_direction].location, 2, this.gl.FLOAT, false, 0,0)


        this.gl.drawArrays( this.gl.TRIANGLES, 0,  (data.length -1) * 2 * 3)
        
    }




    draw(state: BrushState, data: BrushTrackData[]): void {
        // console.log('draw...');
        // console.time('dd')
        this.drawLines(state, data)
        
        // console.timeEnd('dd')
    }



}