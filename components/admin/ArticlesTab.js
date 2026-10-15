import { useState, useEffect } from 'react'
import ContentTable from './ContentTable'

const EMPTY = { title: '', category: '', hero_type: 'image', hero_image: '', hero_video_url: '', body: '', is_top_story: false, reader_order: '' }

export default function ArticlesTab({ slug }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [slug])

  async function load() {
    const r = await fetch(`/api/admin/articles?magazine=${slug}`)
    setItems(await r.json())
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    const isEdit = !!form.id
    const url = isEdit ? `/api/admin/articles/${form.id}` : '/api/admin/articles'
    const body = { ...form, magazine_slug: slug, reader_order: form.reader_order || null }
    await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setForm(null)
    load()
    setSaving(false)
  }

  async function del(id) {
    if (!confirm('Delete this article?')) return
    await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' })
    load()
  }

  const cols = ['title', 'category', 'hero_type', 'is_top_story', 'reader_order']

  return (
    <div>
      <div className="tab-header">
        <h3>Articles</h3>
        <button className="btn-admin-primary" onClick={() => setForm(EMPTY)}>+ Add Article</button>
      </div>
      <ContentTable items={items} cols={cols} onEdit={item => setForm(item)} onDelete={del} />

      {form && (
        <div className="admin-overlay" onClick={() => setForm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>{form.id ? 'Edit Article' : 'New Article'}</h3>
            <form onSubmit={save} className="admin-form">
              <label>Title <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></label>
              <label>Category <input value={form.category||''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></label>
              <label>Hero Type
                <select value={form.hero_type} onChange={e => setForm(f => ({ ...f, hero_type: e.target.value }))}>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </label>
              {form.hero_type === 'image'
                ? <label>Hero Image URL <input value={form.hero_image||''} onChange={e => setForm(f => ({ ...f, hero_image: e.target.value }))} /></label>
                : <label>Video URL <input value={form.hero_video_url||''} onChange={e => setForm(f => ({ ...f, hero_video_url: e.target.value }))} /></label>
              }
              <label>Body <textarea rows={5} value={form.body||''} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} /></label>
              <label className="checkbox-label">
                <input type="checkbox" checked={form.is_top_story} onChange={e => setForm(f => ({ ...f, is_top_story: e.target.checked }))} />
                Top Story
              </label>
              <label>Reader Order <input type="number" value={form.reader_order||''} onChange={e => setForm(f => ({ ...f, reader_order: e.target.value }))} /></label>
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
