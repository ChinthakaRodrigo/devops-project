const API_URL = 'http://localhost:8080/api/issues'

// CREATE
export const createIssue = async (issueData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(issueData),
  })

  if (!response.ok) {
    throw new Error('Failed to create issue')
  }

  return await response.text()
}

// READ ALL
export const getAllIssues = async () => {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Failed to load issues')
  }

  return await response.json()
}

// READ ONE
export const getIssueById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Failed to load issue')
  }

  return await response.json()
}

// UPDATE STATUS
export const updateIssueStatus = async (id, status, forwardedTo) => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
      forwardedTo,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to update issue')
  }

  return await response.text()
}

// DELETE
export const deleteIssue = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete issue')
  }

  return await response.text()
}

// READ ISSUES BY COUNCIL
export const getIssuesByCouncil = async (councilName) => {
  const response = await fetch(
    `${API_URL}/council/${encodeURIComponent(councilName)}`
  )

  if (!response.ok) {
    throw new Error('Failed to load council issues')
  }

  return await response.json()
}