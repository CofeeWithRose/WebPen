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
      throw new Error(`[Compile Shader Failed] ${gl.getShaderInfoLog(shader)}`);
    }
    gl.deleteShader(shader);
}

export function createProgram(
    gl: WebGLRenderingContext, 
    vertexShader: WebGLShader, 
    fragmentShader: WebGLShader
) {
    var program = gl.createProgram();
    if(!program) throw new Error('create program faild')
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }