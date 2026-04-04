import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { BookOpen, ChevronRight, ChevronDown, CheckCircle2, Circle } from 'lucide-react'
import { useLessons } from '../components/learn/lessons'

export const Route = createFileRoute('/learn')({ component: LearnPage })

function LearnPage() {
  const { t } = useTranslation()
  const chapters = useLessons()

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

  const allLessons = chapters.flatMap(c => c.lessons.map(l => ({ ...l, chapterId: c.id })))
  const currentLesson = allLessons.find(l => l.id === activeLesson)
  const lessonIndex = allLessons.findIndex(l => l.id === activeLesson)
  const nextLesson = allLessons[lessonIndex + 1]

  return (
    <main className="page-wrap pb-16 pt-8" style={{ background: 'var(--page-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={24} className="text-[var(--lagoon)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
              {t('learn.interactive_guide')}
            </span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--sea-ink)', fontFamily: 'var(--font-serif)' }}>
            {t('learn.page_title')}
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--sea-ink-soft)' }}>
            {t('learn.page_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--line)', background: 'var(--surface-strong)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--line)', background: 'var(--foam)' }}>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                  {t('learn.lessons')}
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--line)' }}>
                {chapters.map(chapter => (
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
                  {currentLesson?.chapterId && chapters.find(c => c.id === currentLesson.chapterId)?.title}
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
                    {t('learn.next')}: {nextLesson.title}
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
