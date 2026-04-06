'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { GalleryHeader } from '@/components/gallery-header'
import { MasonryGrid } from '@/components/masonry-grid'
import { PromptModal } from '@/components/prompt-modal'
import { prompts, type Prompt } from '@/lib/prompts-data'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedModel, setSelectedModel] = useState('All Models')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('All Ratios')
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('prompt-favorites')
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)))
    }
  }, [])

  // Save favorites to localStorage
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      localStorage.setItem('prompt-favorites', JSON.stringify([...next]))
      return next
    })
  }, [])

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesSearch =
        searchQuery === '' ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.corePrompt.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesModel =
        selectedModel === 'All Models' || prompt.model === selectedModel

      const matchesCategory =
        selectedCategory === 'All Categories' || prompt.category === selectedCategory

      const matchesAspectRatio =
        selectedAspectRatio === 'All Ratios' || prompt.aspectRatio === selectedAspectRatio

      return matchesSearch && matchesModel && matchesCategory && matchesAspectRatio
    })
  }, [searchQuery, selectedModel, selectedCategory, selectedAspectRatio])

  const handleViewPrompt = useCallback((prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setModalOpen(true)
  }, [])

  const handleRandomPrompt = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * filteredPrompts.length)
    const randomPrompt = filteredPrompts[randomIndex]
    if (randomPrompt) {
      setSelectedPrompt(randomPrompt)
      setModalOpen(true)
    }
  }, [filteredPrompts])

  // Navigate to next/prev prompt
  const navigatePrompt = useCallback((direction: 'prev' | 'next') => {
    if (!selectedPrompt) return
    const currentIndex = filteredPrompts.findIndex(p => p.id === selectedPrompt.id)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredPrompts.length
      : (currentIndex - 1 + filteredPrompts.length) % filteredPrompts.length
    
    setSelectedPrompt(filteredPrompts[newIndex])
  }, [selectedPrompt, filteredPrompts])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalOpen) return
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        navigatePrompt('next')
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        navigatePrompt('prev')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalOpen, navigatePrompt])

  return (
    <div className="min-h-screen bg-black text-white">
      <GalleryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedAspectRatio={selectedAspectRatio}
        onAspectRatioChange={setSelectedAspectRatio}
        onRandomPrompt={handleRandomPrompt}
        totalPrompts={prompts.length}
        filteredCount={filteredPrompts.length}
        favoritesCount={favorites.size}
      />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <MasonryGrid 
          prompts={filteredPrompts} 
          onViewPrompt={handleViewPrompt}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </main>

      <PromptModal
        prompt={selectedPrompt}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onNavigate={navigatePrompt}
        isFavorite={selectedPrompt ? favorites.has(selectedPrompt.id) : false}
        onToggleFavorite={toggleFavorite}
        currentIndex={selectedPrompt ? filteredPrompts.findIndex(p => p.id === selectedPrompt.id) + 1 : 0}
        totalCount={filteredPrompts.length}
      />
    </div>
  )
}
