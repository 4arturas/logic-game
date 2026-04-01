import { useState } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { Clipboard, Check } from 'lucide-react'

interface CopyCodeProps {
  dd: string
  md: string
  terms: { x: string; y: string; m: string }
  syllogismText?: string
  onShowHelp?: () => void
  translateTerms?: boolean
}

export function CopyCode({ 
  dd, 
  md, 
  terms, 
  syllogismText, 
  onShowHelp, 
  translateTerms = true 
}: CopyCodeProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const getTerm = (val: string) => translateTerms ? t(val as any) : val
    
    const textToCopy = (syllogismText ? `${t('home.copy_prefix')}\n${syllogismText}\n\n` : '') +
      `${t('home.terms_label')}\nx: ${getTerm(terms.x)}\ny: ${getTerm(terms.y)}\nm: ${getTerm(terms.m)}\n\n` +
      `${t('home.solution_label')}\nDD=${dd}\nMD=${md}`
    
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[var(--surface)] p-4 rounded-xl shadow-md border-2 border-[var(--chip-line)] overflow-hidden transition-all hover:border-[var(--lagoon)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-black text-[var(--sea-ink-soft)] uppercase tracking-widest">{t('home.code')}</h3>
        <div className="flex gap-3 items-center">
          {onShowHelp && (
            <button
              onClick={onShowHelp}
              className="text-xl hover:scale-125 transition-transform p-1 leading-none drop-shadow-sm"
              title="Pagalba"
            >
              ❓
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 ${
              copied 
                ? 'bg-[var(--palm)] text-white' 
                : 'bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)]'
            }`}
          >
            {copied ? (
              <>
                <Check size={14} strokeWidth={3} />
                {t('home.copied')}
              </>
            ) : (
              <>
                <Clipboard size={14} />
                {t('home.copy')}
              </>
            )}
          </button>
        </div>
      </div>
      <div className="space-y-2 font-mono text-[10px] sm:text-xs">
        <div className="bg-[var(--foam)] p-2.5 rounded-lg border border-[var(--chip-line)] break-all shadow-inner group">
          <span className="text-[var(--lagoon)] font-bold mr-1">DD=</span>
          <span className="text-[var(--sea-ink)] group-hover:text-[var(--sea-ink-deep)] transition-colors">{dd}</span>
        </div>
        <div className="bg-[var(--foam)] p-2.5 rounded-lg border border-[var(--chip-line)] break-all shadow-inner group">
          <span className="text-[var(--lagoon)] font-bold mr-1">MD=</span>
          <span className="text-[var(--sea-ink)] group-hover:text-[var(--sea-ink-deep)] transition-colors">{md}</span>
        </div>
      </div>
    </div>
  )
}
