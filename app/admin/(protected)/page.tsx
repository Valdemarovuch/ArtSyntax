import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { Button } from '@/components/ui/button'
import { PlusCircle, FileText, Eye } from 'lucide-react'

export default async function AdminDashboard() {
  const admin = createAdminClient()

  const [{ count }, { data: recent }] = await Promise.all([
    admin.from('prompts').select('*', { count: 'exact', head: true }),
    admin
      .from('prompts')
      .select('id, title, model, category, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const total = count ?? 0

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <Button asChild className="bg-white text-black hover:bg-white/90">
          <Link href="/admin/posts/new">
            <PlusCircle className="mr-2 size-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-neutral-400">Total Prompts</p>
          <p className="mt-2 text-4xl font-bold">{total ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-neutral-400">Recent (last 5)</p>
          <p className="mt-2 text-4xl font-bold">{recent?.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">Public Gallery</p>
            <Button asChild variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
              <Link href="/" target="_blank">
                <Eye className="size-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-2 text-sm text-neutral-500">View as visitor →</p>
        </div>
      </div>

      {/* Recent posts */}
      <div className="rounded-xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="font-medium">Recent Posts</h2>
          <Button asChild variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
            <Link href="/admin/posts">
              <FileText className="mr-2 size-4" />
              All posts
            </Link>
          </Button>
        </div>

        {!recent?.length ? (
          <p className="px-6 py-8 text-center text-sm text-neutral-500">
            No prompts yet.{' '}
            <Link href="/admin/posts/new" className="text-white underline-offset-2 hover:underline">
              Create the first one
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {recent.map((row) => (
              <li key={row.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-white">{row.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {row.model} · {row.category}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-neutral-600">
                    {new Date(row.created_at).toLocaleDateString()}
                  </p>
                  <Button asChild variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
                    <Link href={`/admin/posts/${row.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
