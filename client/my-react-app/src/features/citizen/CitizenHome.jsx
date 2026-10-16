import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import IssueCard from '../../components/issues/IssueCard'

import {
  createIssue,
  getAllIssues,
} from '../../services/issuesService'

import './citizen.css'


const categories = [
  'All Issues',
  'Electricity',
  'Road',
  'Garbage',
  'Water',
  'Other',
]

const councils = [
  'Negombo Municipal Council',
  'Colombo Municipal Council',
  'Kandy Municipal Council',
  'Galle Municipal Council',
]


function CitizenHome({ user, onLogout }) {

  const [issues, setIssues] = useState([])

  const [selectedCategory, setSelectedCategory] =
    useState('All Issues')

  const [searchTerm, setSearchTerm] =
    useState('')

  const [activeView, setActiveView] =
    useState('browse')

  const [selectedIssue, setSelectedIssue] =
    useState(null)

  const [isSubmitted, setIsSubmitted] =
    useState(false)

  const [errorMessage, setErrorMessage] =
    useState('')

  const [formState, setFormState] =
    useState({
      title: '',
      category: 'Electricity',
      location: '',
      description: '',
      councilName: 'Negombo Municipal Council',
    })


  // --------------------------------------------------
  // LOAD ISSUES FROM BACKEND
  // --------------------------------------------------

  useEffect(() => {

    const loadIssues = async () => {

      try {

        const data = await getAllIssues()

        setIssues(data)

      } catch (error) {

        console.error(
          'Failed to load issues:',
          error
        )

      }
    }

    loadIssues()

  }, [])


  // --------------------------------------------------
  // SEARCH + FILTER
  // --------------------------------------------------

  const filteredIssues = useMemo(() => {

    return issues.filter((issue) => {

      const matchesCategory =
        selectedCategory === 'All Issues' ||
        issue.category === selectedCategory

      const title =
        issue.title?.toLowerCase() || ''

      const location =
        issue.location?.toLowerCase() || ''

      const search =
        searchTerm.toLowerCase()

      const matchesSearch =
        title.includes(search) ||
        location.includes(search)

      return (
        matchesCategory &&
        matchesSearch
      )

    })

  }, [
    issues,
    selectedCategory,
    searchTerm,
  ])


  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  const handleInputChange = (event) => {

    const { name, value } =
      event.target

    setFormState((previous) => ({
      ...previous,
      [name]: value,
    }))

  }


  // --------------------------------------------------
  // SUBMIT ISSUE
  // --------------------------------------------------

  const handleSubmit = async (event) => {

    event.preventDefault()

    setErrorMessage('')

    try {

      const issueData = {

        title:
          formState.title,

        description:
          formState.description,

        category:
          formState.category,

        location:
          formState.location,

        citizenId:
          user.id,

        councilName:
          formState.councilName,
      }


      await createIssue(issueData)


      setIsSubmitted(true)


      // Load updated issue list
      const updatedIssues =
        await getAllIssues()

      setIssues(updatedIssues)


      // Clear form
      setFormState({

        title: '',

        category:
          'Electricity',

        location: '',

        description: '',

        councilName:
          'Negombo Municipal Council',
      })

    } catch (error) {

      console.error(
        'Failed to submit issue:',
        error
      )

      setErrorMessage(
        'Unable to submit issue. Please try again.'
      )

    }
  }


  // --------------------------------------------------
  // OPEN REPORT PAGE
  // --------------------------------------------------

  const handleReportNow = () => {

    setActiveView('report')

    setIsSubmitted(false)

    setErrorMessage('')
  }


  // --------------------------------------------------
  // ISSUE COUNTS
  // --------------------------------------------------

  const pendingCount =
    issues.filter(
      (issue) =>
        issue.status === 'SUBMITTED'
    ).length


  const progressCount =
    issues.filter(
      (issue) =>
        issue.status === 'FORWARDED' ||
        issue.status === 'IN_PROGRESS'
    ).length


  const resolvedCount =
    issues.filter(
      (issue) =>
        issue.status === 'RESOLVED'
    ).length


  return (

    <div className="citizen-app">


      {/* NAVBAR */}

      <Navbar

        userName={
          user?.name?.split(' ')[0] ||
          'Citizen'
        }

        onLogout={onLogout}

      />


      <main className="citizen-main">


        {/* HERO */}

        <section className="hero-panel">


          <div className="hero-copy">

            <div className="brand-pill dark-pill">
              COMMUNITY ISSUE TRACKER
            </div>

            <h1>
              Build a better community
            </h1>

            <p>
              Report problems, track repair statuses,
              and keep local infrastructure projects
              transparent.
            </p>


            <div className="status-row">

              <span className="status-pill pending">

                {pendingCount} Pending

              </span>


              <span className="status-pill progress">

                {progressCount} In Progress

              </span>


              <span className="status-pill resolved">

                {resolvedCount} Resolved

              </span>

            </div>

          </div>



          {/* CONTROLS */}

          <div className="hero-card">


            <div className="switch-panel">

              <button

                type="button"

                className={
                  activeView === 'browse'
                    ? 'switch-btn active'
                    : 'switch-btn'
                }

                onClick={() =>
                  setActiveView('browse')
                }

              >
                Browse Issues
              </button>


              <button

                type="button"

                className={
                  activeView === 'report'
                    ? 'switch-btn active'
                    : 'switch-btn'
                }

                onClick={handleReportNow}

              >
                Report Now
              </button>

            </div>



            {/* SEARCH */}

            <div className="search-box">

              <span className="search-icon">
                🔍
              </span>

              <input

                type="text"

                value={searchTerm}

                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }

                placeholder="Search by area, issue, or title..."

                aria-label="Search issues"

              />

            </div>



            {/* FILTER */}

            <div className="filter-row">

              <label htmlFor="category-filter">
                Filter
              </label>

              <select

                id="category-filter"

                value={selectedCategory}

                onChange={(event) =>
                  setSelectedCategory(
                    event.target.value
                  )
                }

              >

                {categories.map(
                  (category) => (

                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>

                  )
                )}

              </select>

            </div>


          </div>

        </section>



        {/* ================================================== */}
        {/* BROWSE ISSUES */}
        {/* ================================================== */}

        {activeView === 'browse' ? (

          <section
            id="issues"
            className="issue-section"
          >


            {/* CATEGORY BUTTONS */}

            <div
              className="category-pills"
              aria-label="Issue categories"
            >

              {categories.map(
                (category) => (

                  <button

                    key={category}

                    type="button"

                    className={
                      selectedCategory === category
                        ? 'category-pill active'
                        : 'category-pill'
                    }

                    onClick={() =>
                      setSelectedCategory(category)
                    }

                  >
                    {category}
                  </button>

                )
              )}

            </div>



            {/* ISSUE CARDS */}

            <div className="issue-grid">

              {filteredIssues.length > 0 ? (

                filteredIssues.map(
                  (issue) => (

                    <IssueCard

                      key={issue.id}

                      issue={issue}

                      onSelect={
                        setSelectedIssue
                      }

                    />

                  )
                )

              ) : (

                <p>
                  No issues found.
                </p>

              )}

            </div>


          </section>

        ) : (


          /* ================================================== */
          /* REPORT FORM */
          /* ================================================== */

          <section className="report-section">


            {!isSubmitted ? (

              <form

                className="report-form"

                onSubmit={handleSubmit}

              >


                <h2>
                  Submit a Community Issue
                </h2>


                <p>
                  Provide details so municipal teams
                  can respond.
                </p>



                {/* ERROR */}

                {errorMessage && (

                  <p className="form-error">
                    {errorMessage}
                  </p>

                )}



                {/* TITLE */}

                <label>

                  <span>
                    Issue Title *
                  </span>

                  <input

                    type="text"

                    name="title"

                    value={
                      formState.title
                    }

                    onChange={
                      handleInputChange
                    }

                    placeholder="Street light not working"

                    required

                  />

                </label>



                {/* CATEGORY */}

                <label>

                  <span>
                    Category *
                  </span>

                  <select

                    name="category"

                    value={
                      formState.category
                    }

                    onChange={
                      handleInputChange
                    }

                  >

                    {categories
                      .filter(
                        (category) =>
                          category !== 'All Issues'
                      )
                      .map(
                        (category) => (

                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>

                        )
                      )}

                  </select>

                </label>



                {/* MUNICIPAL COUNCIL */}

                <label>

                  <span>
                    Municipal Council *
                  </span>

                  <select

                    name="councilName"

                    value={
                      formState.councilName
                    }

                    onChange={
                      handleInputChange
                    }

                    required

                  >

                    {councils.map(
                      (council) => (

                        <option
                          key={council}
                          value={council}
                        >
                          {council}
                        </option>

                      )
                    )}

                  </select>

                </label>



                {/* LOCATION */}

                <label>

                  <span>
                    Location *
                  </span>

                  <input

                    type="text"

                    name="location"

                    value={
                      formState.location
                    }

                    onChange={
                      handleInputChange
                    }

                    placeholder="Negombo"

                    required

                  />

                </label>



                {/* DESCRIPTION */}

                <label>

                  <span>
                    Description *
                  </span>

                  <textarea

                    name="description"

                    value={
                      formState.description
                    }

                    onChange={
                      handleInputChange
                    }

                    rows="5"

                    placeholder="Describe the issue in detail..."

                    required

                  />

                </label>



                {/* SUBMIT */}

                <button

                  type="submit"

                  className="submit-button"

                >
                  Submit Issue
                </button>


              </form>

            ) : (


              /* SUCCESS CARD */

              <div className="success-card">


                <div className="success-icon">
                  ✓
                </div>


                <h3>
                  Issue Reported Successfully
                </h3>


                <p>
                  Your issue has been submitted
                  successfully with initial status
                  SUBMITTED.
                </p>


                <button

                  type="button"

                  className="view-feed-button"

                  onClick={() =>
                    setActiveView('browse')
                  }

                >
                  View Live Feed
                </button>


              </div>

            )}

          </section>

        )}

      </main>



      {/* ================================================== */}
      {/* ISSUE DETAILS MODAL */}
      {/* ================================================== */}

      {selectedIssue && (

        <div

          className="modal-backdrop"

          onClick={() =>
            setSelectedIssue(null)
          }

        >


          <div

            className="detail-modal"

            onClick={(event) =>
              event.stopPropagation()
            }

          >


            <div className="modal-header">


              <div>

                <span className="issue-tag modal-tag">
                  {selectedIssue.category}
                </span>


                <h3>
                  {selectedIssue.title}
                </h3>

              </div>



              <button

                type="button"

                className="close-button"

                onClick={() =>
                  setSelectedIssue(null)
                }

              >
                Close
              </button>


            </div>



            <div className="modal-meta">


              <span>
                📍 {selectedIssue.location}
              </span>


              <span>
                Status: {selectedIssue.status}
              </span>


            </div>



            {/* COUNCIL */}

            <p>

              Municipal Council:{' '}

              <strong>

                {selectedIssue.councilName ||
                  'Not assigned'}

              </strong>

            </p>



            {/* DESCRIPTION */}

            <p className="modal-description">

              {selectedIssue.description}

            </p>



            {/* FORWARDED TO */}

            {selectedIssue.forwardedTo && (

              <p>

                Forwarded to:{' '}

                <strong>
                  {selectedIssue.forwardedTo}
                </strong>

              </p>

            )}



            {/* TIMELINE */}

            <div className="timeline">


              {/* SUBMITTED */}

              <div className="timeline-step active">

                <span className="dot"></span>

                <div>

                  <strong>
                    Submitted
                  </strong>

                  <small>
                    Issue reported
                  </small>

                </div>

              </div>



              {/* FORWARDED */}

              <div

                className={
                  selectedIssue.status === 'FORWARDED' ||
                  selectedIssue.status === 'IN_PROGRESS' ||
                  selectedIssue.status === 'RESOLVED'
                    ? 'timeline-step active'
                    : 'timeline-step'
                }

              >

                <span className="dot"></span>

                <div>

                  <strong>
                    Forwarded
                  </strong>

                  <small>
                    Sent to relevant authority
                  </small>

                </div>

              </div>



              {/* IN PROGRESS */}

              <div

                className={
                  selectedIssue.status === 'IN_PROGRESS' ||
                  selectedIssue.status === 'RESOLVED'
                    ? 'timeline-step active'
                    : 'timeline-step'
                }

              >

                <span className="dot"></span>

                <div>

                  <strong>
                    In Progress
                  </strong>

                  <small>
                    Work underway
                  </small>

                </div>

              </div>



              {/* RESOLVED */}

              <div

                className={
                  selectedIssue.status === 'RESOLVED'
                    ? 'timeline-step active'
                    : 'timeline-step'
                }

              >

                <span className="dot"></span>

                <div>

                  <strong>
                    Resolved
                  </strong>

                  <small>
                    Issue completed
                  </small>

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