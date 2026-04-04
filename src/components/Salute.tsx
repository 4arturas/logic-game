import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
  alpha: number
  decay: number
  type: 'star' | 'circle' | 'sparkle'
}

const vibrantColors = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE',
  '#85C1E9', '#F0B27A', '#82E0AA', '#F1948A', '#AED6F1',
  '#FF69B4', '#00FF7F', '#FF4500', '#1E90FF', '#FF1493'
]

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const spikes = 5
  const outerRadius = size
  const innerRadius = size / 2
  let rot = Math.PI / 2 * 3
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(x, y - outerRadius)
  for (let i = 0; i < spikes; i++) {
    let px = x + Math.cos(rot) * outerRadius
    let py = y + Math.sin(rot) * outerRadius
    ctx.lineTo(px, py)
    rot += step
    px = x + Math.cos(rot) * innerRadius
    py = y + Math.sin(rot) * innerRadius
    ctx.lineTo(px, py)
    rot += step
  }
  ctx.closePath()
  ctx.fill()
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath()
  ctx.moveTo(x - size, y)
  ctx.lineTo(x + size, y)
  ctx.moveTo(x, y - size)
  ctx.lineTo(x, y + size)
  ctx.moveTo(x - size * 0.7, y - size * 0.7)
  ctx.lineTo(x + size * 0.7, y + size * 0.7)
  ctx.moveTo(x + size * 0.7, y - size * 0.7)
  ctx.lineTo(x - size * 0.7, y + size * 0.7)
  ctx.strokeStyle = ctx.fillStyle
  ctx.lineWidth = 2
  ctx.stroke()
}

export default function Salute() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = window.innerWidth
    const height = window.innerHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    const particles: Particle[] = []
    const explosions = 6

    // Create explosion bursts
    for (let e = 0; e < explosions; e++) {
      const cx = Math.random() * width * 0.8 + width * 0.1
      const cy = Math.random() * height * 0.5 + height * 0.1
      const numParticles = 40
      const baseColor = vibrantColors[Math.floor(Math.random() * vibrantColors.length)]

      for (let i = 0; i < numParticles; i++) {
        const angle = (Math.PI * 2 / numParticles) * i + Math.random() * 0.5
        const speed = Math.random() * 6 + 2
        const type = Math.random() > 0.5 ? 'star' : Math.random() > 0.5 ? 'sparkle' : 'circle'
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 4 + 2,
          color: baseColor,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.008,
          type,
        })
      }
    }

    // Add some falling sparks from top
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * width,
        y: -Math.random() * height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 4 + 2,
        r: Math.random() * 3 + 1,
        color: vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
        alpha: 1,
        decay: Math.random() * 0.01 + 0.005,
        type: 'sparkle',
      })
    }

    let animationId: number

    const render = () => {
      animationId = requestAnimationFrame(render)
      ctx.clearRect(0, 0, width, height)

      let hasParticles = false
      particles.forEach(p => {
        if (p.alpha <= 0) return
        hasParticles = true

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08 // gravity
        p.vx *= 0.99 // air resistance
        p.alpha -= p.decay

        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color

        if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.r * 2)
        } else if (p.type === 'sparkle') {
          drawSparkle(ctx, p.x, p.y, p.r * 2)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      if (!hasParticles) {
        cancelAnimationFrame(animationId)
        ctx.clearRect(0, 0, width, height)
      }
    }

    render()

    // Safety timeout
    const timeoutId = setTimeout(() => {
      cancelAnimationFrame(animationId)
      ctx.clearRect(0, 0, width, height)
    }, 6000)

    return () => {
      cancelAnimationFrame(animationId)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  )
}
