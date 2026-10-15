import { useState, useEffect } from 'react'
import ContentTable from './ContentTable'

const EMPTY = { photo: '', caption: '', author: '', reader_order: '' }

export default function SeenTab({ slug }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [slug])

  async function load() {
    const r = await fetch(`/api/admin/seen?magazine=${slug}`)
    setItems(await r.json())
  }

  async function save(e) {
    e.preventDefault(); setSaving(true)
    const isEdit = !!form.id
    const body = { ...form, magazine_slug: slug, reader_order: form.reader_order || null }
    await fetch(isEdit ? `/api/admin/seen/${form.id}` : '/api/admin/seen', {
      method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    setForm(null); load(); setSaving(false)
  }

  async function del(id) {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/admin/seen/${id}`, { method: 'DELETE' })
    load()
  }

  const f = form || {}

  return (
    <div>
      <div className="tab-header">
        <h3>Seen</h3>
        <button className="btn-admin-primary" onClick={() => setForm(EMPTY)}>+ Add Post</button>
      </div>
      <ContentTable items={items} cols={['caption', 'author', 'reader_order']} onEdit={setForm} onDelete={del} />

      {form && (
        <div className="admin-overlay" onClick={() => setForm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>{form.id ? 'Edit Post' : 'New Post'}</h3>
            <form onSubmit={save} className="admin-form">
              <label>Photo URL <input required value={f.photo||''} onChange={e => setForm(p => ({ ...p, photo: e.target.value }))} /></label>
              <label>Caption <input value={f.caption||''} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} /></label>
              <label>Author <input value={f.author||''} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} /></label>
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
