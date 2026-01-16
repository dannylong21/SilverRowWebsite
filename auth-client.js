// Client-side auth helper for Netlify Functions
const authService = {
  async login(email, password) {
    const response = await fetch('/.netlify/functions/auth-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return await response.json()
  },

  async logout(token) {
    const response = await fetch('/.netlify/functions/auth-logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    return await response.json()
  },

  saveSession(session) {
    localStorage.setItem('session', JSON.stringify(session))
  },

  getSession() {
    const session = localStorage.getItem('session')
    return session ? JSON.parse(session) : null
  },

  clearSession() {
    localStorage.removeItem('session')
  }
}
