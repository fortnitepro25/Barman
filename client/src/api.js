async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

export const api = {
  get: (path) => request(path),

  post: (path, body) => request(path, {
    method: 'POST',
    body: JSON.stringify(body)
  }),

  patch: (path, body) => request(path, {
    method: 'PATCH',
    body: JSON.stringify(body)
  }),

  delete: (path) => request(path, {
    method: 'DELETE'
  })
}