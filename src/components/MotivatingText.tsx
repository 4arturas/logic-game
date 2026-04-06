import { useEffect, useState } from 'react';

const MOTIVATIONS = [
  "Brilliant!",
  "Flawless Logic!",
  "Outstanding!",
  "Incredible!",
  "Unstoppable!",
  "Perfect Proof!",
  "Masterful!"
];

interface MotivatingTextProps {
  triggerId: number;
}

export default function MotivatingText({ triggerId }: MotivatingTextProps) {
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggerId === 0) return; // Don't trigger on initial load

    const randomText = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
    setText(randomText);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [triggerId]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[150]">
      <div 
        className="font-black italic uppercase text-5xl tracking-widest text-[#FFD166] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] fade-up-animation"
        style={{
          WebkitTextStroke: '2px var(--sea-ink)',
          textShadow: '3px 3px 0 var(--sea-ink)',
          animation: 'floatUpAndFade 2.5s ease-out forwards'
        }}
      >
        {text}
      </div>
      <style>{`
        @keyframes floatUpAndFade {
          0% { opacity: 0; transform: translateY(40px) scale(0.5) rotate(-5deg); }
          15% { opacity: 1; transform: translateY(0px) scale(1.2) rotate(3deg); }
          30% { transform: translateY(-10px) scale(1) rotate(0deg); }
          70% { opacity: 1; transform: translateY(-30px) scale(1); }
          100% { opacity: 0; transform: translateY(-50px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
