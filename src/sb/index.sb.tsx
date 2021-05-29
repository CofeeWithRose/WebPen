
import React, { useRef } from 'react'
import { create, PenPannel } from 'webpen';
export default {
    title: 'Example/Pannel',
    component: Pannel,
  };
console.log(create);

export function Pannel() {
    const pannelRef = useRef<PenPannel>(null)

    return <div/>
}