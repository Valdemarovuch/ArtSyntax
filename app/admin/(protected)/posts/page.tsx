import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { Button } from '@/components/ui/button'
import { PlusCircle, Pencil } from 'lucide-react'
import { DeletePromptButton } from '@/components/admin/delete-prompt-button'

export default async function AdminPostsPage() {
  const admin = createAdminClient()
  const { data: posts } = await admin
    .from('prompts')
    .select('id, title, model, category, aspect_ratio, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
        <Button asChild className="bg-white text-black hover:bg-white/90">
          <Link href="/admin/posts/new">
            <PlusCircle className="mr-2 size-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5">
        {!posts?.length ? (
          <p className="px-6 py-12 text-center text-sm text-neutral-500">
            No prompts yet.{' '}
            <Link href="/admin/posts/new" className="text-white underline-offset-2 hover:underline">
              Create the first one
            </Link>
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-neutral-500">
                <th className="px-6 py-3">Title</th>
                <th className="hidden px-4 py-3 md:table-cell">Model</th>
                <th className="hidden px-4 py-3 lg:table-cell">Category</th>
                <th className="hidden px-4 py-3 lg:table-cell">Ratio</th>
                <th className="hidden px-4 py-3 md:table-cell">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                  <td className="hidden px-4 py-4 text-neutral-400 md:table-cell">{post.model}</td>
                  <td className="hidden px-4 py-4 text-neutral-400 lg:table-cell">{post.category}</td>
                  <td className="hidden px-4 py-4 text-neutral-400 lg:table-cell">{post.aspect_ratio}</td>
                  <td className="hidden px-4 py-4 text-neutral-500 md:table-cell">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeletePromptButton id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

