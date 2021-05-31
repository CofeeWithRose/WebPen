
import React, { useEffect, useRef } from 'react'
import { createPannel, PannelInfer, PannelEl, LayerEl, BrushEl } from 'webpen';
export default {
    title: 'Example/Pannel',
    component: Pannel,
  };

export function Pannel() {
  
    const pannelRef = useRef<PannelInfer|null>(null)
    const conainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if(!conainerRef.current) return
      const pannel = pannelRef.current = createPannel(conainerRef.current)
      // pannel.usePen('Pen')
      // pannel.loadWork({ name: 'hello', size: {w: 100, h: 100}})
      // pannel.getWork()
      const root = new PannelEl()
      const layyer = root.addChild(new LayerEl())
      root.activeLayerId = layyer.id
      const brushEl = layyer.addChild(new BrushEl())
      brushEl.data = [ 
        { position: {x: 0, y: 0 }, press: 1 } ,
        { position: {x: 100, y: 0 }, press: 1 } ,
        { position: {x: 0, y: 100 }, press: 1 } ,
      ]
      pannel.load(root)

    }, [])

    return <div ref={conainerRef}/>
}