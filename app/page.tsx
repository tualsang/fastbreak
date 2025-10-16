/**
 * This is the landing page at "/" route.
 * It acts as a router based on authentication status:
 * - Authenticated users → Redirect to /dashboard
 * - Unauthenticated users → Redirect to /login
 */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * 1. Create Supabase client (server-side)
 * 2. Check if user is authenticated
 * 3. Redirect based on auth status
 */
export default async function HomePage() {
  const supabase = await createClient()
  // Check authentication status
  // getUser() returns null if not authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}