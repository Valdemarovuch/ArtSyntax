import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { updatePromptAction } from '@/app/admin/actions'
import { PromptForm } from '@/components/admin/prompt-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import type { PromptRow } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params

  const admin = createAdminClient()
  const { data: post } = await admin
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single<PromptRow>()

  if (!post) notFound()

  const updateAction = updatePromptAction.bind(null, id)

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-8 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
          <Link href="/admin/posts">
            <ChevronLeft className="mr-1 size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Post</h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-8">
        <PromptForm
          action={updateAction}
          defaultValues={post}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  )
}
