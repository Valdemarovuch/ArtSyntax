'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/admin/login?error=missing_fields')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/admin/login?error=invalid_credentials')
  }

  redirect('/admin')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

// ── Guard: verify caller is an admin ─────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const admin = createAdminClient()
  const { data: adminRow } = await admin
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminRow) redirect('/')
}

// ── Prompts CRUD (via Supabase) ───────────────────────────────────────────────

export async function createPromptAction(formData: FormData) {
  await requireAdmin()

  const admin = createAdminClient()
  const { error } = await admin.from('prompts').insert({
    title: formData.get('title') as string,
    image_url: formData.get('image_url') as string,
    core_prompt: formData.get('core_prompt') as string,
    negative_prompt: (formData.get('negative_prompt') as string) ?? '',
    model: formData.get('model') as string,
    category: formData.get('category') as string,
    aspect_ratio: formData.get('aspect_ratio') as string,
    seed: formData.get('seed') ? Number(formData.get('seed')) : null,
    steps: formData.get('steps') ? Number(formData.get('steps')) : null,
    cfg_scale: formData.get('cfg_scale') ? Number(formData.get('cfg_scale')) : null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/posts')
  redirect('/admin/posts')
}

export async function updatePromptAction(id: string, formData: FormData) {
  await requireAdmin()

  const admin = createAdminClient()
  const { error } = await admin
    .from('prompts')
    .update({
      title: formData.get('title') as string,
      image_url: formData.get('image_url') as string,
      core_prompt: formData.get('core_prompt') as string,
      negative_prompt: (formData.get('negative_prompt') as string) ?? '',
      model: formData.get('model') as string,
      category: formData.get('category') as string,
      aspect_ratio: formData.get('aspect_ratio') as string,
      seed: formData.get('seed') ? Number(formData.get('seed')) : null,
      steps: formData.get('steps') ? Number(formData.get('steps')) : null,
      cfg_scale: formData.get('cfg_scale') ? Number(formData.get('cfg_scale')) : null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/posts')
  redirect('/admin/posts')
}

export async function deletePromptAction(id: string) {
  await requireAdmin()

  const admin = createAdminClient()
  const { error } = await admin.from('prompts').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/posts')
}

// ── Quick create from gallery modal (no redirect) ────────────────────────────

export async function createPromptQuickAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()
  const { data: adminRow } = await admin
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()
  if (!adminRow) return { error: 'Not authorized' }

  const { error } = await admin.from('prompts').insert({
    title: formData.get('title') as string,
    image_url: formData.get('image_url') as string,
    core_prompt: formData.get('core_prompt') as string,
    negative_prompt: (formData.get('negative_prompt') as string) ?? '',
    model: formData.get('model') as string,
    category: formData.get('category') as string,
    aspect_ratio: formData.get('aspect_ratio') as string,
    seed: formData.get('seed') ? Number(formData.get('seed')) : null,
    steps: formData.get('steps') ? Number(formData.get('steps')) : null,
    cfg_scale: formData.get('cfg_scale') ? Number(formData.get('cfg_scale')) : null,
  })

  if (error) return { error: error.message }

  revalidatePath('/')
  return {}
}

// ── Gallery user auth (sign in / sign up / sign out) ─────────────────────────

export async function gallerySignInAction(
  _prev: { error?: string; isAdmin?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; isAdmin?: boolean }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email and password are required' }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'Invalid email or password' }

  const admin = createAdminClient()
  const { data: adminRow } = await admin
    .from('admin_users')
    .select('id')
    .eq('id', data.user.id)
    .single()

  return { isAdmin: !!adminRow }
}

export async function gallerySignUpAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email and password are required' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email, password })

  if (error) return { error: error.message }

  return { success: true }
}

export async function gallerySignOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

