import { useState } from 'react'
import { issueSeed } from '../../services/issuesService'
import './admin.css'

function AdminDashboard({ user, onLogout }) {
  const [issues, setIssues] = useState(issueSeed)
  const counts = {
    total: issues.length,
    pending: issues.filter((issue) => issue.status === 'Pending').length,
    inProgress: issues.filter((issue) => issue.status === 'In Progress').length,
    resolved: issues.filter((issue) => issue.status === 'Resolved').length,
  }

  const updateStatus = (issueId, status) => {
    setIssues((currentIssues) =>
      currentIssues.map((issue) =>
        issue.id === issueId ? { ...issue, status } : issue,
      ),
    )
  }

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div>
          <span className="admin-brand">COMMUNITY ISSUE TRACKER</span>
          <span className="admin-label">ADMIN CONSOLE</span>
        </div>
        <div className="admin-user-actions">
          <span>{user.name}</span>
          <button type="button" onClick={onLogout}>Log out</button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <p className="admin-eyebrow">OVERVIEW</p>
            <h1>Issue management</h1>
            <p>Review community reports and update their resolution status.</p>
          </div>
          <span className="admin-access-pill">Administrator access</span>
        </div>

        <section className="admin-stats" aria-label="Issue summary">
          <article><span>Total reports</span><strong>{counts.total}</strong></article>
          <article><span>Pending</span><strong>{counts.pending}</strong></article>
          <article><span>In progress</span><strong>{counts.inProgress}</strong></article>
          <article><span>Resolved</span><strong>{counts.resolved}</strong></article>
        </section>

        <section className="admin-issues">
          <div className="admin-section-heading">
            <div>
              <h2>Community reports</h2>
              <p>Update a report status using the controls in the table.</p>
            </div>
            <span>{issues.length} reports</span>
          </div>

          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Reported</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id}>
                    <td>
                      <strong>{issue.title}</strong>
                      <small>#{issue.id} · {issue.description}</small>
                    </td>
                    <td>{issue.category}</td>
                    <td>{issue.location}</td>
                    <td>{issue.time}</td>
                    <td>
                      <select
                        aria-label={`Status for ${issue.title}`}
                        value={issue.status}
                        onChange={(event) => updateStatus(issue.id, event.target.value)}
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
