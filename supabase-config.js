// Fetch Supabase config from Netlify Function
// This reads from Netlify environment variables

(async () => {
  try {
    const response = await fetch('/.netlify/functions/get-supabase-config')
    const config = await response.json()
    
    window.SUPABASE_URL = config.url
    window.SUPABASE_ANON_KEY = config.anonKey
    
    console.log('Supabase config loaded from Netlify Function')
    
    // Dispatch event so other scripts know config is ready
    window.dispatchEvent(new CustomEvent('supabase-config-loaded', { detail: config }))
  } catch (error) {
    console.error('Failed to load Supabase config:', error)
  }
})()
