import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import {
  type Syllogism,
  type Figure,
  SYLLOGISM_EXAMPLES
} from '../lib/logic'
import { SolveModal } from '../components/SolveModal'
import { BookOpen, Search, ArrowRight, CheckCircle2 } from 'lucide-react'

type AtlasSearchParams = {
  mood?: string
}

export const Route = createFileRoute('/syllogisms')({
  component: SyllogismsPage,
  validateSearch: (search: Record<string, unknown>): AtlasSearchParams => {
    return {
      mood: typeof search.mood === 'string' ? search.mood : undefined,
    }
  },
})

function SyllogismsPage() {
  const { t } = useTranslation()
  const search = useSearch({ from: '/syllogisms' })
  const navigate = useNavigate()
  const [selectedSyllogism, setSelectedSyllogism] = useState<Syllogism | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Find the syllogism matching the URL search param
  const selectedFromUrl = useMemo(() => {
    if (!search.mood) return null
    return SYLLOGISM_EXAMPLES.find(s => s.id === search.mood) || null
  }, [search.mood])

  const lastSelectedId = selectedFromUrl?.id || null

  const groupedSyllogisms = useMemo(() => {
    const res: Record<Figure, Syllogism[]> = { 1: [], 2: [], 3: [], 4: [] }
    SYLLOGISM_EXAMPLES.forEach(s => {
      if (
        s.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mnemonic.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        res[s.figure].push(s)
      }
    })
    return res
  }, [searchQuery])

  const FIGURE_LABLES: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

  return (
    <main className="page-wrap px-4 pb-20 pt-14">
      {selectedSyllogism && (
        <SolveModal 
          syllogism={selectedSyllogism} 
          onClose={() => setSelectedSyllogism(null)} 
        />
      )}

      <div className="max-w-6xl mx-auto mt-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-2 border-[var(--line)] pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[var(--lagoon)]">
              <BookOpen size={24} strokeWidth={2.5} />
              <span className="text-xs font-black uppercase tracking-[0.2em] font-mono">{t('atlas.footer.label')}</span>
            </div>
            <h1 className="text-4xl font-black text-[var(--sea-ink)] leading-none italic" style={{ fontFamily: 'var(--font-serif)' }}>
              {t('atlas.title')}
            </h1>
            <p className="text-sm text-[var(--sea-ink-soft)] max-w-lg leading-relaxed">
              {t('atlas.subtitle')}
            </p>
          </div>

          <div className="relative group min-w-[280px]">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sea-ink-soft)] transition-colors group-focus-within:text-[var(--lagoon)]" size={16} />
             <input
               type="text"
               placeholder={t('atlas.search_placeholder')}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-[var(--foam)] border-2 border-[var(--line)] rounded-lg text-sm font-mono focus:border-[var(--lagoon)] focus:ring-0 transition-all outline-none"
             />
          </div>
        </div>

        {/* Figures Grid/Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {([1, 2, 3, 4] as Figure[]).map(fig => (
            <section key={fig} className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                <h2 className="text-xl font-bold flex items-center gap-3" style={{ color: 'var(--sea-ink)' }}>
                  <span className="w-8 h-8 flex items-center justify-center bg-[var(--sand)] border border-[var(--line)] rounded-lg text-xs font-black font-mono">
                    {FIGURE_LABLES[fig]}
                  </span>
                  {t('atlas.figure')} {FIGURE_LABLES[fig]}
                </h2>
                <span className="text-[10px] font-mono font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest">
                  {groupedSyllogisms[fig].length} {t('atlas.syllogisms_count').replace('{count}', '')}
                </span>
              </div>

              <div className="bg-[var(--surface-strong)] border-2 border-[var(--line)] rounded overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--sand)] border-b border-[var(--line)]">
                      <th className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[var(--sea-ink-soft)]">{t('atlas.table.mood')}</th>
                      <th className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[var(--sea-ink-soft)]">{t('atlas.table.mnemonic')}</th>
                      <th className="px-4 py-2 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {groupedSyllogisms[fig].map(s => {
                      const isSelected = lastSelectedId === s.id
                      return (
                        <tr
                          key={s.id}
                          onClick={() => {
                            setSelectedSyllogism(s)
                            // Update URL with selected mood
                            navigate({
                              search: (prev: Record<string, unknown>) => ({ ...prev, mood: s.id }),
                              replace: true,
                            })
                          }}
                          className={`group cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[var(--lagoon)]/10 border-l-2 border-l-[var(--lagoon)]'
                              : 'hover:bg-[var(--foam)]'
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <CheckCircle2 size={14} className="text-[var(--lagoon)] shrink-0" />
                              )}
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                                isSelected
                                  ? 'bg-[var(--lagoon)] text-white border-[var(--lagoon)]'
                                  : 'bg-[var(--foam)] border border-[var(--line)] text-[var(--lagoon)] group-hover:border-[var(--lagoon)]'
                              }`}>
                                {s.mood}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-sm italic transition-all ${
                              isSelected
                                ? 'font-bold text-[var(--lagoon)]'
                                : 'text-[var(--sea-ink)]'
                            }`} style={{ fontFamily: 'var(--font-serif)' }}>
                              {s.mnemonic}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className={`inline-flex items-center justify-center w-6 h-6 rounded border border-transparent transition-all ${
                              isSelected
                                ? 'border-[var(--lagoon)] bg-[var(--lagoon)] text-white scale-100'
                                : 'text-[var(--sea-ink-soft)] group-hover:border-[var(--lagoon)] group-hover:bg-white group-hover:text-[var(--lagoon)] scale-0 group-hover:scale-100'
                            }`}>
                              <ArrowRight size={14} />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {groupedSyllogisms[fig].length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-xs text-[var(--sea-ink-soft)] italic">
                          {t('atlas.no_results')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        {/* Global Stats Footer */}
        <div className="mt-20 p-8 border-2 border-dashed border-[var(--line)] rounded-xl bg-[var(--foam)] flex flex-col items-center text-center space-y-4">
           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--sea-ink-soft)]">{t('atlas.footer.label')}</div>
           <p className="text-sm text-[var(--sea-ink)] font-serif italic max-w-2xl leading-relaxed">
             {t('atlas.footer.quote')}
           </p>
           <div className="flex gap-10 mt-4">
              <div className="text-center">
                 <div className="text-2xl font-bold text-[var(--lagoon)]">24</div>
                 <div className="text-[9px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest mt-1">Total Valid</div>
              </div>
              <div className="text-center">
                 <div className="text-2xl font-bold text-[var(--palm)]">4</div>
                 <div className="text-[9px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest mt-1">Logical Figures</div>
              </div>
              <div className="text-center">
                 <div className="text-2xl font-bold text-[var(--sea-ink)]">6</div>
                 <div className="text-[9px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest mt-1">Moods / Figure</div>
              </div>
           </div>
        </div>
      </div>
    </main>
  )
}
