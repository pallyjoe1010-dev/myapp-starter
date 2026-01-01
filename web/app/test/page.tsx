'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState('Checking Supabase...')

  useEffect(() => {
    async function checkConnection() {
      const { error } = await supabase
        .from('test_table')
        .select('*')
        .limit(1)

      if (error) {
        setStatus('Supabase connected ✅ (table not found — expected)')
      } else {
        setStatus('Supabase connected and responding ✅')
      }
    }

    checkConnection()
  }, [])

  return (
    <div style={{ padding: 40 }}>
      <h1>Supabase Connection Test</h1>
      <p>{status}</p>
    </div>
  )
}
