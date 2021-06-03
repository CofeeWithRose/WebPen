
import React, { useEffect, useRef, useState } from 'react'
import { createPannel, PannelInfer } from 'webpen';
import VConsole from 'vconsole';
import { Color } from '../Color';

const vConsole = new VConsole();

export default {
    title: 'Example/Pannel',
    component: Pannel,
};

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
      pannel.brushState.width = 20 *window.devicePixelRatio
      pannel.brushState.color = new Color(0, 0,0, 0.2)

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

    const [ color, setColor ] = useState('#000000')

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

    const [opacity, setOpacity] = useState(0.2)

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

    const [brushWidth, setBrushWidth] = useState(20)

    const handleBrushWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
      const pannel = pannelRef.current
      if ( !pannel) return 
      const width =  parseInt(e.target.value)
      setBrushWidth(width)
      pannel.brushState.width = width
    }


    return <div>
      <div> 
        <button onClick={clear}>clear</button> 
        <button onClick={undo}>undo</button>
        <button onClick={redo}>redo</button>
        <input type="color" onChange={onColorChange} value={color}/>
        opacity <input type="range" min={0} max={1} onChange={handleOptChange} step={0.1} value={opacity} />
        brush width <input type="range" min={20} max={800} onChange={handleBrushWidth} step={0.1} value={brushWidth} />
      </div>
      <div style={{position: 'relative'}} ref={conainerRef}/>
    </div>
   
}