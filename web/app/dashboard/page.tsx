'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error(error)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    loadDashboard()
  }, [router])

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Loading dashboard...</h2>
      </div>
    )
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      <div style={{ marginTop: 20 }}>
        <p><strong>User ID:</strong> {profile?.id}</p>
        <p><strong>Email:</strong> {profile?.email || 'N/A'}</p>
        <p><strong>Full Name:</strong> {profile?.full_name || 'Not set yet'}</p>
      </div>

      <button
        style={{
          marginTop: 30,
          padding: '10px 20px',
          background: 'black',
          color: 'white',
          borderRadius: 6,
          cursor: 'pointer',
        }}
        onClick={async () => {
          await supabase.auth.signOut()
          router.push('/auth')
        }}
      >
        Sign out
      </button>
    </div>
  )
}
