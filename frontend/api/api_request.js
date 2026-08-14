const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function handleJsonResponse(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    const err = new Error(`Request failed ${res.status} ${res.statusText}`)
    err.status = res.status
    err.body = txt
    throw err
  }
  return res.json()
}

export async function getUniversities() {
  const res = await fetch(`${API_URL}/api/universities`)
  return handleJsonResponse(res)
}

export async function getCareerTypes() {
  const res = await fetch(`${API_URL}/api/career_types`)
  return handleJsonResponse(res)
}

export async function getCareerGuidance(body) {
  const res = await fetch(`${API_URL}/api/career-guidance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handleJsonResponse(res)
}

export async function getSimulacion(body) {
  const res = await fetch(`${API_URL}/api/simulaciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handleJsonResponse(res)
}