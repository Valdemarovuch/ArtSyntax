'use client'

import { useTransition } from 'react'
import { deletePromptAction } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function DeletePromptButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Delete this prompt? This action cannot be undone.')) return
    startTransition(() => deletePromptAction(id))
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={handleDelete}
      className="text-red-500 hover:bg-red-500/10 hover:text-red-400"
    >
      <Trash2 className="size-4" />
    </Button>
  )
}
