import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChanged(callback)
}
