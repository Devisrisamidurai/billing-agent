import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { search as searchApi } from '../api/search'
import { useAuth } from '../context/AuthContext'

const TYPE_LABEL = {
  CONVERSATION: 'Conversations',
  SCENARIO: 'Scenarios',
  ARTICLE: 'Knowledge',
}

function TopBar({ onToggleSidebar }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const menuRef = useRef(null)

  // Debounced global search.
  useEffect(() => {
    const q = query.trim()
    let active = true
    const t = setTimeout(async () => {
      if (q.length < 2) {
        if (active) {
          setResults([])
          setOpen(false)
        }
        return
      }
      try {
        const data = await searchApi(q)
        if (active) {
          setResults(data ?? [])
          setOpen(true)
        }
      } catch {
        if (active) setResults([])
      }
    }, 300)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [query])

  // Close dropdowns on outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleSelect = (result) => {
    setOpen(false)
    setQuery('')
    if (result.type === 'CONVERSATION') navigate(`/chat/${result.id}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const grouped = results.reduce((acc, r) => {
    ;(acc[r.type] ??= []).push(r)
    return acc
  }, {})

  const initials = (user?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__menu-btn"
        aria-label="Toggle menu"
        onClick={onToggleSidebar}
      >
        ☰
      </button>

      <div className="topbar__search" ref={searchRef}>
        <span className="topbar__search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="search"
          placeholder="Search conversations, scenarios, articles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          aria-label="Global search"
        />
        {open && (
          <div className="topbar__results" role="listbox">
            {results.length === 0 ? (
              <p className="topbar__results-empty">No matches.</p>
            ) : (
              Object.keys(grouped).map((type) => (
                <div key={type} className="topbar__results-group">
                  <p className="topbar__results-label">
                    {TYPE_LABEL[type] ?? type}
                  </p>
                  {grouped[type].map((r) => (
                    <button
                      type="button"
                      key={`${r.type}-${r.id}`}
                      className="topbar__result"
                      onClick={() => handleSelect(r)}
                    >
                      <span className="topbar__result-title">{r.title}</span>
                      <span className="topbar__result-snippet">{r.snippet}</span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="topbar__user" ref={menuRef}>
        <button
          type="button"
          className="topbar__avatar"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          {initials}
        </button>
        {menuOpen && (
          <div className="topbar__menu" role="menu">
            <div className="topbar__menu-header">
              <p className="topbar__menu-name">{user?.name}</p>
              <p className="topbar__menu-email">{user?.email}</p>
            </div>
            <button
              type="button"
              className="topbar__menu-item"
              onClick={handleLogout}
              role="menuitem"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default TopBar
