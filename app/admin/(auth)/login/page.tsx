import { Suspense } from 'react'
import LoginForm from './_login-form'

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
