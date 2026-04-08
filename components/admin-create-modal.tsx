'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
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
import { createPromptQuickAction } from '@/app/admin/actions'
import { models, categories, aspectRatios } from '@/lib/types'

interface AdminCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminCreateModal({ open, onOpenChange }: AdminCreateModalProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(createPromptQuickAction, null)

  // Close modal and refresh on success
  useEffect(() => {
    if (state && !state.error) {
      onOpenChange(false)
      formRef.current?.reset()
      router.refresh()
    }
  }, [state, onOpenChange, router])

  const modelOptions = models.filter((m) => m !== 'All Models')
  const categoryOptions = categories.filter((c) => c !== 'All Categories')
  const ratioOptions = aspectRatios.filter((r) => r !== 'All Ratios')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-white/10 bg-neutral-950 text-white">
        <DialogTitle className="text-lg font-semibold">New Prompt</DialogTitle>

        {state?.error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {state.error}
          </div>
        )}

        <form ref={formRef} action={formAction} className="space-y-5">
          {/* Title & Image URL */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="q-title" className="text-neutral-300">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="q-title"
                name="title"
                required
                placeholder="e.g. Cosmic Dreamscape"
                className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-image_url" className="text-neutral-300">
                Image URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="q-image_url"
                name="image_url"
                type="url"
                required
                placeholder="https://..."
                className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
              />
            </div>
          </div>

          {/* Core Prompt */}
          <div className="space-y-1.5">
            <Label htmlFor="q-core_prompt" className="text-neutral-300">
              Core Prompt <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="q-core_prompt"
              name="core_prompt"
              required
              rows={3}
              placeholder="Describe the image in detail..."
              className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
            />
          </div>

          {/* Negative Prompt */}
          <div className="space-y-1.5">
            <Label htmlFor="q-negative_prompt" className="text-neutral-300">
              Negative Prompt
            </Label>
            <Textarea
              id="q-negative_prompt"
              name="negative_prompt"
              rows={2}
              placeholder="What to avoid..."
              className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
            />
          </div>

          {/* Model / Category / Ratio */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-neutral-300">
                Model <span className="text-red-500">*</span>
              </Label>
              <Select name="model" required>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-neutral-900 text-white">
                  {modelOptions.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-neutral-300">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select name="category" required>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-neutral-900 text-white">
                  {categoryOptions.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-neutral-300">
                Aspect Ratio <span className="text-red-500">*</span>
              </Label>
              <Select name="aspect_ratio" required>
                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-neutral-900 text-white">
                  {ratioOptions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="q-seed" className="text-neutral-300">Seed</Label>
              <Input
                id="q-seed"
                name="seed"
                type="number"
                placeholder="e.g. 42891"
                className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-steps" className="text-neutral-300">Steps</Label>
              <Input
                id="q-steps"
                name="steps"
                type="number"
                min={1}
                max={200}
                placeholder="e.g. 50"
                className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-cfg_scale" className="text-neutral-300">CFG Scale</Label>
              <Input
                id="q-cfg_scale"
                name="cfg_scale"
                type="number"
                step="0.5"
                min={1}
                max={20}
                placeholder="e.g. 7.5"
                className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-neutral-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-white text-black hover:bg-white/90"
            >
              {isPending ? 'Creating…' : 'Create Prompt'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
