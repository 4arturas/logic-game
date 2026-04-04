import { useTranslation } from '../../i18n/I18nContext'
import { BiliteralDiagram } from './BiliteralDiagram'
import { TriliteralDiagram } from './TriliteralDiagram'
import { PropositionExplorer } from './PropositionExplorer'
import { VennDiagram } from './VennDiagram'

// Helper to render HTML from translation strings
function HtmlText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export function useLessons() {
  const { t } = useTranslation()

  return [
    {
      id: 'things',
      title: t('learn.ch1_title'),
      lessons: [
        {
          id: 'things-intro',
          title: t('learn.ch1_lesson1_title'),
          content: (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed">
                  <HtmlText html={t('learn.ch1_lesson1_p1')} />
                </p>
                <p className="text-base leading-relaxed">
                  <HtmlText html={t('learn.ch1_lesson1_p2')} />
                </p>
              </div>

              <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--foam)]">
                <h4 className="text-sm font-bold uppercase text-[var(--sea-ink)] mb-3">{t('learn.examples')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-[var(--line)]">
                    <div className="text-xs font-bold text-[var(--lagoon)] mb-2">{t('learn.things')}</div>
                    <ul className="text-sm space-y-1 text-[var(--sea-ink)]">
                      <li>• {t('learn.cats')}</li>
                      <li>• {t('learn.books')}</li>
                      <li>• {t('learn.students')}</li>
                      <li>• {t('learn.apples')}</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-[var(--line)]">
                    <div className="text-xs font-bold text-[var(--palm)] mb-2">{t('learn.attributes')}</div>
                    <ul className="text-sm space-y-1 text-[var(--sea-ink)]">
                      <li>• {t('learn.furry')}</li>
                      <li>• {t('learn.interesting')}</li>
                      <li>• {t('learn.diligent')}</li>
                      <li>• {t('learn.red')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-[var(--lagoon)] bg-[var(--hero-a)]">
                <p className="text-sm italic" style={{ fontFamily: 'var(--font-serif)' }}>
                  {t('learn.ch1_lesson1_quote')}
                  <span className="text-[var(--sea-ink-soft)] not-italic ml-2">— Lewis Carroll</span>
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'classification',
          title: t('learn.ch1_lesson2_title'),
          content: (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed">
                  <HtmlText html={t('learn.ch1_lesson2_p1')} />
                </p>
              </div>

              <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                <h4 className="text-sm font-bold uppercase text-[var(--sea-ink)] mb-4">{t('learn.ch1_lesson2_how')}</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
                    <div>
                      <div className="font-bold text-[var(--sea-ink)]">{t('learn.step1_title')}</div>
                      <div className="text-sm text-[var(--sea-ink-soft)]">{t('learn.step1_desc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
                    <div>
                      <div className="font-bold text-[var(--sea-ink)]">{t('learn.step2_title')}</div>
                      <div className="text-sm text-[var(--sea-ink-soft)]">{t('learn.step2_desc')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
                    <div>
                      <div className="font-bold text-[var(--sea-ink)]">{t('learn.step3_title')}</div>
                      <div className="text-sm text-[var(--sea-ink-soft)]">{t('learn.step3_desc')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-[var(--palm)] bg-[var(--hero-a)]">
                <p className="text-sm">
                  <strong>{t('learn.key_insight')}</strong> {t('learn.ch1_lesson2_insight')}
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'propositions',
      title: t('learn.ch2_title'),
      lessons: [
        {
          id: 'prop-intro',
          title: t('learn.ch2_lesson1_title'),
          content: (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed">
                  <HtmlText html={t('learn.ch2_lesson1_p1')} />
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(['A', 'E', 'I', 'O'] as const).map(type => (
                  <div key={type} className="p-4 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                    <PropositionExplorer type={type} />
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          id: 'prop-biliteral',
          title: t('learn.ch2_lesson2_title'),
          content: (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed">
                  <HtmlText html={t('learn.ch2_lesson2_p1')} />
                </p>
                <ul className="list-disc list-inside space-y-1 text-[var(--sea-ink)]">
                  <li><strong>xy</strong> — {t('learn.xy_desc')}</li>
                  <li><strong>xy'</strong> — {t('learn.xy_not_y_desc')}</li>
                  <li><strong>x'y</strong> — {t('learn.y_not_x_desc')}</li>
                  <li><strong>x'y'</strong> — {t('learn.neither_desc')}</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                <h4 className="text-sm font-bold uppercase text-[var(--sea-ink)] mb-4">{t('learn.try_it')}</h4>
                <p className="text-sm text-[var(--sea-ink-soft)] mb-4">
                  {t('learn.biliteral_instructions')}
                </p>
                <BiliteralDiagram xLabel="x" yLabel="y" />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[var(--sea-ink)]">{t('learn.representing')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--foam)]">
                    <div className="font-bold text-[var(--lagoon)] mb-2">{t('learn.prop_a')}</div>
                    <p className="text-xs text-[var(--sea-ink)]">{t('learn.prop_a_desc')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--foam)]">
                    <div className="font-bold text-red-600 mb-2">{t('learn.prop_e')}</div>
                    <p className="text-xs text-[var(--sea-ink)]">{t('learn.prop_e_desc')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--foam)]">
                    <div className="font-bold text-[var(--palm)] mb-2">{t('learn.prop_i')}</div>
                    <p className="text-xs text-[var(--sea-ink)]">{t('learn.prop_i_desc')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--foam)]">
                    <div className="font-bold text-amber-600 mb-2">{t('learn.prop_o')}</div>
                    <p className="text-xs text-[var(--sea-ink)]">{t('learn.prop_o_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'syllogisms',
      title: t('learn.ch3_title'),
      lessons: [
        {
          id: 'syl-intro',
          title: t('learn.ch3_lesson1_title'),
          content: (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed">
                  <HtmlText html={t('learn.ch3_lesson1_p1')} />
                </p>
              </div>

              <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                <h4 className="text-sm font-bold uppercase text-[var(--sea-ink)] mb-4">{t('learn.example')}</h4>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-[var(--lagoon)] bg-[var(--foam)]">
                    <div className="text-xs font-bold text-[var(--lagoon)] mb-1">{t('learn.major_premise')}</div>
                    <p className="text-sm italic" style={{ fontFamily: 'var(--font-serif)' }}>
                      {t('learn.ch3_lesson1_example_major')}
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-[var(--lagoon)] bg-[var(--foam)]">
                    <div className="text-xs font-bold text-[var(--lagoon)] mb-1">{t('learn.minor_premise')}</div>
                    <p className="text-sm italic" style={{ fontFamily: 'var(--font-serif)' }}>
                      {t('learn.ch3_lesson1_example_minor')}
                    </p>
                  </div>
                  <div className="p-3 border-l-4 border-[var(--palm)] bg-[var(--hero-a)]">
                    <div className="text-xs font-bold text-[var(--palm)] mb-1">{t('learn.conclusion')}</div>
                    <p className="text-sm italic" style={{ fontFamily: 'var(--font-serif)' }}>
                      {t('learn.ch3_lesson1_example_conclusion')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-[var(--line)] bg-white">
                  <div className="text-xs font-bold text-[var(--term-x)] mb-1">{t('learn.minor_term_x')}</div>
                  <p className="text-sm text-[var(--sea-ink)]">{t('learn.ch3_lesson1_minor_desc')}</p>
                </div>
                <div className="p-4 rounded-lg border border-[var(--line)] bg-white">
                  <div className="text-xs font-bold text-[var(--term-y)] mb-1">{t('learn.major_term_y')}</div>
                  <p className="text-sm text-[var(--sea-ink)]">{t('learn.ch3_lesson1_major_desc')}</p>
                </div>
                <div className="p-4 rounded-lg border border-[var(--line)] bg-white">
                  <div className="text-xs font-bold text-[var(--term-m)] mb-1">{t('learn.middle_term_m')}</div>
                  <p className="text-sm text-[var(--sea-ink)]">{t('learn.ch3_lesson1_middle_desc')}</p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'syl-triliteral',
          title: t('learn.ch3_lesson2_title'),
          content: (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed">
                  <HtmlText html={t('learn.ch3_lesson2_p1')} />
                </p>
                <p className="text-base leading-relaxed">
                  {t('learn.ch3_lesson2_p2')}
                </p>
                <ul className="list-disc list-inside space-y-1 text-[var(--sea-ink)]">
                  <li><strong>{t('learn.inside_circle')}</strong> — {t('learn.inside_desc')}</li>
                  <li><strong>{t('learn.outside_circle')}</strong> — {t('learn.outside_desc')}</li>
                </ul>
                <p className="text-base leading-relaxed">
                  {t('learn.ch3_lesson2_p3')}
                </p>
              </div>

              <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                <h4 className="text-sm font-bold uppercase text-[var(--sea-ink)] mb-4">{t('learn.try_triliteral')}</h4>
                <p className="text-sm text-[var(--sea-ink-soft)] mb-4">
                  {t('learn.triliteral_instructions')}
                </p>
                <TriliteralDiagram xLabel="x" yLabel="y" mLabel="m" />
              </div>

              <div className="p-4 rounded-lg border-l-4 border-[var(--lagoon)] bg-[var(--hero-a)]">
                <p className="text-sm">
                  <strong>{t('learn.how_it_works')}</strong> {t('learn.ch3_lesson2_how')}
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'syl-solving',
          title: t('learn.ch3_lesson3_title'),
          content: (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed">
                  <HtmlText html={t('learn.ch3_lesson3_p1')} />
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[var(--sea-ink)] mb-2">{t('learn.step1_mark')}</h4>
                      <p className="text-sm text-[var(--sea-ink-soft)] mb-3">
                        {t('learn.step1_mark_desc')}
                      </p>
                      <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                        <div className="text-xs font-bold text-[var(--lagoon)] mb-1">{t('learn.example')}</div>
                        <p className="text-xs italic text-[var(--sea-ink)]">
                          {t('learn.step1_mark_example')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[var(--sea-ink)] mb-2">{t('learn.step2_transfer')}</h4>
                      <p className="text-sm text-[var(--sea-ink-soft)] mb-3">
                        {t('learn.step2_transfer_desc')}
                      </p>
                      <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                        <div className="text-xs font-bold text-[var(--palm)] mb-1">{t('learn.rule')}</div>
                        <p className="text-xs text-[var(--sea-ink)]">
                          {t('learn.step2_rule')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[var(--sea-ink)] mb-2">{t('learn.step3_read')}</h4>
                      <p className="text-sm text-[var(--sea-ink-soft)] mb-3">
                        {t('learn.step3_read_desc')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                          <div className="text-xs font-bold text-[var(--lagoon)] mb-1">{t('learn.if_xy_empty')}</div>
                          <p className="text-xs text-[var(--sea-ink)]">{t('learn.all_x_are_y')}</p>
                        </div>
                        <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                          <div className="text-xs font-bold text-red-600 mb-1">{t('learn.if_xy_empty2')}</div>
                          <p className="text-xs text-[var(--sea-ink)]">{t('learn.no_x_are_y')}</p>
                        </div>
                        <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                          <div className="text-xs font-bold text-[var(--palm)] mb-1">{t('learn.if_xy_counter')}</div>
                          <p className="text-xs text-[var(--sea-ink)]">{t('learn.some_x_are_y')}</p>
                        </div>
                        <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                          <div className="text-xs font-bold text-amber-600 mb-1">{t('learn.if_x_y_counter')}</div>
                          <p className="text-xs text-[var(--sea-ink)]">{t('learn.some_x_not_y')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'venn',
      title: t('learn.ch4_title'),
      lessons: [
        {
          id: 'venn-intro',
          title: t('learn.ch4_lesson1_title'),
          content: (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed">
                  <HtmlText html={t('learn.ch4_lesson1_p1')} />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                  <h4 className="text-sm font-bold text-[var(--lagoon)] mb-3 text-center">{t('learn.venn_diagram')}</h4>
                  <VennDiagram type="biliteral" />
                </div>
                <div className="p-4 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                  <h4 className="text-sm font-bold text-[var(--palm)] mb-3 text-center">{t('learn.carroll_diagram')}</h4>
                  <BiliteralDiagram xLabel="x" yLabel="y" />
                </div>
              </div>

              <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                <h4 className="text-sm font-bold uppercase text-[var(--sea-ink)] mb-4">{t('learn.key_differences')}</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                    <div className="font-bold text-[var(--sea-ink)] mb-1">{t('learn.venn_approach')}</div>
                    <p className="text-sm text-[var(--sea-ink)]">{t('learn.venn_approach_desc')}</p>
                  </div>
                  <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                    <div className="font-bold text-[var(--sea-ink)] mb-1">{t('learn.carroll_approach')}</div>
                    <p className="text-sm text-[var(--sea-ink)]">{t('learn.carroll_approach_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'venn-triliteral',
          title: t('learn.ch4_lesson2_title'),
          content: (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed">
                  <HtmlText html={t('learn.ch4_lesson2_p1')} />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                  <h4 className="text-sm font-bold text-[var(--lagoon)] mb-3 text-center">{t('learn.venn_3circle')}</h4>
                  <VennDiagram type="triliteral" />
                </div>
                <div className="p-4 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                  <h4 className="text-sm font-bold text-[var(--palm)] mb-3 text-center">{t('learn.carroll_3circle')}</h4>
                  <TriliteralDiagram xLabel="x" yLabel="y" mLabel="m" />
                </div>
              </div>

              <div className="p-4 rounded-lg border-l-4 border-[var(--palm)] bg-[var(--hero-a)]">
                <p className="text-sm">
                  <strong>{t('learn.note')}</strong> {t('learn.ch4_lesson2_note')}
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
  ]
}
