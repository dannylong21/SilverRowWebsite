const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { token } = JSON.parse(event.body)

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )

    // Sign out user
    const { error } = await supabase.auth.signOut(token)

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message })
    }
  }
}
