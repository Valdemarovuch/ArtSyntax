'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Copy, Check, X, ChevronLeft, ChevronRight, Heart, Share2, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Prompt } from '@/lib/prompts-data'

interface PromptModalProps {
  prompt: Prompt | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (direction: 'prev' | 'next') => void
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  currentIndex: number
  totalCount: number
}

export function PromptModal({ 
  prompt, 
  open, 
  onOpenChange, 
  onNavigate,
  isFavorite,
  onToggleFavorite,
  currentIndex,
  totalCount,
}: PromptModalProps) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  if (!prompt) return null

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(prompt.corePrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const shareText = `${prompt.title}\n\n${prompt.corePrompt}`
    
    try {
      if (navigator.share && navigator.canShare?.({ text: shareText })) {
        await navigator.share({
          title: prompt.title,
          text: prompt.corePrompt,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch {
      // Fallback to clipboard if share fails (e.g., permission denied)
      await navigator.clipboard.writeText(shareText)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = prompt.imageUrl
    link.download = `${prompt.title.replace(/\s+/g, '-').toLowerCase()}.jpg`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden border-white/10 bg-neutral-950 p-0 sm:max-w-[90vw] sm:rounded-2xl lg:max-w-6xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{prompt.title}</DialogTitle>
        <DialogDescription className="sr-only">
          View details and copy the prompt for {prompt.title}
        </DialogDescription>
        
        {/* Navigation Arrows */}
        <button
          onClick={() => onNavigate('prev')}
          className="absolute left-2 top-1/2 z-50 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black md:left-4 md:size-12"
          aria-label="Previous prompt"
        >
          <ChevronLeft className="size-5 md:size-6" />
        </button>
        <button
          onClick={() => onNavigate('next')}
          className="absolute right-2 top-1/2 z-50 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black md:right-4 md:size-12"
          aria-label="Next prompt"
        >
          <ChevronRight className="size-5 md:size-6" />
        </button>

        <div className="grid md:grid-cols-[1.2fr_1fr]">
          {/* Left: Image */}
          <div className="relative flex items-center justify-center bg-black p-6 md:p-10">
            <Image
              src={prompt.imageUrl}
              alt={prompt.title}
              width={800}
              height={600}
              className="max-h-[60vh] w-auto rounded-xl object-contain ring-1 ring-white/10"
              priority
            />
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
              {currentIndex} / {totalCount}
            </div>
          </div>

          {/* Right: Prompt Info */}
          <div className="relative flex flex-col border-l border-white/10 p-6 md:p-8">
            {/* Top actions */}
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(prompt.id)}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full transition-all duration-300',
                  isFavorite 
                    ? 'bg-red-500/20 text-red-500' 
                    : 'text-neutral-500 hover:bg-white/10 hover:text-white'
                )}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={cn('size-4', isFavorite && 'fill-current')} />
              </button>
              <button
                onClick={handleShare}
                className="flex size-8 items-center justify-center rounded-full text-neutral-500 transition-all duration-300 hover:bg-white/10 hover:text-white"
                aria-label="Share"
              >
                {shared ? <Check className="size-4" /> : <Share2 className="size-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="flex size-8 items-center justify-center rounded-full text-neutral-500 transition-all duration-300 hover:bg-white/10 hover:text-white"
                aria-label="Download image"
              >
                <Download className="size-4" />
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="flex size-8 items-center justify-center rounded-full text-neutral-500 transition-all duration-300 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2 className="mb-6 pr-32 text-xl font-semibold tracking-tight text-white">
              {prompt.title}
            </h2>

            {/* Core Prompt */}
            <div className="mb-5">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                Core Prompt
              </h3>
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="font-mono text-sm leading-relaxed text-neutral-300">
                  {prompt.corePrompt}
                </p>
              </div>
            </div>

            {/* Negative Prompt */}
            <div className="mb-5">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                Negative Prompt
              </h3>
              <p className="text-sm leading-relaxed text-neutral-400">
                {prompt.negativePrompt}
              </p>
            </div>

            {/* Model Details */}
            <div className="mb-8">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                Model Details
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Model</span>
                  <span className="font-medium text-white">{prompt.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Aspect</span>
                  <span className="font-medium text-white">{prompt.aspectRatio}</span>
                </div>
                {prompt.seed && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Seed</span>
                    <span className="font-medium text-white">{prompt.seed}</span>
                  </div>
                )}
                {prompt.steps && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Steps</span>
                    <span className="font-medium text-white">{prompt.steps}</span>
                  </div>
                )}
                {prompt.cfgScale && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">CFG Scale</span>
                    <span className="font-medium text-white">{prompt.cfgScale}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Keyboard hint */}
            <div className="mb-4 flex items-center justify-center gap-4 text-xs text-neutral-600">
              <span>Use arrow keys to navigate</span>
            </div>

            {/* Copy Button */}
            <Button
              onClick={handleCopyPrompt}
              className="mt-auto w-full bg-white text-black transition-all duration-300 hover:bg-neutral-200"
              size="lg"
            >
              {copied ? (
                <>
                  <Check className="mr-2 size-4" />
                  Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className="mr-2 size-4" />
                  Copy Prompt
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
