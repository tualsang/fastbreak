'use server' // indicate that it runs on server.

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * 1. Extract email and password from form data
 * 2. Call Supabase signUp with credentials
 * 3. Set up email redirect for confirmation
 * 4. Revalidate cache and redirect to dashboard on success
 * 5. Return error if signup fails
 * @param formData - Form data containing eamil and password.
 * @returns Error object if signup fails, otherwise redirects.
 * 
 * @example In a Client Component:
 * <form action={signUp}>
 *   <input name="email" />
 *   <input name="password" />
 *   <button type="submit">Sign Up</button>
 * </form>
 */
export async function signUp(formData: FormData) {
  const supabase = await createClient() // Create server-side Supabase client

  // extract credentials from data
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Attempt to create a new user account.
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

  revalidatePath('/', 'layout') // Clear all cached data to reflect new authentication state
  redirect('/dashboard')        // Redirect user to dashboard (they're now logged in)
}

/**
 * 1. Extract email and password from form data
 * 2. Call Supabase signInWithPassword
 * 3. Revalidate cache and redirect to dashboard on success
 * 4. Return error if login fails
 * 
 * @param formData - Form data containing email and password
 * @returns Error object if login fails, otherwise redirects
 */
export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Attempt to authenticate user
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * 1. Call Supabase signOut to clear session
 * 2. Revalidate cache to remove user data
 * 3. Redirect to login page
 * 
 * @returns Error object if logout fails, otherwise redirect
 */
export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut() // Clear the user's session

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout') // Clear all cached data
  redirect('/login')
}

// export async function signInWithGoogle() {
//   const supabase = await createClient()

//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//     options: {
        // After Google authenticates, redirect here to exchange code for session
//       redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
//     },
//   })

//   if (error) {
//     return { error: error.message }
//   }

    // Redirect user to Google's OAuth consent screen
//   if (data.url) {
//     redirect(data.url)
//   }
// }