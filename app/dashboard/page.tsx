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

export default async function DashboardPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const result = await getEvents(params.search, params.sport)

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

  return <DashboardClient initialEvents={result.data} user={user} />
}