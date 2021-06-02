
import React, { useEffect, useRef } from 'react'
import { createPannel, PannelInfer, PannelEl, LayerEl, BrushEl } from 'webpen';
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

    return <div ref={conainerRef}/>
}