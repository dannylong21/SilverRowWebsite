// Client-side auth helper for Netlify Functions
const authService = {
  async login(email, password) {
    try {
      const response = await fetch('/.netlify/functions/auth-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers.get('content-type'))
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Response text:', text)
        throw new Error('Server returned non-JSON response. Make sure you are accessing via http://localhost:8000')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
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
