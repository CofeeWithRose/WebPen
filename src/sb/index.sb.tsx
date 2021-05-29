
import React, { useEffect, useRef } from 'react'
import { create, PenPannel, Pen } from 'webpen';
export default {
    title: 'Example/Pannel',
    component: Pannel,
  };
console.log(create);

export function Pannel() {
  
    const pannelRef = useRef<PenPannel|null>(null)
    const conainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if(!conainerRef.current) return
      const pannel = pannelRef.current = create(conainerRef.current)
      pannel.usePen(Pen)
      pannel.loadWork()
      pannel.getWork()

    }, [])

    return <div ref={conainerRef}/>
}