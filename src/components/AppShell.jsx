import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import './app-shell.css'

/** Two-pane app layout: collapsible sidebar + top bar + routed main area. */
function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <button
          type="button"
          className="app-shell__scrim"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="app-shell__main">
        <TopBar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
