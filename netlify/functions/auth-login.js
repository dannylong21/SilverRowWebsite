const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    console.log('Auth login function called')
    console.log('Environment variables set:', !!process.env.SUPABASE_URL, !!process.env.SUPABASE_ANON_KEY)
    
    const { email, password } = JSON.parse(event.body)
    console.log('Login attempt for:', email)

    // Create Supabase client with environment variables (set in Netlify dashboard)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    console.log('Supabase response - error:', error, 'data:', data)

    if (error) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message })
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true,
        session: data.session,
        user: data.user 
      })
    }
  } catch (err) {
    console.error('Auth login error:', err)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message, stack: err.stack })
    }
  }
}
