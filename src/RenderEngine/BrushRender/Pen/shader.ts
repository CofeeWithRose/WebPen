export const VERTEXT_SHADER = `
precision highp float;

    // gl窗口大小.
    uniform vec2 u_windowSize;

    // 笔刷颜色.
    uniform vec4 u_brushColor;

    // 笔刷宽度.
    uniform float u_brushWidth;

    // 压感 0~1.
    attribute float a_press;

    // 偏移方向 -1/1.
    attribute float a_offetDirection;

    // 开始坐标.
    attribute vec2 a_position0;

    // 结束坐标.
    attribute vec2 a_position1;

    // 当前坐标.
    attribute vec2 a_position;
   
    
    void main() { 

        float dist = u_brushWidth * a_offetDirection * a_press;

        vec2 direction = normalize(a_position1- a_position0);

        vec2 canvasPosition = a_position + (dist * vec2(direction.y, -direction.x));


        gl_Position = vec4( (canvasPosition/u_windowSize * 2.0 - 1.0) * vec2(1, -1), 1, 1 );
        
    }
   

`

export const FRAGMENT_SHADER = `
    precision highp float;

    uniform vec4 u_brushColor;

    void main(){
    
        gl_FragColor = vec4(0,0,0,1);
    }
`