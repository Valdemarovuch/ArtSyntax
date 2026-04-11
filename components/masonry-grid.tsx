'use client'

import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { GalleryCard } from './gallery-card'
import type { Prompt } from '@/lib/prompts-data'

interface MasonryGridProps {
  prompts: Prompt[]
  onViewPrompt: (prompt: Prompt) => void
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
  isLoggedIn?: boolean
  onAddPrompt?: () => void
}

export function MasonryGrid({ prompts, onViewPrompt, favorites, onToggleFavorite, isLoggedIn, onAddPrompt }: MasonryGridProps) {
  const columns = useMemo(() => {
    const cols: Prompt[][] = [[], [], []]
    prompts.forEach((prompt, index) => {
      cols[index % 3].push(prompt)
    })
    return cols
  }, [prompts])

  if (prompts.length === 0 && !isLoggedIn) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-white/5 p-6">
          <svg className="size-12 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-white">No prompts found</h3>
        <p className="text-sm text-neutral-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Column 0 — logged-in users see the "Add" card first */}
      <div className="flex flex-col gap-6">
        {isLoggedIn && (
          <button
            onClick={onAddPrompt}
            className="group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.03] text-neutral-500 transition-all hover:border-white/40 hover:bg-white/[0.06] hover:text-white"
          >
            <div className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-colors group-hover:border-white/40 group-hover:bg-white/10">
              <Plus className="size-6" />
            </div>
            <span className="text-sm font-medium">Add New Prompt</span>
          </button>
        )}
        {columns[0].map((prompt, promptIndex) => (
          <div
            key={prompt.id}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{
              animationDelay: `${promptIndex * 50}ms`,
              animationDuration: '600ms',
              animationFillMode: 'both',
            }}
          >
            <GalleryCard
              prompt={prompt}
              onView={onViewPrompt}
              isFavorite={favorites.has(prompt.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>

      {/* Columns 1 and 2 */}
      {[1, 2].map((colIndex) => (
        <div key={colIndex} className="flex flex-col gap-6">
          {columns[colIndex].map((prompt, promptIndex) => (
            <div
              key={prompt.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${(colIndex * columns[colIndex].length + promptIndex) * 50}ms`,
                animationDuration: '600ms',
                animationFillMode: 'both',
              }}
            >
              <GalleryCard
                prompt={prompt}
                onView={onViewPrompt}
                isFavorite={favorites.has(prompt.id)}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
