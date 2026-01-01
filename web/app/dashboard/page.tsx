'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setFullName(data?.full_name || '')
    }

    loadProfile()
  }, [router])

  const handleSave = async () => {
    if (!profile) return

    setLoading(true)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Profile updated successfully ✅')
    }

    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (!profile) return <p style={{ padding: 40 }}>Loading dashboard...</p>

  return (
    <div style={{ padding: 40, background: '#0f172a', minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
        {/* Profile Card */}
        <div style={{ background: '#020617', padding: 20, borderRadius: 8 }}>
          <h3>Profile</h3>
          <p><strong>User ID:</strong></p>
          <p style={{ fontSize: 12, wordBreak: 'break-all' }}>{profile.id}</p>
        </div>

        {/* Account Card */}
        <div style={{ background: '#020617', padding: 20, borderRadius: 8 }}>
          <h3>Account</h3>
          <p>Status: Active ✅</p>
          <p>Role: User</p>
        </div>
      </div>

      {/* Edit Profile */}
      <div style={{ marginTop: 30, background: '#020617', padding: 20, borderRadius: 8, maxWidth: 500 }}>
        <h3>Edit Profile</h3>

        <label>
          Full Name
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: '100%',
              marginTop: 5,
              marginBottom: 10,
              padding: 8,
            }}
          />
        </label>

        <button onClick={handleSave} disabled={loading}>
          Save Profile
        </button>

        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  )
}
