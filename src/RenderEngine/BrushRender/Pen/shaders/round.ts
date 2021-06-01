export const ROUND_VERTEXT_SHADER = `
    precision highp float;

    // gl窗口大小.
    uniform vec2 u_windowSize;

    // 笔刷宽度.
    uniform float u_brushWidth;

    // 压感 0~1.
    attribute float a_press;

    // 当前坐标.
    attribute vec2 a_position;

    // 偏移方向坐标.
    attribute vec2 a_offset;

    // 半径.
    varying float v_r;

    // 圆心点.
    varying vec2 v_center;
    
    void main() { 

        v_r = 0.5 * u_brushWidth * a_press;

        v_center = a_position;

        vec2 canvasPosition = a_position + (a_offset * v_r);

        gl_Position = vec4( (canvasPosition/u_windowSize * 2.0 - 1.0) * vec2(1, -1), 1, 1 );
        
    }
`

export const ROUND_FRAGMENT_SHADER = `
    precision highp float;

    uniform vec4 u_brushColor;

    // gl窗口大小.
    uniform vec2 u_windowSize;
    
    // 圆心点.
    varying vec2 v_center;

    // 半径.
    varying float v_r;


    void main(){
        vec2 curPosition = vec2(gl_FragCoord.x, u_windowSize.y - gl_FragCoord.y);
        if (distance(curPosition, v_center) <= v_r) {
          gl_FragColor = u_brushColor;
        } else {
          discard;
        }
        // gl_FragColor = vec4(gl_FragCoord.x * 0.001, 0,0,1.0);
    }
`