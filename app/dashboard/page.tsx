/**
 * 1. Checks authentication
 * 2. Fetches events from database
 * 3. Handles search/filter via URL params
 * 4. Passes data to Client Component for rendering
 */

import { getEvents } from '@/app/actions/events'
import { DashboardClient } from '@/components/dashboard-client'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface PageProps {
  searchParams: Promise<{
    search?: string
    sport?: string
  }>
}
/**
 * This is an async Server Component that:
 * 1. Authenticates the user
 * 2. Extracts search/filter params from URL
 * 3. Fetches filtered events from database
 * 4. Renders error or passes data to client component
 * @param params.searchParams - URL query parameters
 * @returns JSX - Error UI or DashboardClient with data
 */
export default async function DashboardPage({ searchParams }: PageProps) {
  // Autenticate User
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated. Backup for Middleware
  if (!user) {
    redirect('/login')
  }

  // Extract URL parameters
  const params = await searchParams

  // Fetch Events
  const result = await getEvents(params.search, params.sport)

  // Handle Errors
  if (!result.success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error loading events</h1>
          <p className="text-muted-foreground">{result.error}</p>
        </div>
      </div>
    )
  }

  // Render Client Component
  return <DashboardClient initialEvents={result.data} user={user} />
}