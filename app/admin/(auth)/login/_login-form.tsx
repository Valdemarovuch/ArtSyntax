'use client'

import { useSearchParams } from 'next/navigation'
import { loginAction } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const errorMessages: Record<string, string> = {
  invalid_credentials: 'Invalid email or password.',
  missing_fields: 'Please fill in all fields.',
  auth_callback_failed: 'Authentication failed. Please try again.',
}

export default function LoginForm() {
  const searchParams = useSearchParams()
  const errorKey = searchParams.get('error')
  const error = errorKey ? (errorMessages[errorKey] ?? 'An error occurred.') : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-sm space-y-8 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">ArtSyntax</h1>
          <p className="mt-2 text-sm text-neutral-500">Admin Panel</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-lg font-medium text-white">Sign in</h2>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600 focus-visible:ring-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="border-white/10 bg-white/5 text-white placeholder:text-neutral-600 focus-visible:ring-white/20"
              />
            </div>

            <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
