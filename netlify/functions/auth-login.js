const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { email, password } = JSON.parse(event.body)

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

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        session: data.session,
        user: data.user 
      })
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message })
    }
  }
}
