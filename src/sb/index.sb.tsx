
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { createPannel, PannelInfer } from 'webpen';
import VConsole from 'vconsole';
import { Color } from '../Color';

const vConsole = new VConsole({ maxLogNumber: 1000 });

export default {
    title: 'Example/Pannel',
    component: Pannel,
};

const defaultWidth = 170
const defaultColor = new Color()

export function Pannel() {
  
    const pannelRef = useRef<PannelInfer|null>(null)
    const conainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      document.body.style.overflow = 'hidden'
      // window.addEventListener( 'click', e => e.preventDefault())
      setInterval(async () => {
        const pannel = pannelRef.current
        if(pannel) {
          localStorage.setItem('xxx', await pannel.toJson())
          console.log('save..');
        }
      }, 5000)
    },[])

    useEffect(() => {
      if(!conainerRef.current) return
      const pannel = pannelRef.current = createPannel(
        conainerRef.current, 
        {
          width: window.innerWidth * window.devicePixelRatio, 
          height: window.innerHeight * window.devicePixelRatio,
        }
      )
      pannel.load(localStorage.getItem('xxx'))
      pannel.brushState.width = defaultWidth
      pannel.brushState.color = defaultColor
    }, [])

    

    const clear = () => {
      localStorage.removeItem('xxx')
      window.location.reload()
    }

    const undo = () => {
      const pannel = pannelRef.current
      pannel?.undo()
    }

    const redo = () => {
      const pannel = pannelRef.current
      pannel?.redo()
    }

    const [ color, setColor ] = useState(defaultColor.toRGBHex())

    const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const pannel = pannelRef.current
      if (!pannel) return
      const colorStr = e.target.value
      setColor(colorStr)
      const color: Color = new Color(
        parseInt(colorStr.substr(1, 2), 16),
        parseInt(colorStr.substr(3, 2), 16),
        parseInt(colorStr.substr(5, 2), 16),
        pannel.brushState.color.a,
      )
      pannel.brushState.color = color
    }

    const [opacity, setOpacity] = useState(defaultColor.a)

    const handleOptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const pannel = pannelRef.current
      if (!pannel) return
      const value = Number(e.target.value)
      setOpacity(value)
      const oldColor = pannel.brushState.color
      pannel.brushState.color = new Color(
        oldColor.r,
        oldColor.g,
        oldColor.b,
        value
      )
    }

    const [brushWidth, setBrushWidth] = useState(defaultWidth)

    const handleBrushWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
      const pannel = pannelRef.current
      if ( !pannel) return 
      const width =  parseInt(e.target.value)
      setBrushWidth(width)
      pannel.brushState.width = width
    }

    const preventDedault = (e: React.SyntheticEvent) => e.preventDefault()

    const nowrap: CSSProperties = {
      whiteSpace: 'nowrap'
    }

    return <div>
      <div> 
        <span onClick={preventDedault}>
          <button onClick={clear}>clear</button> 
          <button onClick={undo}>undo</button>
          <button onClick={redo}>redo</button>
        </span>
       
        <input type="color" onChange={onColorChange} value={color}/>
        <span style={nowrap}  onClick={preventDedault}>
          opacity {opacity} <input type="range" min={0} max={1} onChange={handleOptChange} step={0.01} value={opacity} />
        </span>
        <span style={nowrap} onClick={preventDedault} >
          brush width {brushWidth} <input type="range" min={20} max={800} onChange={handleBrushWidth} step={0.01} value={brushWidth} />
        </span>
        
      </div>
      <div style={{position: 'relative'}} ref={conainerRef}/>
    </div>
   
}