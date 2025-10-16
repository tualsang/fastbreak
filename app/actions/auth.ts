/**
 * Authentication Server Actions
 * 
 * This file contains all server-side authentication operations.
 * Server Actions run on the server and can be called from Client Components.
 * 
 * Benefits of Server Actions:
 * - Automatic POST request handling
 * - Type-safe by default
 * - No need to create API routes
 * - Progressive enhancement support
 * 
 * All functions in this file are marked with 'use server' to indicate
 * they run on the server, not in the browser.
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Sign Up Action
 * Creates a new user account with email and password
 * 
 * Flow:
 * 1. Extract email and password from form data
 * 2. Call Supabase signUp with credentials
 * 3. Set up email redirect for confirmation
 * 4. Revalidate cache and redirect to dashboard on success
 * 5. Return error if signup fails
 * 
 * @param formData - Form data containing email and password
 * @returns Error object if signup fails, otherwise redirects
 * 
 * @example
 * // In a Client Component:
 * <form action={signUp}>
 *   <input name="email" />
 *   <input name="password" />
 *   <button type="submit">Sign Up</button>
 * </form>
 */
export async function signUp(formData: FormData) {
  // Create a server-side Supabase client
  const supabase = await createClient()

  // Extract credentials from form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Attempt to create new user account
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // After email confirmation, redirect user to this URL
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  // If signup failed, return error to display to user
  if (error) {
    return { error: error.message }
  }

  // Clear all cached data to reflect new authentication state
  revalidatePath('/', 'layout')
  
  // Redirect user to dashboard (they're now logged in)
  redirect('/dashboard')
}

/**
 * Sign In Action
 * Authenticates an existing user with email and password
 * 
 * Flow:
 * 1. Extract email and password from form data
 * 2. Call Supabase signInWithPassword
 * 3. Revalidate cache and redirect to dashboard on success
 * 4. Return error if login fails
 * 
 * @param formData - Form data containing email and password
 * @returns Error object if login fails, otherwise redirects
 * 
 * Security Note:
 * - Password is never exposed to the client
 * - Authentication happens entirely on the server
 * - Session cookies are httpOnly and secure
 */
export async function signIn(formData: FormData) {
  const supabase = await createClient()

  // Extract credentials from form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Attempt to authenticate user
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // If authentication failed, return error
  if (error) {
    return { error: error.message }
  }

  // Clear all cached data to reflect new authentication state
  revalidatePath('/', 'layout')
  
  // Redirect authenticated user to dashboard
  redirect('/dashboard')
}

/**
 * Sign Out Action
 * Logs out the current user and clears their session
 * 
 * Flow:
 * 1. Call Supabase signOut to clear session
 * 2. Revalidate cache to remove user data
 * 3. Redirect to login page
 * 
 * @returns Error object if logout fails, otherwise redirects
 * 
 * Security Note:
 * - Clears all session cookies
 * - Invalidates refresh tokens
 * - User must re-authenticate to access protected routes
 */
export async function signOut() {
  const supabase = await createClient()

  // Clear the user's session
  const { error } = await supabase.auth.signOut()

  // If logout failed, return error
  if (error) {
    return { error: error.message }
  }

  // Clear all cached data
  revalidatePath('/', 'layout')
  
  // Redirect to login page
  redirect('/login')
}

// Uncomment to enable Google OAuth
/**
 * Google OAuth Sign In Action
 * Initiates Google OAuth authentication flow
 * 
 * Flow:
 * 1. Request OAuth URL from Supabase
 * 2. Supabase generates authorization URL with Google
 * 3. User is redirected to Google login
 * 4. After authentication, Google redirects to our callback URL
 * 5. Callback handler exchanges code for session
 * 
 * @returns Error object if OAuth init fails, otherwise redirects to Google
 * 
 * Setup Required:
 * 1. Enable Google provider in Supabase dashboard
 * 2. Configure OAuth credentials in Google Cloud Console
 * 3. Add authorized redirect URI: https://your-project.supabase.co/auth/v1/callback
 * 
 * Note: The redirect URL must match what's configured in Supabase
 */
// export async function signInWithGoogle() {
//   const supabase = await createClient()

//   // Request OAuth URL from Supabase
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//     options: {
//       // After Google authenticates, redirect here to exchange code for session
//       redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
//     },
//   })

//   // If OAuth initialization failed, return error
//   if (error) {
//     return { error: error.message }
//   }

//   // Redirect user to Google's OAuth consent screen
//   if (data.url) {
//     redirect(data.url)
//   }
// }