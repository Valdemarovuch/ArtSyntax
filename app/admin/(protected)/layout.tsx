import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { logoutAction } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, LogOut, PlusCircle } from 'lucide-react'

async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // Use service-role client to bypass RLS on admin_users
  const admin = createAdminClient()
  const { data: adminRow } = await admin
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminRow) redirect('/')
  return user
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAdminUser()

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-white/10 bg-black/80 backdrop-blur-xl">
        {/* Brand */}
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <Link href="/admin" className="text-lg font-semibold tracking-tight text-white">
            ArtSyntax
          </Link>
          <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase text-neutral-400">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/posts"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <FileText className="size-4" />
            Posts
          </Link>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <PlusCircle className="size-4" />
            New Post
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-3 py-4">
          <div className="mb-3 px-3">
            <p className="truncate text-xs text-neutral-500">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-3 text-sm text-neutral-400 hover:bg-white/5 hover:text-white"
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
