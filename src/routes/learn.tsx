import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { BookOpen, ChevronRight, ChevronDown, CheckCircle2, Circle } from 'lucide-react'
import { BiliteralDiagram } from '../components/learn/BiliteralDiagram'
import { TriliteralDiagram } from '../components/learn/TriliteralDiagram'
import { PropositionExplorer } from '../components/learn/PropositionExplorer'

export const Route = createFileRoute('/learn')({ component: LearnPage })

interface Lesson {
  id: string
  title: string
  content: React.ReactNode
}

interface Chapter {
  id: string
  title: string
  lessons: Lesson[]
}

const CHAPTERS: Chapter[] = [
  {
    id: 'things',
    title: '1. Things and Attributes',
    lessons: [
      {
        id: 'things-intro',
        title: 'What are Things?',
        content: (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed">
                In Lewis Carroll's Symbolic Logic, we begin with the simplest elements: <strong>Things</strong>. 
                A "Thing" can be anything you can think of — animals, people, objects, or even abstract concepts.
              </p>
              <p className="text-base leading-relaxed">
                Every Thing has <strong>Attributes</strong> — qualities or characteristics that describe it. 
                For example, a "rose" (Thing) might have attributes like "red", "fragrant", or "beautiful".
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--foam)]">
              <h4 className="text-sm font-bold uppercase text-[var(--sea-ink)] mb-3">Examples</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-[var(--line)]">
                  <div className="text-xs font-bold text-[var(--lagoon)] mb-2">Things</div>
                  <ul className="text-sm space-y-1 text-[var(--sea-ink)]">
                    <li>• Cats</li>
                    <li>• Books</li>
                    <li>• Students</li>
                    <li>• Apples</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-[var(--line)]">
                  <div className="text-xs font-bold text-[var(--palm)] mb-2">Attributes</div>
                  <ul className="text-sm space-y-1 text-[var(--sea-ink)]">
                    <li>• furry</li>
                    <li>• interesting</li>
                    <li>• diligent</li>
                    <li>• red</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-[var(--lagoon)] bg-[var(--hero-a)]">
              <p className="text-sm italic" style={{ fontFamily: 'var(--font-serif)' }}>
                "The Universe of Discourse is the class of Things we are talking about at any one time."
                <span className="text-[var(--sea-ink-soft)] not-italic ml-2">— Lewis Carroll</span>
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'classification',
        title: 'Classification',
        content: (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed">
                <strong>Classification</strong> is the process of dividing Things into groups (called <strong>Classes</strong>) 
                based on their Attributes. When we classify, we create a <strong>Genus</strong> (the larger class) 
                and divide it into <strong>Species</strong> (smaller classes) using a <strong>Differentia</strong> 
                (the distinguishing attribute).
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
              <h4 className="text-sm font-bold uppercase text-[var(--sea-ink)] mb-4">How Classification Works</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-[var(--sea-ink)]">Start with a Genus</div>
                    <div className="text-sm text-[var(--sea-ink-soft)]">Example: "Animals"</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-[var(--sea-ink)]">Choose a Differentia</div>
                    <div className="text-sm text-[var(--sea-ink-soft)]">Example: "has fur"</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-[var(--sea-ink)]">Create two Species</div>
                    <div className="text-sm text-[var(--sea-ink-soft)]">"Animals with fur" and "Animals without fur"</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-[var(--palm)] bg-[var(--hero-a)]">
              <p className="text-sm">
                <strong>Key Insight:</strong> Every classification creates two complementary classes. 
                If we divide "Animals" by the attribute "has fur", we get both "furry Animals" and 
                "non-furry Animals" — together they make up the entire Universe.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 'propositions',
    title: '2. Propositions',
    lessons: [
      {
        id: 'prop-intro',
        title: 'What is a Proposition?',
        content: (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed">
                A <strong>Proposition</strong> is a statement that asserts a relationship between two classes: 
                the <strong>Subject</strong> and the <strong>Predicate</strong>. Carroll identified four types 
                of propositions, traditionally labeled A, E, I, and O.
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
        title: 'The Biliteral Diagram',
        content: (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed">
                The <strong>Biliteral Diagram</strong> is Carroll's method for visualizing propositions about two terms (x and y). 
                It divides a square into four cells representing all possible combinations:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[var(--sea-ink)]">
                <li><strong>xy</strong> — things that are both x and y</li>
                <li><strong>xy'</strong> — things that are x but not y</li>
                <li><strong>x'y</strong> — things that are y but not x</li>
                <li><strong>x'y'</strong> — things that are neither x nor y</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
              <h4 className="text-sm font-bold uppercase text-[var(--sea-ink)] mb-4">Try it yourself!</h4>
              <p className="text-sm text-[var(--sea-ink-soft)] mb-4">
                Click on cells to place counters. Red counters (●) mean "something exists here". 
                Grey counters with ✕ mean "this cell is empty".
              </p>
              <BiliteralDiagram xLabel="x" yLabel="y" />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[var(--sea-ink)]">Representing Propositions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--foam)]">
                  <div className="font-bold text-[var(--lagoon)] mb-2">A: "All x are y"</div>
                  <p className="text-xs text-[var(--sea-ink)]">
                    Mark the xy' cell as empty (nothing is x without being y).
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--foam)]">
                  <div className="font-bold text-red-600 mb-2">E: "No x are y"</div>
                  <p className="text-xs text-[var(--sea-ink)]">
                    Mark the xy cell as empty (nothing is both x and y).
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--foam)]">
                  <div className="font-bold text-[var(--palm)] mb-2">I: "Some x are y"</div>
                  <p className="text-xs text-[var(--sea-ink)]">
                    Place a red counter in the xy cell (something exists there).
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--foam)]">
                  <div className="font-bold text-amber-600 mb-2">O: "Some x are not y"</div>
                  <p className="text-xs text-[var(--sea-ink)]">
                    Place a red counter in the x'y cell (something exists there).
                  </p>
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
    title: '3. Syllogisms',
    lessons: [
      {
        id: 'syl-intro',
        title: 'What is a Syllogism?',
        content: (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed">
                A <strong>Syllogism</strong> is a form of reasoning where a conclusion is drawn from two given propositions 
                (called <strong>Premises</strong>). The key is that the two premises share a common term — the 
                <strong> Middle Term (m)</strong> — which disappears in the conclusion.
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
              <h4 className="text-sm font-bold uppercase text-[var(--sea-ink)] mb-4">Example</h4>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-[var(--lagoon)] bg-[var(--foam)]">
                  <div className="text-xs font-bold text-[var(--lagoon)] mb-1">Major Premise</div>
                  <p className="text-sm italic" style={{ fontFamily: 'var(--font-serif)' }}>
                    All mammals have fur.
                  </p>
                </div>
                <div className="p-3 border-l-4 border-[var(--lagoon)] bg-[var(--foam)]">
                  <div className="text-xs font-bold text-[var(--lagoon)] mb-1">Minor Premise</div>
                  <p className="text-sm italic" style={{ fontFamily: 'var(--font-serif)' }}>
                    All dogs are mammals.
                  </p>
                </div>
                <div className="p-3 border-l-4 border-[var(--palm)] bg-[var(--hero-a)]">
                  <div className="text-xs font-bold text-[var(--palm)] mb-1">Conclusion</div>
                  <p className="text-sm italic" style={{ fontFamily: 'var(--font-serif)' }}>
                    Therefore, all dogs have fur.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-[var(--line)] bg-white">
                <div className="text-xs font-bold text-[var(--term-x)] mb-1">Minor Term (x)</div>
                <p className="text-sm text-[var(--sea-ink)]">The subject of the conclusion (dogs)</p>
              </div>
              <div className="p-4 rounded-lg border border-[var(--line)] bg-white">
                <div className="text-xs font-bold text-[var(--term-y)] mb-1">Major Term (y)</div>
                <p className="text-sm text-[var(--sea-ink)]">The predicate of the conclusion (have fur)</p>
              </div>
              <div className="p-4 rounded-lg border border-[var(--line)] bg-white">
                <div className="text-xs font-bold text-[var(--term-m)] mb-1">Middle Term (m)</div>
                <p className="text-sm text-[var(--sea-ink)]">Appears in both premises but not conclusion (mammals)</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'syl-triliteral',
        title: 'The Triliteral Diagram',
        content: (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed">
                The <strong>Triliteral Diagram</strong> extends the Biliteral Diagram to handle three terms (x, y, m). 
                It adds a circle representing the middle term m, creating 8 cells instead of 4.
              </p>
              <p className="text-base leading-relaxed">
                The circle divides the square into:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[var(--sea-ink)]">
                <li><strong>Inside the circle (m)</strong> — things that have attribute m</li>
                <li><strong>Outside the circle (m')</strong> — things that don't have attribute m</li>
              </ul>
              <p className="text-base leading-relaxed">
                Combined with the x and y divisions, this gives us 8 cells to represent all combinations of x, y, and m.
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
              <h4 className="text-sm font-bold uppercase text-[var(--sea-ink)] mb-4">Try the Triliteral Diagram!</h4>
              <p className="text-sm text-[var(--sea-ink-soft)] mb-4">
                Click cells to place counters. The dashed circle represents the middle term m.
              </p>
              <TriliteralDiagram xLabel="x" yLabel="y" mLabel="m" />
            </div>

            <div className="p-4 rounded-lg border-l-4 border-[var(--lagoon)] bg-[var(--hero-a)]">
              <p className="text-sm">
                <strong>How it works:</strong> To solve a syllogism, we mark both premises on the Triliteral Diagram, 
                then "read off" the conclusion by ignoring the m circle and looking only at the x/y relationships 
                that remain.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'syl-solving',
        title: 'Solving Syllogisms',
        content: (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed">
                Carroll's method for solving syllogisms involves three steps:
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--sea-ink)] mb-2">Mark the Premises</h4>
                    <p className="text-sm text-[var(--sea-ink-soft)] mb-3">
                      Transfer both premises onto the Triliteral Diagram. Universal propositions (A, E) 
                      get grey counters (empty). Particular propositions (I, O) get red counters (occupied).
                    </p>
                    <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                      <div className="text-xs font-bold text-[var(--lagoon)] mb-1">Example</div>
                      <p className="text-xs italic text-[var(--sea-ink)]">
                        "All m are y" → Mark m'y cells as empty<br/>
                        "All x are m" → Mark xm' cells as empty
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--sea-ink)] mb-2">Transfer to Biliteral</h4>
                    <p className="text-sm text-[var(--sea-ink-soft)] mb-3">
                      Copy the information from the Triliteral Diagram to the Biliteral Diagram, 
                      ignoring the m circle. If a cell is marked in both m and m' portions, 
                      it's definitely marked.
                    </p>
                    <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                      <div className="text-xs font-bold text-[var(--palm)] mb-1">Rule</div>
                      <p className="text-xs text-[var(--sea-ink)]">
                        If any sub-cell is empty, the whole cell is empty.<br/>
                        If any sub-cell has a red counter, transfer it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border-2 border-[var(--line)] bg-[var(--surface-strong)]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--lagoon)] text-white flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--sea-ink)] mb-2">Read the Conclusion</h4>
                    <p className="text-sm text-[var(--sea-ink-soft)] mb-3">
                      Interpret the Biliteral Diagram to get the conclusion in terms of x and y.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                        <div className="text-xs font-bold text-[var(--lagoon)] mb-1">If xy' is empty</div>
                        <p className="text-xs text-[var(--sea-ink)]">"All x are y"</p>
                      </div>
                      <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                        <div className="text-xs font-bold text-red-600 mb-1">If xy is empty</div>
                        <p className="text-xs text-[var(--sea-ink)]">"No x are y"</p>
                      </div>
                      <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                        <div className="text-xs font-bold text-[var(--palm)] mb-1">If xy has a counter</div>
                        <p className="text-xs text-[var(--sea-ink)]">"Some x are y"</p>
                      </div>
                      <div className="p-3 rounded bg-[var(--foam)] border border-[var(--line)]">
                        <div className="text-xs font-bold text-amber-600 mb-1">If x'y has a counter</div>
                        <p className="text-xs text-[var(--sea-ink)]">"Some x are not y"</p>
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
]

function LearnPage() {
  const { t } = useTranslation()
  const [activeChapter, setActiveChapter] = useState<string>('things')
  const [activeLesson, setActiveLesson] = useState<string>('things-intro')
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['things']))

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev)
      if (next.has(chapterId)) next.delete(chapterId)
      else next.add(chapterId)
      return next
    })
  }

  const selectLesson = (chapterId: string, lessonId: string) => {
    setActiveChapter(chapterId)
    setActiveLesson(lessonId)
    setExpandedChapters(prev => {
      const next = new Set(prev)
      next.add(chapterId)
      return next
    })
  }

  const currentLesson = CHAPTERS
    .flatMap(c => c.lessons.map(l => ({ ...l, chapterId: c.id })))
    .find(l => l.id === activeLesson)

  const lessonIndex = CHAPTERS
    .flatMap(c => c.lessons.map((l, i) => ({ ...l, chapterId: c.id, index: i })))
    .findIndex(l => l.id === activeLesson)

  const nextLesson = CHAPTERS
    .flatMap(c => c.lessons.map(l => ({ ...l, chapterId: c.id })))
    [lessonIndex + 1]

  return (
    <main className="page-wrap pb-16 pt-8" style={{ background: 'var(--page-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={24} className="text-[var(--lagoon)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
              Interactive Guide
            </span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--sea-ink)', fontFamily: 'var(--font-serif)' }}>
            Learning Symbolic Logic
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--sea-ink-soft)' }}>
            Based on Lewis Carroll's "Symbolic Logic" — A step-by-step journey from things to syllogisms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--line)', background: 'var(--surface-strong)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--line)', background: 'var(--foam)' }}>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                  Lessons
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--line)' }}>
                {CHAPTERS.map(chapter => (
                  <div key={chapter.id}>
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-[var(--foam)] transition-colors"
                    >
                      <span className="text-sm font-bold text-[var(--sea-ink)]">{chapter.title}</span>
                      {expandedChapters.has(chapter.id) ? (
                        <ChevronDown size={16} className="text-[var(--sea-ink-soft)]" />
                      ) : (
                        <ChevronRight size={16} className="text-[var(--sea-ink-soft)]" />
                      )}
                    </button>
                    {expandedChapters.has(chapter.id) && (
                      <div className="pl-4">
                        {chapter.lessons.map(lesson => {
                          const isActive = activeLesson === lesson.id
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => selectLesson(chapter.id, lesson.id)}
                              className={`w-full px-4 py-2 text-left flex items-center gap-2 transition-colors cursor-pointer ${
                                isActive ? 'bg-[var(--lagoon)]/10' : 'hover:bg-[var(--foam)]'
                              }`}
                            >
                              {isActive ? (
                                <CheckCircle2 size={14} className="text-[var(--lagoon)]" />
                              ) : (
                                <Circle size={14} className="text-[var(--sea-ink-soft)]" />
                              )}
                              <span className={`text-xs ${isActive ? 'text-[var(--lagoon)] font-bold' : 'text-[var(--sea-ink-soft)]'}`}>
                                {lesson.title}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="rounded-xl border p-8" style={{ borderColor: 'var(--line)', background: 'var(--surface-strong)' }}>
              {/* Lesson Header */}
              <div className="mb-8">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--lagoon)] mb-2">
                  {currentLesson?.chapterId && CHAPTERS.find(c => c.id === currentLesson.chapterId)?.title}
                </div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--sea-ink)' }}>
                  {currentLesson?.title}
                </h2>
              </div>

              {/* Lesson Content */}
              <div className="space-y-6">
                {currentLesson?.content}
              </div>

              {/* Navigation */}
              {nextLesson && (
                <div className="mt-10 pt-6 border-t flex justify-end" style={{ borderColor: 'var(--line)' }}>
                  <button
                    onClick={() => selectLesson(nextLesson.chapterId, nextLesson.id)}
                    className="px-6 py-3 rounded-lg bg-[var(--lagoon)] text-white font-bold text-sm uppercase tracking-wide cursor-pointer hover:brightness-110 transition-all flex items-center gap-2"
                  >
                    Next: {nextLesson.title}
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
