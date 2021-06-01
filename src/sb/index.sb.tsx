
import React, { useEffect, useRef } from 'react'
import { createPannel, PannelInfer, PannelEl, LayerEl, BrushEl } from 'webpen';
import VConsole from 'vconsole';

const vConsole = new VConsole();

export default {
    title: 'Example/Pannel',
    component: Pannel,
  };

export function Pannel() {
  
    const pannelRef = useRef<PannelInfer|null>(null)
    const conainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      document.body.style.overflow='hidden'
    },[])
    useEffect(() => {
      if(!conainerRef.current) return
      const pannel = pannelRef.current = createPannel(conainerRef.current, {width: window.innerWidth, height: window.innerHeight})
      
      pannel.load()

      pannel.brushState.width = 10

    }, [])

    return <div ref={conainerRef}/>
}