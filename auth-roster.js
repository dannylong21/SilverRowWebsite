// Connect roster to authentication system
// Checks if user is authenticated and provides session data to roster

const rosterAuth = {
  session: null,
  supabaseUrl: null,
  supabaseKey: null,

  init: async function() {
    // Get existing session from localStorage (set by auth-handler.js)
    this.session = authService.getSession()
    
    if (!this.session) {
      console.log('No active session. User must log in to view roster.')
      this.hideRoster('Please sign in to view the roster.')
      return false
    }

    // Get Supabase credentials from environment or data attributes
    this.supabaseUrl = window.SUPABASE_URL || document.getElementById('roster-table')?.dataset.supabaseUrl
    this.supabaseKey = window.SUPABASE_ANON_KEY || document.getElementById('roster-table')?.dataset.supabaseKey

    if (!this.supabaseUrl || !this.supabaseKey) {
      console.warn('Supabase credentials not found. Set window.SUPABASE_URL and window.SUPABASE_ANON_KEY or data attributes on #roster-table')
      this.hideRoster('Supabase configuration missing.')
      return false
    }

    // Pass session and credentials to roster
    this.connectRosterToAuth()
    return true
  },

  connectRosterToAuth: function() {
    const rosterEl = document.getElementById('roster-table')
    if (!rosterEl) return

    // Set Supabase credentials on the roster element
    rosterEl.dataset.supabaseUrl = this.supabaseUrl
    rosterEl.dataset.supabaseKey = this.supabaseKey

    // Add user info to status (optional)
    const statusEl = document.getElementById('roster-status')
    if (statusEl && this.session?.user) {
      statusEl.textContent = `Logged in as ${this.session.user.email} • Loading...`
    }

    // Dispatch event to notify roster that auth is ready
    const event = new CustomEvent('roster-auth-ready', {
      detail: { session: this.session, supabaseUrl: this.supabaseUrl, supabaseKey: this.supabaseKey }
    })
    rosterEl.dispatchEvent(event)

    console.log('Roster connected to authenticated session')
  },

  hideRoster: function(message) {
    const rosterEl = document.getElementById('roster-table')
    if (!rosterEl) return

    rosterEl.innerHTML = `
      <div class="p-6 bg-white/90 border border-gray-200 rounded-xl shadow-lg">
        <p class="text-gray-700 text-center">${message}</p>
      </div>
    `
  },

  // Helper to check if user is still authenticated
  isAuthenticated: function() {
    return !!this.session && !!this.session.user
  },

  // Helper to get the access token (useful for authenticated requests)
  getAccessToken: function() {
    return this.session?.access_token || null
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  rosterAuth.init()
})

// Also check when auth state changes
window.addEventListener('storage', (e) => {
  if (e.key === 'session') {
    rosterAuth.init()
  }
})
