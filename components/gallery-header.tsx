'use client'

import { Search, Shuffle, Heart, Image as ImageIcon, Lock, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { models, categories, aspectRatios } from '@/lib/prompts-data'

interface GalleryHeaderProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    selectedModel: string
    onModelChange: (value: string) => void
    selectedCategory: string
    onCategoryChange: (value: string) => void
    selectedAspectRatio: string
    onAspectRatioChange: (value: string) => void
    onRandomPrompt: () => void
    totalPrompts: number
    filteredCount: number
    favoritesCount: number
    isAdmin?: boolean
}

export function GalleryHeader({
    searchQuery,
    onSearchChange,
    selectedModel,
    onModelChange,
    selectedCategory,
    onCategoryChange,
    selectedAspectRatio,
    onAspectRatioChange,
    onRandomPrompt,
    totalPrompts,
    filteredCount,
    favoritesCount,
    isAdmin = false,
}: GalleryHeaderProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6 py-5">
                <div className="flex flex-col gap-5">
                    {/* Top row: Logo, Stats, Random */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <h1 className="text-xl font-semibold tracking-tight text-white">
                                ArtSyntax
                            </h1>

                            {/* Stats */}
                            <div className="hidden items-center gap-4 text-sm text-neutral-500 md:flex">
                                <span className="flex items-center gap-1.5">
                                    <ImageIcon className="size-3.5" />
                                    {filteredCount === totalPrompts
                                        ? `${totalPrompts} prompts`
                                        : `${filteredCount} / ${totalPrompts}`
                                    }
                                </span>
                                {favoritesCount > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <Heart className="size-3.5 fill-current text-red-500" />
                                        {favoritesCount}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Admin indicator */}
                            {isAdmin ? (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:border-white/20 hover:text-white"
                                >
                                    <LayoutDashboard className="size-3.5" />
                                    Admin
                                </Link>
                            ) : (
                                <Link
                                    href="/admin/login"
                                    className="flex items-center justify-center rounded-lg p-1.5 text-neutral-700 transition-colors hover:text-neutral-500"
                                    title="Admin login"
                                >
                                    <Lock className="size-3.5" />
                                </Link>
                            )}

                            {/* Random Button */}
                            <Button
                                onClick={onRandomPrompt}
                                variant="outline"
                                className="border-white/10 bg-white/5 text-white transition-all duration-300 hover:bg-white hover:text-black"
                            >
                                <Shuffle className="mr-2 size-4" />
                                Random
                            </Button>
                        </div>
                    </div>

                    {/* Bottom row: Search and Filters */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 md:max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                            <Input
                                type="text"
                                placeholder="Search prompts..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="border-white/10 bg-white/5 pl-10 text-sm text-white placeholder:text-neutral-500 transition-all duration-300 focus-visible:border-white/30 focus-visible:bg-white/10 focus-visible:ring-white/10"
                            />
                        </div>

                        {/* Filter Dropdowns */}
                        <div className="flex flex-wrap gap-2">
                            <Select value={selectedModel} onValueChange={onModelChange}>
                                <SelectTrigger className="w-[140px] border-white/10 bg-white/5 text-sm text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10">
                                    <SelectValue placeholder="AI Model" />
                                </SelectTrigger>
                                <SelectContent className="border-white/10 bg-neutral-900 text-white">
                                    {models.map((model) => (
                                        <SelectItem key={model} value={model} className="text-sm text-neutral-300 focus:bg-white/10 focus:text-white">
                                            {model}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedCategory} onValueChange={onCategoryChange}>
                                <SelectTrigger className="w-[140px] border-white/10 bg-white/5 text-sm text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className="border-white/10 bg-neutral-900 text-white">
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category} className="text-sm text-neutral-300 focus:bg-white/10 focus:text-white">
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedAspectRatio} onValueChange={onAspectRatioChange}>
                                <SelectTrigger className="w-[120px] border-white/10 bg-white/5 text-sm text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10">
                                    <SelectValue placeholder="Ratio" />
                                </SelectTrigger>
                                <SelectContent className="border-white/10 bg-neutral-900 text-white">
                                    {aspectRatios.map((ratio) => (
                                        <SelectItem key={ratio} value={ratio} className="text-sm text-neutral-300 focus:bg-white/10 focus:text-white">
                                            {ratio}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
