import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { GalleryView } from '@/components/gallery-view'
import { rowToPrompt } from '@/lib/types'
import type { PromptRow } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  const [{ data: rows }, { data: { user } }] = await Promise.all([
    supabase.from('prompts').select('*').order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  let isAdmin = false
  if (user) {
    const admin = createAdminClient()
    const { data } = await admin
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()
    isAdmin = !!data
  }

  const prompts = (rows as PromptRow[] ?? []).map(rowToPrompt)

  return <GalleryView initialPrompts={prompts} isAdmin={isAdmin} />
}
