import { useEffect, useState } from 'react'

import {
  getIssuesByCouncil,
  updateIssueStatus,
  deleteIssue,
} from '../../services/issuesService'

import './admin.css'

function AdminDashboard({ user, onLogout }) {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // --------------------------------------------------
  // LOAD ONLY THIS ADMIN'S COUNCIL ISSUES
  // --------------------------------------------------

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        if (!user?.councilName) {
          setErrorMessage('Council information is missing for this admin.')
          setIssues([])
          return
        }

        const data = await getIssuesByCouncil(user.councilName)

        setIssues(data)
      } catch (error) {
        console.error('Failed to load council issues:', error)

        setErrorMessage('Unable to load community issues.')
      } finally {
        setLoading(false)
      }
    }

    loadIssues()
  }, [user?.councilName])

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const counts = {
    total: issues.length,

    pending: issues.filter(
      (issue) => issue.status === 'SUBMITTED'
    ).length,

    inProgress: issues.filter(
      (issue) =>
        issue.status === 'FORWARDED' ||
        issue.status === 'IN_PROGRESS'
    ).length,

    resolved: issues.filter(
      (issue) => issue.status === 'RESOLVED'
    ).length,
  }

  // --------------------------------------------------
  // UPDATE STATUS
  // --------------------------------------------------

  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      setErrorMessage('')

      const currentIssue = issues.find(
        (issue) => issue.id === issueId
      )

      await updateIssueStatus(
        issueId,
        newStatus,
        currentIssue?.forwardedTo || null
      )

      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === issueId
            ? {
                ...issue,
                status: newStatus,
              }
            : issue
        )
      )
    } catch (error) {
      console.error('Failed to update issue:', error)

      setErrorMessage('Unable to update issue status.')
    }
  }

  // --------------------------------------------------
  // DELETE ISSUE
  // --------------------------------------------------

  const handleDelete = async (issueId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this issue?'
    )

    if (!confirmed) {
      return
    }

    try {
      setErrorMessage('')

      await deleteIssue(issueId)

      setIssues((currentIssues) =>
        currentIssues.filter(
          (issue) => issue.id !== issueId
        )
      )
    } catch (error) {
      console.error('Failed to delete issue:', error)

      setErrorMessage('Unable to delete issue.')
    }
  }

  // --------------------------------------------------
  // DISPLAY STATUS
  // --------------------------------------------------

  const getStatusLabel = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return 'Submitted'

      case 'FORWARDED':
        return 'Forwarded'

      case 'IN_PROGRESS':
        return 'In Progress'

      case 'RESOLVED':
        return 'Resolved'

      default:
        return status
    }
  }

  return (
    <div className="admin-app">

      {/* HEADER */}

      <header className="admin-header">
        <div>
          <span className="admin-brand">
            COMMUNITY ISSUE TRACKER
          </span>

          <span className="admin-label">
            ADMIN CONSOLE
          </span>
        </div>

        <div className="admin-user-actions">
          <span>
            {user?.name || 'Administrator'}
          </span>

          <button
            type="button"
            onClick={onLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="admin-main">

        {/* HEADING */}

        <div className="admin-heading">
          <div>
            <p className="admin-eyebrow">
              OVERVIEW
            </p>

            <h1>
              Issue management
            </h1>

            <p>
              Review community reports and update
              their resolution status.
            </p>

            <p>
              Council:{' '}
              <strong>
                {user?.councilName || 'Not assigned'}
              </strong>
            </p>
          </div>

          <span className="admin-access-pill">
            Administrator access
          </span>
        </div>

        {/* ERROR */}

        {errorMessage && (
          <p className="admin-error">
            {errorMessage}
          </p>
        )}

        {/* STATISTICS */}

        <section
          className="admin-stats"
          aria-label="Issue summary"
        >
          <article>
            <span>
              Total reports
            </span>

            <strong>
              {counts.total}
            </strong>
          </article>

          <article>
            <span>
              Submitted
            </span>

            <strong>
              {counts.pending}
            </strong>
          </article>

          <article>
            <span>
              In progress
            </span>

            <strong>
              {counts.inProgress}
            </strong>
          </article>

          <article>
            <span>
              Resolved
            </span>

            <strong>
              {counts.resolved}
            </strong>
          </article>
        </section>

        {/* ISSUE TABLE */}

        <section className="admin-issues">

          <div className="admin-section-heading">
            <div>
              <h2>
                Community reports
              </h2>

              <p>
                Showing reports for{' '}
                {user?.councilName || 'your council'}.
              </p>
            </div>

            <span>
              {issues.length} reports
            </span>
          </div>

          {loading ? (
            <p>
              Loading issues...
            </p>
          ) : (
            <div className="admin-table-wrap">

              <table>
                <thead>
                  <tr>
                    <th>
                      Issue
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Council
                    </th>

                    <th>
                      Forwarded To
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {issues.length > 0 ? (
                    issues.map((issue) => (
                      <tr key={issue.id}>

                        {/* ISSUE */}

                        <td>
                          <strong>
                            {issue.title}
                          </strong>

                          <small>
                            #{issue.id} · {issue.description}
                          </small>
                        </td>

                        {/* CATEGORY */}

                        <td>
                          {issue.category}
                        </td>

                        {/* LOCATION */}

                        <td>
                          {issue.location}
                        </td>

                        {/* COUNCIL */}

                        <td>
                          {issue.councilName || 'Not assigned'}
                        </td>

                        {/* FORWARDED */}

                        <td>
                          {issue.forwardedTo || 'Not forwarded'}
                        </td>

                        {/* STATUS */}

                        <td>
                          <select
                            aria-label={`Status for ${issue.title}`}
                            value={issue.status}
                            onChange={(event) =>
                              handleStatusUpdate(
                                issue.id,
                                event.target.value
                              )
                            }
                          >
                            <option value="SUBMITTED">
                              Submitted
                            </option>

                            <option value="FORWARDED">
                              Forwarded
                            </option>

                            <option value="IN_PROGRESS">
                              In Progress
                            </option>

                            <option value="RESOLVED">
                              Resolved
                            </option>
                          </select>

                          <small>
                            {getStatusLabel(issue.status)}
                          </small>
                        </td>

                        {/* DELETE */}

                        <td>
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDelete(issue.id)
                            }
                          >
                            Delete
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">
                        No issues found for this municipal council.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>

            </div>
          )}

        </section>

      </main>
    </div>
  )
}

export default AdminDashboard