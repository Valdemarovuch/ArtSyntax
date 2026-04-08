'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { models, categories, aspectRatios } from '@/lib/prompts-data'
import type { PromptRow } from '@/lib/types'
import { useState } from 'react'

interface PromptFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: Partial<PromptRow>
  submitLabel?: string
}

export function PromptForm({
  action,
  defaultValues,
  submitLabel = 'Save',
}: PromptFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const modelOptions = models.filter((m) => m !== 'All Models')
  const categoryOptions = categories.filter((c) => c !== 'All Categories')
  const ratioOptions = aspectRatios.filter((r) => r !== 'All Ratios')

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    try {
      await action(formData)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Title & Image URL */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-neutral-300">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={defaultValues?.title}
            placeholder="e.g. Cosmic Dreamscape"
            className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image_url" className="text-neutral-300">
            Image URL <span className="text-red-500">*</span>
          </Label>
          <Input
            id="image_url"
            name="image_url"
            type="url"
            required
            defaultValue={defaultValues?.image_url}
            placeholder="https://..."
            className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
          />
        </div>
      </div>

      {/* Core Prompt */}
      <div className="space-y-2">
        <Label htmlFor="core_prompt" className="text-neutral-300">
          Core Prompt <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="core_prompt"
          name="core_prompt"
          required
          rows={4}
          defaultValue={defaultValues?.core_prompt}
          placeholder="Describe the image in detail..."
          className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
        />
      </div>

      {/* Negative Prompt */}
      <div className="space-y-2">
        <Label htmlFor="negative_prompt" className="text-neutral-300">
          Negative Prompt
        </Label>
        <Textarea
          id="negative_prompt"
          name="negative_prompt"
          rows={2}
          defaultValue={defaultValues?.negative_prompt}
          placeholder="What to avoid..."
          className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
        />
      </div>

      {/* Model / Category / Aspect Ratio */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-neutral-300">
            Model <span className="text-red-500">*</span>
          </Label>
          <Select name="model" defaultValue={defaultValues?.model} required>
            <SelectTrigger className="border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-neutral-900 text-white">
              {modelOptions.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-neutral-300">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select name="category" defaultValue={defaultValues?.category} required>
            <SelectTrigger className="border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-neutral-900 text-white">
              {categoryOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-neutral-300">
            Aspect Ratio <span className="text-red-500">*</span>
          </Label>
          <Select name="aspect_ratio" defaultValue={defaultValues?.aspect_ratio} required>
            <SelectTrigger className="border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Select ratio" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-neutral-900 text-white">
              {ratioOptions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced params */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="seed" className="text-neutral-300">
            Seed
          </Label>
          <Input
            id="seed"
            name="seed"
            type="number"
            defaultValue={defaultValues?.seed !== null && defaultValues?.seed !== undefined ? String(defaultValues.seed) : ''}
            placeholder="e.g. 42891"
            className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="steps" className="text-neutral-300">
            Steps
          </Label>
          <Input
            id="steps"
            name="steps"
            type="number"
            min={1}
            max={200}
            defaultValue={defaultValues?.steps ?? ''}
            placeholder="e.g. 50"
            className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cfg_scale" className="text-neutral-300">
            CFG Scale
          </Label>
          <Input
            id="cfg_scale"
            name="cfg_scale"
            type="number"
            step="0.5"
            min={1}
            max={20}
            defaultValue={defaultValues?.cfg_scale !== null && defaultValues?.cfg_scale !== undefined ? String(defaultValues.cfg_scale) : ''}
            placeholder="e.g. 7.5"
            className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="text-neutral-400 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-white text-black hover:bg-white/90"
        >
          {isPending ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
