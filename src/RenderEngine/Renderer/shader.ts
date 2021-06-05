export const VERTEXT_SHADER = `
    precision highp float;

    // gl窗口大小.
    uniform vec2 u_windowSize;

    // 当前坐标.
    attribute vec2 a_position;

    void main() { 

        // float dist = 0.5 * u_brushWidth * a_offetDirection * a_press;

        // vec2 direction = normalize(a_position1- a_position0);

        // vec2 canvasPosition = a_position + (dist * vec2(direction.y, -direction.x));

        gl_Position = vec4( (a_position/u_windowSize * 2.0 - 1.0) * vec2(1, -1), 1, 1 );
        
    }
`

export const FRAGMENT_SHADER = `
    precision highp float;

    // gl窗口大小.
    uniform vec2 u_windowSize;

    uniform vec4 u_brushColor;

    uniform sampler2D u_image;


    void main(){

        vec4 textColor = texture2D(u_image, vec2(gl_FragCoord.x, gl_FragCoord.y)/u_windowSize);
      
        if ((textColor.a) > 0.0) {
            gl_FragColor = u_brushColor;
            // gl_FragColor = textColor;
        } else {
            discard;
            // gl_FragColor = vec4(1,0,0,1);
        }
        // gl_FragColor = textColor;
       
    }
`