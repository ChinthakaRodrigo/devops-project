function Navbar({ userName, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand-pill">COMMUNITY ISSUE TRACKER</div>

      <nav className="nav-actions" aria-label="Main navigation">
        <span className="welcome-text">Hi, {userName || 'Citizen'}</span>
        <a href="#issues" className="nav-link">Browse Issues</a>
        <a href="#admin" className="nav-link muted">Admin Access</a>
        <button type="button" className="report-button">Report an Issue</button>
        {onLogout && (
          <button type="button" className="logout-button" onClick={onLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  )
}

export default Navbar
