import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { createSyllogism, generateDiagram, type Syllogism, type Figure } from '../lib/logic'
import { BiliteralDiagram } from '../components/learn/BiliteralDiagram'
import { TriliteralDiagram } from '../components/learn/TriliteralDiagram'
import { Copy, Check } from 'lucide-react'

import standardSyllogisms from '../data/syllogisms_standard.json'
import customSyllogisms from '../data/syllogisms_custom.json'

export const Route = createFileRoute('/workshop')({ component: WorkshopPage })

const FIGURE_LABELS: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

function PropositionDetail({ quantifier, subject, predicate, termX, termY, termM, t }: {
  quantifier: string
  subject: string
  predicate: string
  termX: string
  termY: string
  termM: string
  t: (key: string) => string
}) {
  const [copied, setCopied] = useState(false)

  const subjectColor = subject === termX ? 'var(--term-x)' : subject === termY ? 'var(--term-y)' : subject === termM ? 'var(--term-m)' : 'var(--sea-ink)'
  const predicateColor = predicate === termX ? 'var(--term-x)' : predicate === termY ? 'var(--term-y)' : predicate === termM ? 'var(--term-m)' : 'var(--sea-ink)'

  const quantifierLabels: Record<string, string> = {
    A: t('workshop.quantifier_all'),
    E: t('workshop.quantifier_no'),
    I: t('workshop.quantifier_some'),
    O: t('workshop.quantifier_some_not'),
  }

  const formatProp = (q: string, s: string, p: string) => {
    const subjectEl = <span style={{ color: subjectColor, fontWeight: 700 }}>{s}</span>
    const predicateEl = <span style={{ color: predicateColor, fontWeight: 700 }}>{p}</span>
    const verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(w => p.includes(w)) ? t('workshop.have_verb') : t('workshop.are_verb')
    if (q === 'E') return <><span className="text-red-500 font-bold">{quantifierLabels[q]}</span> {subjectEl} {verb} {predicateEl}.</>
    if (q === 'O') return <><span className="text-amber-500 font-bold">{quantifierLabels[q]}</span> {subjectEl} {verb} {predicateEl}.</>
    if (q === 'A') return <><span className="text-[var(--lagoon)] font-bold">{quantifierLabels[q]}</span> {subjectEl} {verb} {predicateEl}.</>
    return <><span className="text-[var(--palm)] font-bold">{quantifierLabels[q]}</span> {subjectEl} {verb} {predicateEl}.</>
  }

  const symbolicLabels: Record<string, string> = {
    A: 'x₁y\'₀',
    E: 'x₁y₁ = 0',
    I: 'x₁y₁ > 0',
    O: 'x₁y\'₁ > 0',
  }
  const symbolicAlgebra: Record<string, string> = {
    A: 'x(1-y) = 0',
    E: 'xy = 0',
    I: 'xy ≠ 0',
    O: 'x(1-y) ≠ 0',
  }
  const setNotations: Record<string, string> = {
    A: 'x ⊆ y',
    E: 'x ∩ y = ∅',
    I: 'x ∩ y ≠ ∅',
    O: 'x ⊈ y',
  }
  const programmingLogic: Record<string, string> = {
    A: 'if (x && !y) return false',
    E: 'if (x && y) return false',
    I: 'return x && y',
    O: 'return x && !y',
  }
  const sqlQueries: Record<string, string> = {
    A: 'NOT EXISTS (SELECT 1 FROM things WHERE x = 1 AND y = 0)',
    E: 'NOT EXISTS (SELECT 1 FROM things WHERE x = 1 AND y = 1)',
    I: 'EXISTS (SELECT 1 FROM things WHERE x = 1 AND y = 1)',
    O: 'EXISTS (SELECT 1 FROM things WHERE x = 1 AND y = 0)',
  }

  const handleCopy = () => {
    const text = `Form: ${symbolicLabels[quantifier]} (${symbolicAlgebra[quantifier]})
Set: ${setNotations[quantifier]}
Programming: ${programmingLogic[quantifier]}
SQL: ${sqlQueries[quantifier]}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-4 rounded-xl border bg-[var(--surface-strong)] space-y-3">
      {/* Proposition Form */}
      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
          quantifier === 'A' ? 'bg-[var(--lagoon)] text-white' :
          quantifier === 'E' ? 'bg-red-600 text-white' :
          quantifier === 'I' ? 'bg-[var(--palm)] text-white' :
          'bg-amber-600 text-white'
        }`}>
          {quantifier}: {quantifierLabels[quantifier]}
        </span>
        <button onClick={handleCopy} className="p-1 hover:bg-[var(--foam)] rounded cursor-pointer transition-colors" title={t('workshop.copy_representations')}>
          {copied ? <Check size={16} className="text-[var(--palm)]" /> : <Copy size={16} className="text-[var(--sea-ink-soft)]" />}
        </button>
      </div>

      {/* Natural Language */}
      <p className="text-base font-serif italic text-[var(--sea-ink)]" style={{ fontFamily: 'var(--font-serif)' }}>
        {formatProp(quantifier, subject, predicate)}
      </p>

      {/* All Representations */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-2 rounded bg-[var(--foam)]">
          <div className="text-[9px] font-bold uppercase text-[var(--sea-ink-soft)] mb-0.5">{t('workshop.symbolic')}</div>
          <div className="font-mono text-[var(--lagoon)]">{symbolicLabels[quantifier]} <span className="text-[var(--sea-ink-soft)]">({symbolicAlgebra[quantifier]})</span></div>
        </div>
        <div className="p-2 rounded bg-[var(--foam)]">
          <div className="text-[9px] font-bold uppercase text-[var(--sea-ink-soft)] mb-0.5">{t('workshop.set_theory')}</div>
          <div className="font-serif text-lg text-[var(--term-x)]">{setNotations[quantifier]}</div>
        </div>
        <div className="p-2 rounded bg-[var(--foam)]">
          <div className="text-[9px] font-bold uppercase text-[var(--sea-ink-soft)] mb-0.5">{t('workshop.programming')}</div>
          <code className="font-mono text-[var(--palm)]">{programmingLogic[quantifier]}</code>
        </div>
        <div className="p-2 rounded bg-[var(--foam)]">
          <div className="text-[9px] font-bold uppercase text-[var(--sea-ink-soft)] mb-0.5">{t('workshop.sql')}</div>
          <code className="font-mono text-[var(--sea-ink)] text-[10px]">{sqlQueries[quantifier]}</code>
        </div>
      </div>
    </div>
  )
}

function WorkshopPage() {
  const { t } = useTranslation()
  const [syllogismSet, setSyllogismSet] = useState<'standard' | 'custom'>('standard')
  const [selectedFigure, setSelectedFigure] = useState<Figure>(1)
  const [selectedSyllogism, setSelectedSyllogism] = useState<Syllogism | null>(null)

  const syllogisms = useMemo(() => {
    const data = syllogismSet === 'standard' ? standardSyllogisms : customSyllogisms
    return data.map((d: any) => createSyllogism(d.figure as Figure, d.mood, d.terms))
  }, [syllogismSet])

  const figureSyllogisms = useMemo(() =>
    syllogisms.filter(s => s.figure === selectedFigure),
  [syllogisms, selectedFigure])

  // Auto-select first syllogism when figure/set changes
  useEffect(() => {
    if (figureSyllogisms.length > 0) {
      setSelectedSyllogism(figureSyllogisms[0])
    }
  }, [selectedFigure, syllogismSet, figureSyllogisms])

  const diagramEncoding = selectedSyllogism ? generateDiagram(selectedSyllogism) : null

  // Convert diagram encoding to CellState for diagrams
  const triliteralState = useMemo(() => {
    const state: Record<string, 'empty' | 'occupied' | null> = {}
    if (diagramEncoding?.explicitDDCells) {
      Object.entries(diagramEncoding.explicitDDCells).forEach(([k, v]) => {
        const num = parseInt(k)
        if (num >= 9 && num <= 16) {
          const key = `lg_${num}`
          state[key] = v === '1' ? 'occupied' : v === '0' ? 'empty' : null
        }
      })
    }
    return state
  }, [diagramEncoding])

  const biliteralState = useMemo(() => {
    const state: Record<string, 'empty' | 'occupied' | null> = {}
    if (diagramEncoding?.explicitMDCells) {
      Object.entries(diagramEncoding.explicitMDCells).forEach(([k, v]) => {
        const num = parseInt(k)
        if (num >= 5 && num <= 8) {
          const key = `c${num}`
          state[key] = v === '1' ? 'occupied' : v === '0' ? 'empty' : null
        }
      })
    }
    return state
  }, [diagramEncoding])

  if (!selectedSyllogism) return null

  return (
    <main className="page-wrap pb-16 pt-8" style={{ background: 'var(--page-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--sea-ink)', fontFamily: 'var(--font-serif)' }}>
            {t('workshop.title')}
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--sea-ink-soft)' }}>
            {t('workshop.subtitle')}
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          {/* Dataset Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-[var(--sea-ink-soft)]">{t('workshop.dataset')}</span>
            <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: 'var(--line)' }}>
              <button
                onClick={() => setSyllogismSet('standard')}
                className={`px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                  syllogismSet === 'standard' ? 'bg-[var(--lagoon)] text-white' : 'bg-[var(--foam)] text-[var(--sea-ink-soft)] hover:bg-[var(--sand)]'
                }`}
              >
                {t('workshop.standard')}
              </button>
              <button
                onClick={() => setSyllogismSet('custom')}
                className={`px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                  syllogismSet === 'custom' ? 'bg-[var(--lagoon)] text-white' : 'bg-[var(--foam)] text-[var(--sea-ink-soft)] hover:bg-[var(--sand)]'
                }`}
              >
                {t('workshop.custom')}
              </button>
            </div>
          </div>

          {/* Figure Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-[var(--sea-ink-soft)]">{t('workshop.figure')}</span>
            <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: 'var(--line)' }}>
              {([1, 2, 3, 4] as Figure[]).map(fig => (
                <button
                  key={fig}
                  onClick={() => setSelectedFigure(fig)}
                  className={`px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                    selectedFigure === fig ? 'bg-[var(--lagoon)] text-white' : 'bg-[var(--foam)] text-[var(--sea-ink-soft)] hover:bg-[var(--sand)]'
                  }`}
                >
                  {FIGURE_LABELS[fig]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Syllogism List */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {figureSyllogisms.map(s => {
              const isActive = selectedSyllogism.id === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSyllogism(s)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-[var(--lagoon)] text-white border-[var(--lagoon)]'
                      : 'bg-[var(--surface-strong)] text-[var(--sea-ink)] border-[var(--line)] hover:bg-[var(--foam)]'
                  }`}
                >
                  {s.mood}-{s.figure} <span className="opacity-60">{s.mnemonic}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Syllogism Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Syllogism Cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-4 rounded-xl border bg-[var(--surface-strong)]">
              <div className="text-xs font-bold uppercase text-[var(--sea-ink-soft)] mb-3">{t('workshop.syllogism')}</div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[var(--sand)] border text-[var(--sea-ink)]" style={{ borderColor: 'var(--line)' }}>
                  Fig. {FIGURE_LABELS[selectedSyllogism.figure]} • {selectedSyllogism.mood}
                </span>
                <span className="text-xs italic text-[var(--sea-ink-soft)]">{selectedSyllogism.mnemonic}</span>
              </div>

              {/* Major Premise */}
              <div className="mb-3">
                <div className="text-[10px] font-bold uppercase text-[var(--lagoon)] mb-1">{t('workshop.major_premise')}</div>
                <PropositionDetail
                  quantifier={selectedSyllogism.premises.major.quantifier}
                  subject={selectedSyllogism.premises.major.subject}
                  predicate={selectedSyllogism.premises.major.predicate}
                  termX={selectedSyllogism.terms.minorTerm}
                  termY={selectedSyllogism.terms.majorTerm}
                  termM={selectedSyllogism.terms.middleTerm}
                  t={t}
                />
              </div>

              {/* Minor Premise */}
              <div className="mb-3">
                <div className="text-[10px] font-bold uppercase text-[var(--lagoon)] mb-1">{t('workshop.minor_premise')}</div>
                <PropositionDetail
                  quantifier={selectedSyllogism.premises.minor.quantifier}
                  subject={selectedSyllogism.premises.minor.subject}
                  predicate={selectedSyllogism.premises.minor.predicate}
                  termX={selectedSyllogism.terms.minorTerm}
                  termY={selectedSyllogism.terms.majorTerm}
                  termM={selectedSyllogism.terms.middleTerm}
                  t={t}
                />
              </div>

              {/* Conclusion */}
              <div>
                <div className="text-[10px] font-bold uppercase text-[var(--palm)] mb-1">{t('workshop.conclusion')}</div>
                <PropositionDetail
                  quantifier={selectedSyllogism.conclusion.quantifier}
                  subject={selectedSyllogism.conclusion.subject}
                  predicate={selectedSyllogism.conclusion.predicate}
                  termX={selectedSyllogism.terms.minorTerm}
                  termY={selectedSyllogism.terms.majorTerm}
                  termM={selectedSyllogism.terms.middleTerm}
                  t={t}
                />
              </div>
            </div>
          </div>

          {/* Center: Triliteral Diagram */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-xl border bg-white">
              <div className="text-xs font-bold uppercase text-[var(--sea-ink-soft)] mb-4 text-center">
                {t('workshop.triliteral_diagram')}
              </div>
              <div className="flex justify-center">
                <TriliteralDiagram
                  xLabel={selectedSyllogism.terms.minorTerm}
                  yLabel={selectedSyllogism.terms.majorTerm}
                  mLabel={selectedSyllogism.terms.middleTerm}
                  initialState={triliteralState as Record<string, 'empty' | 'occupied' | null>}
                  readOnly={true}
                />
              </div>
              <div className="mt-4 text-center text-xs text-[var(--sea-ink-soft)]">
                {t('workshop.triliteral_desc')}
              </div>
            </div>
          </div>

          {/* Right: Biliteral Diagram */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-xl border bg-white">
              <div className="text-xs font-bold uppercase text-[var(--sea-ink-soft)] mb-4 text-center">
                {t('workshop.biliteral_diagram')}
              </div>
              <div className="flex justify-center">
                <BiliteralDiagram
                  xLabel={selectedSyllogism.terms.minorTerm}
                  yLabel={selectedSyllogism.terms.majorTerm}
                  initialState={biliteralState as Record<string, 'empty' | 'occupied' | null>}
                  readOnly={true}
                />
              </div>
              <div className="mt-4 text-center text-xs text-[var(--sea-ink-soft)]">
                {t('workshop.biliteral_desc')}
              </div>
            </div>
          </div>
        </div>

        {/* Terms Legend */}
        <div className="mt-8 p-4 rounded-xl border bg-[var(--surface-strong)]">
          <div className="text-xs font-bold uppercase text-[var(--sea-ink-soft)] mb-3">{t('workshop.term_colors')}</div>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold" style={{ color: 'var(--term-x)' }}>{t('workshop.minor_term_x')}</span>
              <span className="text-[var(--sea-ink-soft)]">= {selectedSyllogism.terms.minorTerm}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold" style={{ color: 'var(--term-y)' }}>{t('workshop.major_term_y')}</span>
              <span className="text-[var(--sea-ink-soft)]">= {selectedSyllogism.terms.majorTerm}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold" style={{ color: 'var(--term-m)' }}>{t('workshop.middle_term_m')}</span>
              <span className="text-[var(--sea-ink-soft)]">= {selectedSyllogism.terms.middleTerm}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
