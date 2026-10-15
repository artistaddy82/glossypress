import { useState, useEffect } from 'react'
import ContentTable from './ContentTable'

const EMPTY = { title: '', description: '', image: '', location: '', address: '', start_time: '', end_time: '', tags: '', is_featured: false, is_editors_pick: false, is_trending: false, age_restriction: '', cover_charge: '', venue_type: '', ticket_url: '', website: '', reader_order: '' }

export default function EventsTab({ slug }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [slug])

  async function load() {
    const r = await fetch(`/api/admin/events?magazine=${slug}`)
    setItems(await r.json())
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    const isEdit = !!form.id
    const body = {
      ...form, magazine_slug: slug,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
      reader_order: form.reader_order || null,
    }
    await fetch(isEdit ? `/api/admin/events/${form.id}` : '/api/admin/events', {
      method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    setForm(null); load(); setSaving(false)
  }

  async function del(id) {
    if (!confirm('Delete this event?')) return
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    load()
  }

  const f = form || {}
  const tagsVal = Array.isArray(f.tags) ? f.tags.join(', ') : (f.tags || '')

  return (
    <div>
      <div className="tab-header">
        <h3>Events</h3>
        <button className="btn-admin-primary" onClick={() => setForm(EMPTY)}>+ Add Event</button>
      </div>
      <ContentTable items={items} cols={['title', 'location', 'start_time', 'is_featured', 'reader_order']} onEdit={item => setForm({ ...item, tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags })} onDelete={del} />

      {form && (
        <div className="admin-overlay" onClick={() => setForm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>{form.id ? 'Edit Event' : 'New Event'}</h3>
            <form onSubmit={save} className="admin-form">
              <label>Title <input required value={f.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></label>
              <label>Description <textarea rows={3} value={f.description||''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></label>
              <label>Image URL <input value={f.image||''} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} /></label>
              <label>Location <input value={f.location||''} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></label>
              <label>Address <input value={f.address||''} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} /></label>
              <div className="two-col">
                <label>Start <input type="datetime-local" value={f.start_time ? f.start_time.slice(0,16) : ''} onChange={e => setForm(p => ({ ...p, start_time: e.target.value }))} /></label>
                <label>End <input type="datetime-local" value={f.end_time ? f.end_time.slice(0,16) : ''} onChange={e => setForm(p => ({ ...p, end_time: e.target.value }))} /></label>
              </div>
              <label>Tags (comma separated) <input value={tagsVal} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} /></label>
              <label>Ticket URL <input value={f.ticket_url||''} onChange={e => setForm(p => ({ ...p, ticket_url: e.target.value }))} /></label>
              <label>Website <input value={f.website||''} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} /></label>
              <div className="checkbox-row">
                {['is_featured','is_editors_pick','is_trending'].map(k => (
                  <label key={k} className="checkbox-label">
                    <input type="checkbox" checked={!!f[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.checked }))} />
                    {k.replace('is_','').replace('_',' ')}
                  </label>
                ))}
              </div>
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
