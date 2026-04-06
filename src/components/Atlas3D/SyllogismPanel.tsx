import { useEffect, useState } from 'react'
import { X, ArrowRight, Dumbbell, BookOpen, Zap } from 'lucide-react'
import { type Syllogism } from '../../lib/logic'

interface SyllogismPanelProps {
  syllogism: Syllogism | null
  onClose: () => void
  onPractice: (s: Syllogism) => void
}

const FIGURE_COLORS: Record<number, string> = {
  1: '#06D6A0',
  2: '#FFD166',
  3: '#EF476F',
  4: '#118AB2',
}

const FIGURE_ROMAN: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }
const FIGURE_NAMES: Record<number, string> = { 1: 'Prima', 2: 'Secunda', 3: 'Tertia', 4: 'Quarta' }

const QUANTIFIER_LABELS: Record<string, { label: string; color: string; symbol: string }> = {
  A: { label: 'Universal Affirmative', color: '#06D6A0', symbol: '∀' },
  E: { label: 'Universal Negative',   color: '#EF476F', symbol: '∀¬' },
  I: { label: 'Particular Affirmative',color: '#FFD166', symbol: '∃' },
  O: { label: 'Particular Negative',  color: '#FF9A3C', symbol: '∃¬' },
}

function PropRow({ label, prop, accent }: { label: string; prop: any; accent: string }) {
  const q = QUANTIFIER_LABELS[prop.quantifier]
  return (
    <div className="group">
      <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: `${accent}99` }}>
        {label}
      </div>
      <div
        className="flex items-start gap-3 p-3 rounded-lg border transition-all"
        style={{ borderColor: `${accent}22`, background: `${accent}08` }}
      >
        <div
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black font-mono"
          style={{ background: `${accent}22`, color: accent }}
        >
          {prop.quantifier}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm italic leading-snug text-white/90" style={{ fontFamily: 'Georgia, serif' }}>
            <span className="font-bold not-italic" style={{ color: accent }}>
              {prop.quantifier === 'A' ? 'All' : prop.quantifier === 'E' ? 'No' : 'Some'}&nbsp;
            </span>
            {prop.subject}
            {prop.quantifier === 'O' ? <span className="font-bold not-italic" style={{ color: accent }}>&nbsp;are not&nbsp;</span> : <span className="font-bold not-italic" style={{ color: accent }}>&nbsp;are&nbsp;</span>}
            {prop.predicate}.
          </div>
          <div className="text-[9px] mt-1" style={{ color: `${accent}66` }}>
            {q?.symbol} — {q?.label}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SyllogismPanel({ syllogism, onClose, onPractice }: SyllogismPanelProps) {
  const [mounted, setMounted] = useState(false)
  const [prevSyllogism, setPrevSyllogism] = useState<Syllogism | null>(null)

  useEffect(() => {
    if (syllogism) {
      setMounted(false)
      setPrevSyllogism(syllogism)
      const t = setTimeout(() => setMounted(true), 20)
      return () => clearTimeout(t)
    } else {
      setMounted(false)
    }
  }, [syllogism])

  const s = syllogism || prevSyllogism
  if (!s) return null

  const color = FIGURE_COLORS[s.figure]

  return (
    <div
      className="absolute top-0 right-0 h-full z-20 flex items-stretch"
      style={{
        width: '380px',
        transform: mounted ? 'translateX(0)' : 'translateX(102%)',
        transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div
        className="flex flex-col h-full w-full overflow-hidden"
        style={{
          background: 'rgba(5, 8, 20, 0.92)',
          backdropFilter: 'blur(20px)',
          borderLeft: `2px solid ${color}44`,
        }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: `${color}22` }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="text-[9px] font-black uppercase tracking-[0.3em] font-mono px-2 py-0.5 rounded"
                style={{ color, background: `${color}18` }}
              >
                Figure {FIGURE_ROMAN[s.figure]} · {FIGURE_NAMES[s.figure]}
              </div>
            </div>
            <div
              className="text-3xl font-black leading-none"
              style={{ color: 'white', fontFamily: 'Georgia, serif' }}
            >
              {s.name || s.mood}
            </div>
            <div
              className="text-sm italic mt-1"
              style={{ color: `${color}cc`, fontFamily: 'Georgia, serif' }}
            >
              {s.mnemonic}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center mt-1 transition-all hover:scale-110"
            style={{ background: `${color}18`, color: `${color}bb` }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Mood badge */}
        <div className="px-5 py-4 border-b" style={{ borderColor: `${color}22` }}>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: `${color}77` }}>
            Mood Code
          </div>
          <div className="flex gap-2">
            {s.mood.split('').map((q, i) => (
              <div
                key={i}
                className="flex-1 py-2 rounded-lg text-center"
                style={{ background: `${QUANTIFIER_LABELS[q]?.color}15`, border: `1px solid ${QUANTIFIER_LABELS[q]?.color}44` }}
              >
                <div className="text-xl font-black font-mono" style={{ color: QUANTIFIER_LABELS[q]?.color }}>
                  {q}
                </div>
                <div className="text-[7px] uppercase font-bold mt-0.5 opacity-60" style={{ color: QUANTIFIER_LABELS[q]?.color }}>
                  {['Major', 'Minor', 'Concl.'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Propositions */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <PropRow label="Major Premise" prop={s.premises.major} accent={color} />
          <PropRow label="Minor Premise" prop={s.premises.minor} accent={color} />

          {/* Conclusion */}
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: `${color}99` }}>
              ∴ Conclusion
            </div>
            <div
              className="p-3 rounded-lg border"
              style={{ borderColor: `${color}55`, background: `${color}14` }}
            >
              <div className="text-sm italic font-semibold text-white leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                <span style={{ color }}>∴&nbsp;</span>
                {s.conclusion.quantifier === 'A' ? 'All' : s.conclusion.quantifier === 'E' ? 'No' : 'Some'}&nbsp;
                {s.conclusion.subject}&nbsp;
                {s.conclusion.quantifier === 'O' ? 'are not' : 'are'}&nbsp;
                {s.conclusion.predicate}.
              </div>
            </div>
          </div>

          {/* Terms legend */}
          <div className="mt-4 p-3 rounded-lg" style={{ background: '#ffffff08', border: '1px solid #ffffff0d' }}>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 text-white/40">Terms</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Major (P)', term: s.terms.majorTerm, c: '#7c6aff' },
                { label: 'Minor (S)', term: s.terms.minorTerm, c: '#ff6a9e' },
                { label: 'Middle (M)', term: s.terms.middleTerm, c: '#6adfff' },
              ].map(({ label, term, c }) => (
                <div key={label} className="text-center">
                  <div className="text-[7px] uppercase font-bold mb-0.5" style={{ color: `${c}99` }}>{label}</div>
                  <div className="text-[10px] font-bold" style={{ color: c }}>{term}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-5 border-t" style={{ borderColor: `${color}22` }}>
          <button
            onClick={() => onPractice(s)}
            className="w-full py-3 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${color}cc, ${color}88)`,
              color: '#050810',
              boxShadow: `0 4px 20px ${color}44`,
            }}
          >
            <Dumbbell size={14} />
            Practice This Syllogism
          </button>

          <div className="flex items-center gap-1 justify-center mt-3">
            <Zap size={10} className="opacity-40 text-white" />
            <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">
              Opens in Practice mode
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
