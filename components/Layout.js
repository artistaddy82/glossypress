import Head from 'next/head'
import Link from 'next/link'

export default function Layout({ mag, active, children }) {
  const style = {
    '--color-primary': mag.color_primary,
    '--color-secondary': mag.color_secondary,
    '--color-accent': mag.color_accent,
    '--color-dark': mag.color_dark,
    '--color-button': mag.color_button,
  }

  return (
    <>
      <Head>
        <title>{mag.brand_name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="shell" style={style}>
        {/* Top bar */}
        <header className="topbar">
          <span className="topbar-brand">{mag.brand_name}</span>
          <button className="topbar-profile" aria-label="Profile">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
        </header>

        <main className="main-content">{children}</main>

        {/* Bottom nav */}
        <nav className="bottomnav">
          <Link href={`/${mag.slug}`} className={`nav-item ${active === 'home' ? 'active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span>Home</span>
          </Link>
          <Link href={`/${mag.slug}/magazine`} className={`nav-item ${active === 'magazine' ? 'active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
            <span>Magazine</span>
          </Link>
          <Link href={`/${mag.slug}/calendar`} className={`nav-item ${active === 'calendar' ? 'active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
            <span>Calendar</span>
          </Link>
          <Link href={`/${mag.slug}/community`} className={`nav-item ${active === 'community' ? 'active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C16.19 13.89 17 15.02 17 16.5V19h5v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            <span>Community</span>
          </Link>
        </nav>
      </div>
    </>
  )
}
