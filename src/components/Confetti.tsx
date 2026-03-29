import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  color: string;
  tilt: number;
  tiltAngle: number;
  tiltAngleInc: number;
}

const colors = ['#dc2626', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let particles: Particle[] = [];
    const numParticles = 150;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height, // Start above screen
        r: Math.random() * 4 + 2, // Radius
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0,
        tiltAngleInc: (Math.random() * 0.07) + 0.05,
      });
    }

    let animationId: number;

    const render = () => {
      animationId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.tiltAngle) + p.dy + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle) * 15;

        // Draw particle
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();

        // If particle drops below screen or moves side, respawn
        if (p.x > width + 20 || p.x < -20 || p.y > height) {
          particles[idx] = {
            ...p,
            x: Math.random() * width,
            y: -20,
            tilt: Math.floor(Math.random() * 10) - 10,
          };
        }
      });
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    // Stop after 5 seconds to prevent infinite animation
    const timeoutId = setTimeout(() => {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, width, height);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
