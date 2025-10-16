'use client'

import { useState, useTransition } from 'react'
import { Event } from '@/lib/types'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signOut } from '@/app/actions/auth'
import { deleteEvent } from '@/app/actions/events'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import Link from 'next/link'
import { Pencil, Trash2, MapPin, Calendar, Trophy, Plus, Search, LogOut } from 'lucide-react'

interface DashboardClientProps {
  initialEvents: Event[]
  user: User
}

const SPORT_TYPES = ['Basketball', 'Soccer', 'Tennis', 'Baseball', 'Football', 'Volleyball', 'Hockey']

export function DashboardClient({ initialEvents, user }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sportFilter, setSportFilter] = useState('all')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (sportFilter !== 'all') params.set('sport', sportFilter)
      router.push(`/dashboard?${params.toString()}`)
    })
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    const result = await deleteEvent(id)
    
    if (result.success) {
      toast.success('Success', {
        description: 'Event deleted successfully',
      })
      router.refresh()
    } else {
      toast.error('Error', {
        description: result.error,
      })
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Fastbreak Dashboard</h1>
            <p className="text-sm text-slate-600">Welcome back, {user.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              <Search className="mb-1 inline h-4 w-4" /> Search Events
            </label>
            <Input
              type="text"
              placeholder="Search by event name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full"
            />
          </div>
          
          <div className="w-full md:w-48">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              <Trophy className="mb-1 inline h-4 w-4" /> Filter by Sport
            </label>
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {SPORT_TYPES.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSearch} disabled={isPending}>
            {isPending ? 'Searching...' : 'Search'}
          </Button>

          <Link href="/events/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Events Grid */}
        {initialEvents.length === 0 ? (
          <Card className="p-12 text-center">
            <CardContent>
              <Trophy className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h3 className="mb-2 text-lg font-semibold">No events found</h3>
              <p className="mb-4 text-muted-foreground">
                {searchQuery || sportFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first event'}
              </p>
              <Link href="/events/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {initialEvents.map((event) => (
              <Card key={event.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{event.name}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {event.sport_type}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.date_time), 'PPP p')}</span>
                  </div>

                  {event.description && (
                    <p className="line-clamp-2 text-sm text-slate-600">
                      {event.description}
                    </p>
                  )}

                  {event.venues && event.venues.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <MapPin className="h-4 w-4" />
                        Venues ({event.venues.length})
                      </div>
                      <div className="space-y-1 pl-6">
                        {event.venues.slice(0, 2).map((venue) => (
                          <div key={venue.id} className="text-sm text-slate-600">
                            {venue.name}
                            {venue.address && (
                              <span className="text-slate-400"> • {venue.address}</span>
                            )}
                          </div>
                        ))}
                        {event.venues.length > 2 && (
                          <div className="text-sm text-slate-400">
                            +{event.venues.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Link href={`/events/edit/${event.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(event.id, event.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}