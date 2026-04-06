'use client'

import { useMemo } from 'react'
import { GalleryCard } from './gallery-card'
import type { Prompt } from '@/lib/prompts-data'

interface MasonryGridProps {
  prompts: Prompt[]
  onViewPrompt: (prompt: Prompt) => void
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
}

export function MasonryGrid({ prompts, onViewPrompt, favorites, onToggleFavorite }: MasonryGridProps) {
  // Distribute items into columns for masonry effect
  const columns = useMemo(() => {
    const cols: Prompt[][] = [[], [], []]
    prompts.forEach((prompt, index) => {
      cols[index % 3].push(prompt)
    })
    return cols
  }, [prompts])

  if (prompts.length === 0) {
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
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-6">
          {column.map((prompt, promptIndex) => (
            <div
              key={prompt.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${(colIndex * column.length + promptIndex) * 50}ms`,
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
