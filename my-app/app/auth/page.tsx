'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Signup successful. You can now log in.')
    }

    setLoading(false)
  }

  const handleSignIn = async () => {
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Login / Sign Up</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleSignUp} disabled={loading}>
          Sign Up
        </button>

        <button onClick={handleSignIn} disabled={loading}>
          Sign In
        </button>
      </div>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  )
}
