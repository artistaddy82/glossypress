import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const DEFAULTS = {
  slug: '', brand_name: '',
  color_primary: '#FF0AE2', color_secondary: '#00ADEF',
  color_accent: '#FFF30A', color_dark: '#000E4C', color_button: '#7A4E7C',
  contact_email: '', contact_phone: '', tags: '',
}

export default function AdminIndex() {
  const router = useRouter()
  const [mags, setMags] = useState([])
  const [form, setForm] = useState(DEFAULTS)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchMags() }, [])

  async function fetchMags() {
    const r = await fetch('/api/admin/magazines')
    if (r.status === 401) return router.push('/admin/login')
    setMags(await r.json())
  }

  async function create(e) {
    e.preventDefault()
    setSaving(true)
    const body = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    const r = await fetch('/api/admin/magazines', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (r.ok) { setCreating(false); setForm(DEFAULTS); fetchMags() }
    setSaving(false)
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <h1 className="admin-logo">GlossyPress</h1>
        <span className="admin-subtitle">Admin</span>
      </header>

      <main className="admin-main">
        <div className="admin-section-header">
          <h2>Magazines</h2>
          <button className="btn-admin-primary" onClick={() => setCreating(true)}>+ New Magazine</button>
        </div>

        <div className="mag-grid">
          {mags.map(m => (
            <Link key={m.slug} href={`/admin/${m.slug}`} className="mag-card" style={{ '--c': m.color_primary }}>
              <div className="mag-card-swatch" style={{ background: m.color_primary }} />
              <div className="mag-card-body">
                <p className="mag-card-name">{m.brand_name}</p>
                <p className="mag-card-slug">/{m.slug}</p>
              </div>
            </Link>
          ))}
        </div>

        {creating && (
          <div className="admin-overlay" onClick={() => setCreating(false)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h3>New Magazine</h3>
              <form onSubmit={create} className="admin-form">
                <label>Slug <input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s/g, '-') }))} placeholder="outavl" /></label>
                <label>Brand Name <input required value={form.brand_name} onChange={e => setForm(f => ({ ...f, brand_name: e.target.value }))} placeholder="OUTAVL" /></label>
                <div className="color-row">
                  {['color_primary','color_secondary','color_accent','color_dark','color_button'].map(k => (
                    <label key={k} className="color-label">
                      {k.replace('color_','')}
                      <input type="color" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                    </label>
                  ))}
                </div>
                <label>Contact Email <input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} /></label>
                <label>Contact Phone <input value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} /></label>
                <label>Tags (comma separated) <textarea value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} rows={2} placeholder="Music, Food & Drink, Nightlife" /></label>
                <div className="form-actions">
                  <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving…' : 'Create'}</button>
                  <button type="button" className="btn-admin-ghost" onClick={() => setCreating(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
