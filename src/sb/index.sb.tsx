
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
      brushEl.state = { width: 100 , color: {r: 0,g: 1, b: 0, a: 1}}
      brushEl.data = [ 
        { position: {x: 1, y: 1 }, press: 1 } ,
        { position: {x: 800, y: 0 }, press: 10 } ,
        // { position: {x: 2, y: 500 }, press: 1 } ,
        // { position: {x: 500, y: 500 }, press: 1 } ,
      ]
      pannel.load(root)

    }, [])

    return <div ref={conainerRef}/>
}