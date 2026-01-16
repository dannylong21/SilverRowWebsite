// Handle login form submission
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  const email = document.getElementById('email-input').value
  const password = document.getElementById('password-input').value
  const errorDiv = document.getElementById('login-error')
  
  // Clear any previous errors
  errorDiv.classList.add('hidden')
  errorDiv.textContent = ''
  
  try {
    console.log('Attempting login for:', email)
    
    // Call Netlify function
    const result = await authService.login(email, password)
    
    console.log('Login result:', result)
    
    if (result.error) {
      errorDiv.textContent = result.error
      errorDiv.classList.remove('hidden')
      return
    }
    
    if (result.success) {
      // Save session
      authService.saveSession(result.session)
      
      // Hide error
      errorDiv.classList.add('hidden')
      
      // Close login popup
      document.getElementById('login-container').classList.add('hidden')
      
      // Redirect or update UI
      alert('Login successful!')
      // Optional: redirect to dashboard
      // window.location.href = '/dashboard.html'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorDiv.textContent = `Network error: ${error.message}`
    errorDiv.classList.remove('hidden')
  }
})

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
  const session = authService.getSession()
  if (session) {
    console.log('User is logged in:', session.user)
    // Update UI for logged-in user
  }
})
