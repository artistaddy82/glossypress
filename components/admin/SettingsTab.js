import { useState } from 'react'

export default function SettingsTab({ mag, onSave }) {
  const [form, setForm] = useState({ ...mag, tags: Array.isArray(mag.tags) ? mag.tags.join(', ') : mag.tags })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save(e) {
    e.preventDefault(); setSaving(true)
    const body = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    const r = await fetch(`/api/admin/magazines/${mag.slug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    if (r.ok) { onSave(await r.json()); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    setSaving(false)
  }

  return (
    <div>
      <div className="tab-header"><h3>Magazine Settings</h3></div>
      <form onSubmit={save} className="admin-form settings-form">
        <label>Brand Name <input required value={form.brand_name} onChange={e => setForm(f => ({ ...f, brand_name: e.target.value }))} /></label>

        <div className="settings-section">
          <p className="settings-section-label">Brand Colors</p>
          <div className="color-row">
            {[
              ['color_primary', 'Primary'],
              ['color_secondary', 'Secondary'],
              ['color_accent', 'Accent'],
              ['color_dark', 'Dark'],
              ['color_button', 'Button'],
            ].map(([k, label]) => (
              <label key={k} className="color-label">
                {label}
                <input type="color" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                <span className="color-hex">{form[k]}</span>
              </label>
            ))}
          </div>
          <div className="color-preview" style={{
            background: form.color_dark,
            borderColor: form.color_primary,
          }}>
            <span style={{ color: form.color_primary, fontWeight: 800 }}>{form.brand_name}</span>
            <span className="cp-tag" style={{ background: form.color_primary, color: form.color_dark }}>Category</span>
            <span className="cp-btn" style={{ background: form.color_button }}>Button</span>
          </div>
        </div>

        <label>Contact Email <input type="email" value={form.contact_email||''} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} /></label>
        <label>Contact Phone <input value={form.contact_phone||''} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} /></label>
        <label>Tags (comma separated)
          <textarea rows={3} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
        </label>

        <button type="submit" className="btn-admin-primary" disabled={saving}>
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
