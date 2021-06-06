export const LINE_VERTEXT_SHADER = `
    precision highp float;

    // gl窗口大小.
    uniform vec2 u_windowSize;

    // 笔刷宽度.
    uniform float u_brushWidth;

    // 偏移方向 -1/1.
    attribute vec2 a_direction;

    // 开始坐标.
    attribute vec2 a_position0;

    // 起始点压感 0~1.
    attribute float a_press0;

    // 结束坐标.
    attribute vec2 a_position1;

    // 结束点压感 0~1.
    attribute float a_press1;


    // 开始坐标之前的坐标.
    attribute vec2 a_position0_0;

    // 结束坐标之后的坐标.
    attribute vec2 a_position1_1;


    varying vec2 v_sp0;

    varying vec2 v_sp1;

    varying vec2 v_ep0;

    varying vec2 v_ep1;


    vec2 normalizeVec2 ( vec2 vector ) {
        return distance( vector, vec2(0,0) ) <= 0.0? vec2(0,0): normalize(vector);
    }

    float dotVec2 (vec2 v1, vec2 v2) {
        vec2 zero = vec2(0,0);
        return ((distance( v1, zero ) <= 0.0)||(distance( v2, zero ) <= 0.0))? 1.0: dot(v1, v2);
    }

    void main() { 


        float r1 = 0.5 * u_brushWidth * a_press1;

        // 线段方向.
        vec2 direction = normalizeVec2(a_position1 - a_position0);

        vec2 endPoint = a_position1 + r1 * direction;

        float r0 = 0.5 * u_brushWidth * a_press0;

        vec2 startPoint = a_position0 - r0 * direction;

        vec2 center = startPoint + 0.5 * (endPoint - startPoint);

        float dist =  0.5 * distance(startPoint, endPoint);

        vec2 canvasPosition = center + a_direction * dist;

        gl_Position = vec4( (canvasPosition/u_windowSize * 2.0 - 1.0) * vec2(1, -1), 1, 1 );


        vec2 rDirection0 = normalizeVec2 (normalizeVec2( a_position0_0 - a_position0) + direction);

        vec2 rDirection1 = normalizeVec2 (normalizeVec2( a_position1_1 - a_position1) - direction);
    
        float dotRDirection = dotVec2(rDirection0, rDirection1);

        v_sp0 = a_position0 + (r0 * rDirection0 * dotRDirection);

        v_sp1 = a_position0 - (r0 * rDirection0 * dotRDirection);

        v_ep0 = a_position1 + (r1 * rDirection1 * dotRDirection);

        v_ep1 = a_position1 - (r1 * rDirection1 * dotRDirection);

        /**
         * sp0 ------- ep0
         *  +           + 
         *  +           +  
         * sp1 ------- ep1
         * 
        */


    }
`

export const LINE_FRAGMENT_SHADER = `
    precision highp float;

    uniform vec4 u_brushColor;

    // gl窗口大小.
    uniform vec2 u_windowSize;


    /**
     * sp1 ------- sp0
     *  +           + 
     *  +           +  
     * ep1 ------- ep0
     * 
    */

    varying vec2 v_sp0;

    varying vec2 v_sp1;

    varying vec2 v_ep0;

    varying vec2 v_ep1;

    vec3 normalizeVec3 ( vec3 vector ) {
        return distance( vector, vec3(0,0, 0) ) <= 0.0? vec3(0,0, 0): normalize(vector);
    }

    vec3 crossVec3(vec3 v1, vec3 v2) {
       return distance( normalizeVec3(v1), normalizeVec3(v2)) <=0.0? vec3(0,0,0) : cross(v1, v2);
    }

    bool isPointIn(vec2 p0, vec2 p1, vec2 p2, vec2 p3, vec2 p4 ) {

        vec3 a = crossVec3( vec3(p2-p1, 0), vec3(p0-p1, 0) );

        vec3 b = crossVec3( vec3(p3-p2, 0), vec3(p0-p2, 0) );

        vec3 c = crossVec3( vec3(p4-p3, 0), vec3(p0-p3, 0) );

        vec3 d = crossVec3( vec3(p1-p4, 0), vec3(p0-p4, 0) );
        
        return a.z>=0.0 && b.z>=0.0 && c.z>=0.0 && d.z>=0.0;

    }

    void main(){

        // 当前坐标
        vec2 curPosition = vec2(gl_FragCoord.x, u_windowSize.y - gl_FragCoord.y);

        
        /**
         * sp0 ------- sp1
         *  +           + 
         *  +           +  
         * ep1 ------- ep0
         * 
        */
        // if(isPointIn(curPosition, v_sp1, v_sp0, v_ep1, v_ep0) ) {
        //     gl_FragColor = u_brushColor;
        // } else {
        //     discard;
        // }

        if(
            distance(curPosition, v_sp0) < 10.0 
            || distance(curPosition, v_sp1) < 10.0 
            // || distance(curPosition, v_ep0) < 10.0 
            // || distance(curPosition, v_ep1) < 10.0
        ) {
            gl_FragColor = u_brushColor;
        } else {
            discard;
        }
       
       
        
    }
`