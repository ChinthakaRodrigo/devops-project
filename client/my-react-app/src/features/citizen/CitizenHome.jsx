import { useMemo, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import IssueCard from '../../components/issues/IssueCard'
import { issueSeed } from '../../services/issuesService'
import './citizen.css'

const categories = ['All Issues', 'Electricity', 'Road', 'Garbage', 'Water', 'Other']

function CitizenHome({ user, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState('All Issues')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeView, setActiveView] = useState('browse')
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formState, setFormState] = useState({
    title: '',
    category: 'Electricity',
    location: '',
    description: '',
  })

  const filteredIssues = useMemo(() => {
    return issueSeed.filter((issue) => {
      const matchesCategory =
        selectedCategory === 'All Issues' || issue.category === selectedCategory
      const matchesSearch =
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.location.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  const handleReportNow = () => {
    setActiveView('report')
    setIsSubmitted(false)
  }

  return (
    <div className="citizen-app">
      <Navbar userName={user?.name?.split(' ')[0] || 'Citizen'} onLogout={onLogout} />

      <main className="citizen-main">
        <section className="hero-panel">
          <div className="hero-copy">
            <div className="brand-pill dark-pill">COMMUNITY ISSUE TRACKER</div>
            <h1>Build a better community</h1>
            <p>
              Report problems, track repair statuses, and keep local infrastructure
              projects transparent.
            </p>

            <div className="status-row">
              <span className="status-pill pending">14 Pending</span>
              <span className="status-pill progress">8 In Progress</span>
              <span className="status-pill resolved">42 Resolved</span>
            </div>
          </div>

          <div className="hero-card">
            <div className="switch-panel">
              <button
                type="button"
                className={activeView === 'browse' ? 'switch-btn active' : 'switch-btn'}
                onClick={() => setActiveView('browse')}
              >
                Browse Issues
              </button>
              <button
                type="button"
                className={activeView === 'report' ? 'switch-btn active' : 'switch-btn'}
                onClick={handleReportNow}
              >
                Report Now
              </button>
            </div>

            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by area, issue, or title..."
                aria-label="Search issues"
              />
            </div>

            <div className="filter-row">
              <label htmlFor="category-filter">Filter</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {activeView === 'browse' ? (
          <section id="issues" className="issue-section">
            <div className="category-pills" aria-label="Issue categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={selectedCategory === category ? 'category-pill active' : 'category-pill'}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="issue-grid">
              {filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onSelect={setSelectedIssue} />
              ))}
            </div>
          </section>
        ) : (
          <section className="report-section">
            {!isSubmitted ? (
              <form className="report-form" onSubmit={handleSubmit}>
                <h2>Submit a Community Issue</h2>
                <p>Provide details so municipal teams can respond.</p>

                <label>
                  <span>Issue Title *</span>
                  <input
                    type="text"
                    name="title"
                    value={formState.title}
                    onChange={handleInputChange}
                    placeholder="Street light not working"
                    required
                  />
                </label>

                <label>
                  <span>Category *</span>
                  <select
                    name="category"
                    value={formState.category}
                    onChange={handleInputChange}
                  >
                    {categories
                      .filter((category) => category !== 'All Issues')
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </label>

                <label>
                  <span>Location *</span>
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={handleInputChange}
                    placeholder="Negombo"
                    required
                  />
                </label>

                <label>
                  <span>Description</span>
                  <textarea
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Describe the issue in detail..."
                  />
                </label>

                <button type="submit" className="submit-button">
                  Submit Issue
                </button>
              </form>
            ) : (
              <div className="success-card">
                <div className="success-icon">✓</div>
                <h3>Issue Reported Successfully</h3>
                <p>
                  Your report has been logged under ID #109 with initial status
                  Pending.
                </p>
                <button type="button" className="view-feed-button" onClick={() => setActiveView('browse')}>
                  View Live Feed
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {selectedIssue && (
        <div className="modal-backdrop" onClick={() => setSelectedIssue(null)}>
          <div className="detail-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="issue-tag modal-tag">{selectedIssue.category}</span>
                <h3>{selectedIssue.title}</h3>
              </div>
              <button type="button" className="close-button" onClick={() => setSelectedIssue(null)}>
                Close
              </button>
            </div>

            <div className="modal-meta">
              <span>📍 {selectedIssue.location}</span>
              <span>🕒 {selectedIssue.time}</span>
            </div>

            <p className="modal-description">{selectedIssue.description}</p>

            <div className="timeline">
              <div className="timeline-step active">
                <span className="dot"></span>
                <div>
                  <strong>Reported</strong>
                  <small>Pending review</small>
                </div>
              </div>
              <div className="timeline-step">
                <span className="dot"></span>
                <div>
                  <strong>In Progress</strong>
                  <small>Field crew assigned</small>
                </div>
              </div>
              <div className="timeline-step">
                <span className="dot"></span>
                <div>
                  <strong>Resolved</strong>
                  <small>Completed</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CitizenHome
