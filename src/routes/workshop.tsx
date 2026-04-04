import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { useSettings } from '../contexts/SettingsContext'
import { createSyllogism, generateDiagram, validateUserDiagram, type Syllogism, type Figure, type CellValue } from '../lib/logic'
import { BiliteralDiagram } from '../components/learn/BiliteralDiagram'
import { TriliteralDiagram } from '../components/learn/TriliteralDiagram'
import { Check, Clipboard, Eraser, Eye } from 'lucide-react'
import { PropositionLogicSequence } from '../components/PropositionLogicSequence'

import standardSyllogisms from '../data/syllogisms_standard.json'
import customSyllogisms from '../data/syllogisms_custom.json'

export const Route = createFileRoute('/workshop')({ component: WorkshopPage })

const FIGURE_LABELS: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

function PropositionDetail({ quantifier, subject, predicate, termX, termY, termM, t, syllogism, prop }: {
  quantifier: string
  subject: string
  predicate: string
  termX: string
  termY: string
  termM: string
  t: (key: string) => string
  syllogism: Syllogism
  prop: { quantifier: string; subject: string; predicate: string }
}) {
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

  return (
    <div className="space-y-1">
      <p className="text-sm leading-snug" style={{ color: 'var(--sea-ink)' }}>
        {formatProp(quantifier, subject, predicate)}
      </p>
      <div className="text-xs font-mono" style={{ color: 'var(--sea-ink-soft)' }}>
        {quantifier === 'A' && <span>∀x (X(x) → Y(x)) — <em>For all x, if x is X then x is Y</em></span>}
        {quantifier === 'E' && <span>¬∃x (X(x) ∧ Y(x)) — <em>There does not exist an x that is both X and Y</em></span>}
        {quantifier === 'I' && <span>∃x (X(x) ∧ Y(x)) — <em>There exists an x that is both X and Y</em></span>}
        {quantifier === 'O' && <span>∃x (X(x) ∧ ¬Y(x)) — <em>There exists an x that is X but not Y</em></span>}
      </div>
      <PropositionLogicSequence prop={prop} syllogism={syllogism} />
    </div>
  )
}

function WorkshopPage() {
  const { t } = useTranslation()
  const { premiseOrder } = useSettings()
  const [syllogismSet, setSyllogismSet] = useState<'standard' | 'custom'>('standard')
  const [selectedFigure, setSelectedFigure] = useState<Figure>(1)
  const [selectedSyllogism, setSelectedSyllogism] = useState<Syllogism | null>(null)

  // User's diagram states
  const [userTriliteral, setUserTriliteral] = useState<Record<string, 'empty' | 'occupied' | null>>({})
  const [userBiliteral, setUserBiliteral] = useState<Record<string, 'empty' | 'occupied' | null>>({})
  const [validationResult, setValidationResult] = useState<{ isCorrect: boolean; errors: string[] } | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [copied, setCopied] = useState(false)
  const [diagramVersion, setDiagramVersion] = useState(0)

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
      setUserTriliteral({})
      setUserBiliteral({})
      setValidationResult(null)
      setShowAnswer(false)
    }
  }, [selectedFigure, syllogismSet, figureSyllogisms])

  const diagramEncoding = selectedSyllogism ? generateDiagram(selectedSyllogism) : null

  // Correct answer states
  const correctTriliteralState = useMemo(() => {
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

  const correctBiliteralState = useMemo(() => {
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

  const handleCheckAnswer = useCallback(() => {
    if (!selectedSyllogism || !diagramEncoding) return

    const getStateCode = (state: Record<string, 'empty' | 'occupied' | null>, cellIds: number[], prefix: string) => {
      return cellIds.map(id => {
        const key = prefix === 'lg' ? `${prefix}_${id}` : `${prefix}${id}`
        const val = state[key] === 'occupied' ? '1' : state[key] === 'empty' ? '0' : '-'
        return `${id}-${val}`
      }).join(',')
    }

    const userDD = `DD=${getStateCode(userTriliteral, [9, 10, 11, 12, 13, 14, 15, 16], 'lg')}`
    const userMD = `MD=${getStateCode(userBiliteral, [5, 6, 7, 8], 'c')}`
    const result = validateUserDiagram(userDD, userMD, diagramEncoding)

    setValidationResult({ isCorrect: result.isCorrect, errors: result.errors })
  }, [selectedSyllogism, diagramEncoding, userTriliteral, userBiliteral])

  const handleClear = useCallback(() => {
    setUserTriliteral({})
    setUserBiliteral({})
    setValidationResult(null)
    setShowAnswer(false)
    setDiagramVersion(v => v + 1)
  }, [])

  const handleCopySolution = useCallback(() => {
    if (!diagramEncoding || !selectedSyllogism) return

    const ddCells = diagramEncoding.ddCells
    const mdCells = diagramEncoding.mdCells

    const formatCell = (cells: Record<number, CellValue>, ids: number[]) => {
      return ids.map(id => `${id}-${cells[id]}`).join(',')
    }

    const text = `${t('workshop.syllogism')}: ${selectedSyllogism.mood}-${selectedSyllogism.figure} (${selectedSyllogism.mnemonic})

${t('workshop.major_premise')}: ${selectedSyllogism.premises.major.quantifier} ${selectedSyllogism.premises.major.subject} ${selectedSyllogism.premises.major.predicate}
${t('workshop.minor_premise')}: ${selectedSyllogism.premises.minor.quantifier} ${selectedSyllogism.premises.minor.subject} ${selectedSyllogism.premises.minor.predicate}
${t('workshop.conclusion')}: ${selectedSyllogism.conclusion.quantifier} ${selectedSyllogism.conclusion.subject} ${selectedSyllogism.conclusion.predicate}

DD=${formatCell(ddCells, [9, 10, 11, 12, 13, 14, 15, 16])}
MD=${formatCell(mdCells, [5, 6, 7, 8])}`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [diagramEncoding, selectedSyllogism, t])

  if (!selectedSyllogism) return null

  const displayTriliteralState = showAnswer ? correctTriliteralState : userTriliteral
  const displayBiliteralState = showAnswer ? correctBiliteralState : userBiliteral

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
                  onClick={() => {
                    setSelectedSyllogism(s)
                    setUserTriliteral({})
                    setUserBiliteral({})
                    setValidationResult(null)
                    setShowAnswer(false)
                  }}
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

              {/* Premises - order based on premiseOrder setting */}
              {(premiseOrder === 'major-first'
                ? [
                    { label: t('workshop.major_premise'), prop: selectedSyllogism.premises.major },
                    { label: t('workshop.minor_premise'), prop: selectedSyllogism.premises.minor },
                  ]
                : [
                    { label: t('workshop.minor_premise'), prop: selectedSyllogism.premises.minor },
                    { label: t('workshop.major_premise'), prop: selectedSyllogism.premises.major },
                  ]
              ).map((item, idx) => (
                <div className="mb-3" key={idx}>
                  <div className="text-[10px] font-bold uppercase text-[var(--lagoon)] mb-1">{item.label}</div>
                  <PropositionDetail
                    quantifier={item.prop.quantifier}
                    subject={item.prop.subject}
                    predicate={item.prop.predicate}
                    termX={selectedSyllogism.terms.minorTerm}
                    termY={selectedSyllogism.terms.majorTerm}
                    termM={selectedSyllogism.terms.middleTerm}
                    t={t}
                    syllogism={selectedSyllogism}
                    prop={item.prop}
                  />
                </div>
              ))}

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
                  syllogism={selectedSyllogism}
                  prop={selectedSyllogism.conclusion}
                />
              </div>
            </div>
          </div>

          {/* Diagrams and Buttons Section */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Center: Triliteral Diagram (Interactive) */}
            <div className="p-2 rounded-xl border bg-white">
              <div className="text-[10px] font-bold uppercase text-[var(--sea-ink-soft)] mb-1 text-center">
                {t('workshop.triliteral_diagram')}
              </div>
              <div className="flex justify-center">
                <TriliteralDiagram
                  key={`tri-${selectedSyllogism.id}-${showAnswer}-${diagramVersion}`}
                  xLabel={selectedSyllogism.terms.minorTerm}
                  yLabel={selectedSyllogism.terms.majorTerm}
                  mLabel={selectedSyllogism.terms.middleTerm}
                  initialState={displayTriliteralState}
                  onStateChange={showAnswer ? undefined : setUserTriliteral}
                  readOnly={showAnswer}
                  showLabels={true}
                />
              </div>
              <div className="mt-1 text-center text-[10px] text-[var(--sea-ink-soft)]">
                {showAnswer ? t('workshop.triliteral_desc') : t('workshop.click_to_place')}
              </div>
            </div>

            {/* Right: Biliteral Diagram (Interactive) */}
            <div className="p-2 rounded-xl border bg-white">
              <div className="text-[10px] font-bold uppercase text-[var(--sea-ink-soft)] mb-1 text-center">
                {t('workshop.biliteral_diagram')}
              </div>
              <div className="flex justify-center">
                <BiliteralDiagram
                  key={`bil-${selectedSyllogism.id}-${showAnswer}-${diagramVersion}`}
                  xLabel={selectedSyllogism.terms.minorTerm}
                  yLabel={selectedSyllogism.terms.majorTerm}
                  initialState={displayBiliteralState}
                  onStateChange={showAnswer ? undefined : setUserBiliteral}
                  readOnly={showAnswer}
                  showLabels={true}
                />
              </div>
              <div className="mt-1 text-center text-[10px] text-[var(--sea-ink-soft)]">
                {showAnswer ? t('workshop.biliteral_desc') : t('workshop.click_to_place')}
              </div>
            </div>

            {/* Action Buttons below diagrams */}
            <div className="md:col-span-2 mt-1 flex flex-wrap gap-2 justify-center">
              <button
                onClick={handleCheckAnswer}
                disabled={showAnswer}
                className="h-8 px-4 rounded-lg bg-[var(--lagoon)] text-white font-bold text-xs uppercase tracking-wide cursor-pointer hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Check size={12} />
                {t('workshop.check_answer')}
              </button>
              <button
                onClick={handleClear}
                className="h-8 px-4 rounded-lg bg-transparent border border-[var(--line)] text-[var(--sea-ink)] font-bold text-xs uppercase tracking-wide cursor-pointer hover:bg-[var(--foam)] transition-all flex items-center gap-1.5"
              >
                <Eraser size={12} />
                {t('workshop.clear_board')}
              </button>
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="h-8 px-4 rounded-lg bg-[var(--foam)] border border-[var(--line)] text-[var(--sea-ink)] font-bold text-xs uppercase tracking-wide cursor-pointer hover:bg-[var(--sand)] transition-all flex items-center gap-1.5"
              >
                <Eye size={12} />
                {showAnswer ? t('workshop.hide_answer') : t('workshop.show_answer')}
              </button>
              <button
                onClick={handleCopySolution}
                className="h-8 px-4 rounded-lg bg-[var(--palm)] text-white font-bold text-xs uppercase tracking-wide cursor-pointer hover:brightness-110 transition-all flex items-center gap-1.5"
              >
                {copied ? <Check size={12} /> : <Clipboard size={12} />}
                {copied ? t('workshop.copied') : t('workshop.copy_solution')}
              </button>
            </div>
          </div>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <div className={`mt-6 p-4 rounded-xl border-2 ${
            validationResult.isCorrect
              ? 'bg-[var(--hero-a)] border-[var(--palm)]'
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center gap-3">
              {validationResult.isCorrect ? (
                <>
                  <Check size={24} className="text-[var(--palm)]" />
                  <span className="font-bold text-[var(--palm)]">{t('workshop.correct')}</span>
                </>
              ) : (
                <>
                  <span className="text-red-500 font-bold text-lg">✗</span>
                  <span className="font-bold text-red-600">{t('workshop.incorrect')}</span>
                </>
              )}
            </div>
            {!validationResult.isCorrect && validationResult.errors.length > 0 && (
              <div className="mt-2 text-xs text-red-600 font-mono">
                {validationResult.errors.join(', ')}
              </div>
            )}
          </div>
        )}

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
