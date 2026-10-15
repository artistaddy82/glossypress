import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ArticlesTab from '../../../components/admin/ArticlesTab'
import EventsTab from '../../../components/admin/EventsTab'
import AdsTab from '../../../components/admin/AdsTab'
import SeenTab from '../../../components/admin/SeenTab'
import SettingsTab from '../../../components/admin/SettingsTab'

const TABS = ['Articles', 'Events', 'Ads', 'Seen', 'Settings']

export default function MagAdmin() {
  const router = useRouter()
  const { magazine: slug, tab: tabParam } = router.query
  const [mag, setMag] = useState(null)
  const [tab, setTab] = useState('Articles')

  useEffect(() => { if (tabParam) setTab(tabParam) }, [tabParam])

  useEffect(() => {
    if (!slug) return
    fetch(`/api/admin/magazines`).then(async r => {
      if (r.status === 401) return router.push('/admin/login')
      const mags = await r.json()
      setMag(mags.find(m => m.slug === slug) || null)
    })
  }, [slug])

  if (!mag) return <div className="admin-loading">Loading…</div>

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link href="/admin" className="admin-back">← All Magazines</Link>
        <div className="admin-header-right">
          <span className="admin-logo" style={{ color: mag.color_primary }}>{mag.brand_name}</span>
          <a href={`/${slug}`} target="_blank" rel="noreferrer" className="btn-admin-ghost">View Site ↗</a>
        </div>
      </header>

      <nav className="admin-tabs">
        {TABS.map(t => (
          <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>

      <main className="admin-main">
        {tab === 'Articles' && <ArticlesTab slug={slug} />}
        {tab === 'Events'   && <EventsTab slug={slug} />}
        {tab === 'Ads'      && <AdsTab slug={slug} />}
        {tab === 'Seen'     && <SeenTab slug={slug} />}
        {tab === 'Settings' && <SettingsTab mag={mag} onSave={setMag} />}
      </main>
    </div>
  )
}
