import React, { useEffect, useRef } from 'react'


export default {
    title: 'Example/Composite',
    component: Composite,
};

export function Composite() {
   
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const acCanvas = canvasRef.current
        if(!acCanvas) return

        const canvas = document.createElement('canvas')
        canvas.width = 800
        canvas.height = 800

        const ctx = canvas.getContext('2d')
        const acCtx = acCanvas.getContext('2d')
        if(!ctx|| !acCtx) return
        ctx.fillStyle = 'rgba(212, 22, 22, 0.2)'
        ctx.fillRect(50,0, 100, 100)
        acCtx.drawImage(canvas, 0, 0)

        ctx.clearRect(0,0, 800,800)
        ctx.fillStyle = 'rgba(35,212,22,0.2)'
        ctx.fillRect(0,0, 100, 100)
        acCtx.drawImage(canvas, 0, 0)
        
    }, [])

    return <div>
        <canvas ref={canvasRef} width={800} height={800} />
    </div>
}