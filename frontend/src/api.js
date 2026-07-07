const BASE_URL = '/api'

function getToken() {
  return localStorage.getItem('token') || ''
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Terjadi kesalahan')
  }

  return data
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getRuns: () => request('/runs'),
  createRun: (payload) => request('/runs', { method: 'POST', body: payload }),
  updateRun: (id, payload) => request(`/runs/${id}`, { method: 'PUT', body: payload }),
  deleteRun: (id) => request(`/runs/${id}`, { method: 'DELETE' }),
  getStats: () => request('/runs/stats'),
}
