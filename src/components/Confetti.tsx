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
    const numParticles = 120;

    for (let i = 0; i < numParticles; i++) {
      const angle = (Math.random() * Math.PI / 2) + Math.PI / 4; // Cone upwards
      const speed = Math.random() * 18 + 12; // explosive burst speed
      particles.push({
        x: width / 2 + (Math.random() * 40 - 20), // slight horizontal spread at start
        y: height - 20, 
        r: Math.random() * 5 + 3,
        dx: Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1), // shoot left and right
        dy: -Math.sin(angle) * speed, // shoot up
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0,
        tiltAngleInc: (Math.random() * 0.1) + 0.05,
      });
    }

    let animationId: number;

    const render = () => {
      animationId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleInc;
        p.dy += 0.3; // Gravity
        p.dx *= 0.99; // Air resistance
        p.x += p.dx + Math.sin(p.tiltAngle) * 1.5;
        p.y += p.dy;
        p.tilt = Math.sin(p.tiltAngle) * 15;

        // Draw particle
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();

        // If particle drops way below screen, stop processing it
        if (p.y > height + 50) {
          particles[idx] = { ...p, dx: 0, dy: 0, y: height + 100 };
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
