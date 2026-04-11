'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Eye, Copy, Check, Heart, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Prompt } from '@/lib/prompts-data'

interface GalleryCardProps {
  prompt: Prompt
  onView: (prompt: Prompt) => void
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export function GalleryCard({ prompt, onView, isFavorite, onToggleFavorite }: GalleryCardProps) {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(prompt.corePrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(prompt.id)
  }

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl ring-1 ring-white/10 transition-all duration-500 hover:ring-white/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView(prompt)}
    >
      {/* Favorite indicator */}
      {isFavorite && (
        <div className="absolute left-3 top-3 z-20">
          <Heart className="size-5 fill-red-500 text-red-500 drop-shadow-lg" />
        </div>
      )}

      {/* Admin badge */}
      {prompt.isAdminPost && (
        <div
          className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black backdrop-blur-sm"
          title="Official admin prompt"
        >
          <ShieldCheck className="size-3" />
          Admin
        </div>
      )}

      {/* Image with grayscale effect */}
      <div className="relative overflow-hidden">
        <Image
          src={prompt.imageUrl}
          alt={prompt.title}
          width={800}
          height={600}
          className={cn(
            'w-full object-cover transition-all duration-700 ease-out',
            'grayscale group-hover:grayscale-0 group-hover:scale-105'
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Dark overlay that fades on hover */}
        <div 
          className={cn(
            'absolute inset-0 bg-black/40 transition-opacity duration-500',
            isHovered ? 'opacity-0' : 'opacity-100'
          )} 
        />
      </div>
      
      {/* Prompt title overlay */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 p-4',
          'bg-gradient-to-t from-black/90 via-black/60 to-transparent',
          'transition-all duration-500 ease-out',
          isHovered ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        )}
      >
        <p className="text-sm font-medium text-white/90 line-clamp-2">
          {prompt.title}
        </p>
      </div>
      
      {/* Frosted glass action bar */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3',
          'bg-black/60 backdrop-blur-xl border-t border-white/10',
          'transition-all duration-500 ease-out',
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        )}
      >
        <span className="text-xs font-medium text-white/70">{prompt.model}</span>
        <div className="flex gap-2">
          <button
            onClick={handleFavorite}
            className={cn(
              'flex size-8 items-center justify-center rounded-full transition-all duration-300',
              isFavorite 
                ? 'bg-red-500/20 text-red-500' 
                : 'bg-white/10 text-white hover:bg-red-500/20 hover:text-red-500'
            )}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('size-4', isFavorite && 'fill-current')} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView(prompt)
            }}
            className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white hover:text-black"
            aria-label="View details"
          >
            <Eye className="size-4" />
          </button>
          <button
            onClick={handleCopy}
            className={cn(
              'flex size-8 items-center justify-center rounded-full transition-all duration-300',
              copied 
                ? 'bg-white text-black' 
                : 'bg-white/10 text-white hover:bg-white hover:text-black'
            )}
            aria-label={copied ? 'Copied' : 'Copy prompt'}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
