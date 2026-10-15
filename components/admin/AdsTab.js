import { useState, useEffect } from 'react'
import ContentTable from './ContentTable'

const EMPTY = { photo: '', cta_label: '', phone: '', email: '', website: '', address: '', reader_order: '' }

export default function AdsTab({ slug }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [slug])

  async function load() {
    const r = await fetch(`/api/admin/ads?magazine=${slug}`)
    setItems(await r.json())
  }

  async function save(e) {
    e.preventDefault(); setSaving(true)
    const isEdit = !!form.id
    const body = { ...form, magazine_slug: slug, reader_order: form.reader_order || null }
    await fetch(isEdit ? `/api/admin/ads/${form.id}` : '/api/admin/ads', {
      method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    setForm(null); load(); setSaving(false)
  }

  async function del(id) {
    if (!confirm('Delete this ad?')) return
    await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' })
    load()
  }

  const f = form || {}

  return (
    <div>
      <div className="tab-header">
        <h3>Ads</h3>
        <button className="btn-admin-primary" onClick={() => setForm(EMPTY)}>+ Add Ad</button>
      </div>
      <ContentTable items={items} cols={['cta_label', 'phone', 'email', 'reader_order']} onEdit={setForm} onDelete={del} />

      {form && (
        <div className="admin-overlay" onClick={() => setForm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>{form.id ? 'Edit Ad' : 'New Ad'}</h3>
            <form onSubmit={save} className="admin-form">
              <label>Photo URL <input value={f.photo||''} onChange={e => setForm(p => ({ ...p, photo: e.target.value }))} /></label>
              <label>CTA Button Label <input value={f.cta_label||''} onChange={e => setForm(p => ({ ...p, cta_label: e.target.value }))} /></label>
              <label>Phone <input value={f.phone||''} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></label>
              <label>Email <input value={f.email||''} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></label>
              <label>Website <input value={f.website||''} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} /></label>
              <label>Address <input value={f.address||''} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} /></label>
              <label>Reader Order <input type="number" value={f.reader_order||''} onChange={e => setForm(p => ({ ...p, reader_order: e.target.value }))} /></label>
              <div className="form-actions">
                <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                <button type="button" className="btn-admin-ghost" onClick={() => setForm(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
