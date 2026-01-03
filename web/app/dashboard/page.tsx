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

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    loadDashboard()
  }, [router])

  if (loading) {
    return <p style={{ padding: 40 }}>Loading dashboard...</p>
  }

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={{ marginBottom: 30 }}>MyApp</h2>

        <nav style={styles.nav}>
          <span style={styles.navItem}>Dashboard</span>
          <span style={styles.navItem}>Profile</span>
          <span style={styles.navItem}>Settings</span>
        </nav>

        <button
          style={styles.logout}
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/auth')
          }}
        >
          Sign out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <h1>Welcome 👋</h1>
        <p>{profile?.full_name || 'User'}</p>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Users</h3>
            <p>1 Active</p>
          </div>

          <div style={styles.card}>
            <h3>Wallet</h3>
            <p>₦0.00</p>
          </div>

          <div style={styles.card}>
            <h3>Activity</h3>
            <p>No recent activity</p>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ---------- STYLES ---------- */

const styles: any = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: 220,
    background: '#111',
    color: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  navItem: {
    cursor: 'pointer',
    opacity: 0.9,
  },
  logout: {
    padding: 10,
    background: '#fff',
    color: '#000',
    borderRadius: 6,
    cursor: 'pointer',
    border: 'none',
  },
  main: {
    flex: 1,
    padding: 40,
    background: '#f5f5f5',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
    marginTop: 30,
  },
  card: {
    background: '#fff',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  },
}
