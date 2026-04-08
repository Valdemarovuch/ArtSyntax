import Link from 'next/link'
import { createPromptAction } from '@/app/admin/actions'
import { PromptForm } from '@/components/admin/prompt-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-8 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
          <Link href="/admin/posts">
            <ChevronLeft className="mr-1 size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">New Post</h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-8">
        <PromptForm action={createPromptAction} submitLabel="Create Post" />
      </div>
    </div>
  )
}
