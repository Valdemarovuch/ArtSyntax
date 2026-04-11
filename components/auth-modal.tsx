'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { gallerySignInAction, gallerySignUpAction } from '@/app/admin/actions'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const router = useRouter()
  const [signInState, signInFormAction, signInPending] = useActionState(gallerySignInAction, null)
  const [signUpState, signUpFormAction, signUpPending] = useActionState(gallerySignUpAction, null)

  // On sign in success: admins go to /admin, users stay and refresh
  useEffect(() => {
    if (signInState && !signInState.error) {
      if (signInState.isAdmin) {
        router.push('/admin')
      } else {
        onOpenChange(false)
        router.refresh()
      }
    }
  }, [signInState, onOpenChange, router])

  // On sign up success, refresh to pick up new session
  useEffect(() => {
    if (signUpState?.success) {
      router.refresh()
    }
  }, [signUpState, router])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/10 bg-neutral-950 text-white">
        <DialogTitle className="sr-only">Sign in or create account</DialogTitle>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="w-full bg-white/5">
            <TabsTrigger
              value="signin"
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Sign in
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Sign up
            </TabsTrigger>
          </TabsList>

          {/* ── Sign In ── */}
          <TabsContent value="signin" className="mt-6">
            {signInState?.error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {signInState.error}
              </div>
            )}
            <form action={signInFormAction} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="si-email" className="text-neutral-300">Email</Label>
                <Input
                  id="si-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="border-white/10 bg-white/5 text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="si-password" className="text-neutral-300">Password</Label>
                <Input
                  id="si-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="border-white/10 bg-white/5 text-white placeholder:text-neutral-500"
                />
              </div>
              <Button
                type="submit"
                disabled={signInPending}
                className="w-full bg-white text-black hover:bg-white/90"
              >
                {signInPending ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </TabsContent>

          {/* ── Sign Up ── */}
          <TabsContent value="signup" className="mt-6">
            {signUpState?.error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {signUpState.error}
              </div>
            )}
            {signUpState?.success ? (
              <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-6 text-center text-sm text-green-400">
                Account created! Check your email to confirm your address.
              </div>
            ) : (
              <form action={signUpFormAction} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="su-email" className="text-neutral-300">Email</Label>
                  <Input
                    id="su-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="border-white/10 bg-white/5 text-white placeholder:text-neutral-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-password" className="text-neutral-300">Password</Label>
                  <Input
                    id="su-password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="border-white/10 bg-white/5 text-white placeholder:text-neutral-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={signUpPending}
                  className="w-full bg-white text-black hover:bg-white/90"
                >
                  {signUpPending ? 'Creating account…' : 'Create account'}
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
