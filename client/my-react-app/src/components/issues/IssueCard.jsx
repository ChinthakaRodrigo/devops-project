function IssueCard({ issue, onSelect }) {
  const statusClass = issue.status.toLowerCase().replace(/\s+/g, '-')

  return (
    <article className="issue-card" onClick={() => onSelect(issue)}>
      <div className="issue-topline">
        <span className="issue-tag">{issue.category}</span>
        <span className={`status-badge ${statusClass}`}>{issue.status}</span>
      </div>

      <h3>{issue.title}</h3>
      <p>{issue.description}</p>

      <div className="issue-meta">
        <span>📍 {issue.location}</span>
        <span>🕒 {issue.time}</span>
      </div>
    </article>
  )
}

export default IssueCard
