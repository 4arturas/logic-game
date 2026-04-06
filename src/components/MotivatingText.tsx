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

const INCORRECT_MOTIVATIONS = [
  "Don't give up!",
  "Almost there!",
  "Keep analyzing!",
  "Logic takes practice!",
  "You can do this!",
  "Try a different approach!"
];

interface MotivatingTextProps {
  triggerId: number;
  type?: 'correct' | 'incorrect';
}

export default function MotivatingText({ triggerId, type = 'correct' }: MotivatingTextProps) {
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);
  const [currentType, setCurrentType] = useState(type);

  useEffect(() => {
    if (triggerId === 0) return; // Don't trigger on initial load

    const bank = type === 'correct' ? MOTIVATIONS : INCORRECT_MOTIVATIONS;
    const randomText = bank[Math.floor(Math.random() * bank.length)];
    setText(randomText);
    setCurrentType(type);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [triggerId, type]);

  if (!visible) return null;

  const textColor = currentType === 'correct' ? '#FFD166' : 'white';
  const shadowColor = currentType === 'correct' ? 'var(--sea-ink)' : 'var(--lagoon)';

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[150]">
      <div 
        className="font-black italic uppercase text-5xl tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] fade-up-animation"
        style={{
          color: textColor,
          WebkitTextStroke: `2px ${shadowColor}`,
          textShadow: `3px 3px 0 ${shadowColor}`,
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
