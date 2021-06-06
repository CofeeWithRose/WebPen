/**
 * 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
 * @param gl 
 * @param type 
 * @param source 
 * @returns 
 */
export function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
    const shader = gl.createShader(type); // 创建着色器对象
    if (!shader) throw new Error('create shader faild')
    gl.shaderSource(shader, source); // 提供数据源
    gl.compileShader(shader); // 编译 -> 生成着色器
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    } else {
      throw new Error(`[Compile Shader Failed] source: ${source} info: ${gl.getShaderInfoLog(shader)}`);
    }
}

export function createProgram(
    gl: WebGLRenderingContext, 
    vertexShader: WebGLShader, 
    fragmentShader: WebGLShader
): WebGLProgram {
    const program = gl.createProgram();
    if(!program) throw new Error('create program faild')
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    } else {
      throw new Error(`Fail link program: ${gl.getProgramInfoLog(program)}`)
    }
  }



export type BufferInfo<T extends string> = { [P in T]: { location: GLint, buffer: WebGLBuffer } }


export function createAttrBuffer<T extends string>(gl: WebGLRenderingContext, program: WebGLProgram, bufferInfo: Partial<BufferInfo<T>>, name: T ) {
    const location = gl.getAttribLocation(program, name);
    const buffer = gl.createBuffer();
    if(!buffer) throw new Error('Fail create buffer')
    bufferInfo[name] = { buffer, location }
}

export function setAttrData<T extends string>(gl: WebGLRenderingContext, name: T, bufferInfo: BufferInfo<T>, data: ArrayBuffer ) {
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo[name].buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
}