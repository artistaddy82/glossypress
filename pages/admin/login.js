import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (r.ok) router.push('/admin')
    else setError('Wrong password')
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <h1 className="admin-logo">GlossyPress</h1>
        <p className="admin-subtitle">Admin</p>
        <form onSubmit={submit} className="admin-form">
          <label>Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-admin-primary">Sign In</button>
        </form>
      </div>
    </div>
  )
}
