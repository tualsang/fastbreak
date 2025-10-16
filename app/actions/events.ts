/**
 * All CRUD operations for events.
 * These are Server Actions that interact directly with the Supabase database.
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResponse, CreateEventInput, Event, UpdateEventInput } from '@/lib/types'

/**
 * Generic action wrapper for consistent error handling
 */
async function handleAction<T>(
    action: () => Promise<T>
): Promise<ActionResponse<T>> {
    try {
        const data = await action() // Execute the action and wrap result in success response
        return {success: true, data}
    } catch (error) {
        console.error('Action error:', error) // Log error for debugging
        return { // Return formatted error response
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        }
    }
}

/**
 * Get all events with their venues
 * 1. Queries the events table
 * 2. Includes associated venues (JOIN operation)
 * 3. Applies search filter if provided
 * 4. Applies sport type filter if provided
 * 5. Orders results by date
 * 
 * @param searchQuery - Optional: Filter by event name (case-insensitive)
 * @param sportFilter - Optional: Filter by sport type (exact match)
 * @returns Promise<ActionResponse<Event[]>> - Array of events or error
 */
export async function getEvents(searchQuery?: string, sportFilter?: string): Promise<ActionResponse<Event[]>> {
    return handleAction(async () => {
        const supbase = await createClient()

        let query = supbase
        .from('events')
        .select(
            `*, venues (*)`
        )
        .order('date_time', {ascending: true})

        // Apply search filter
        if (searchQuery) {
            query = query.ilike('name', `%${searchQuery}%`)
        }

        // Apply sport type filter{
        if (sportFilter && sportFilter !== 'all') {
            query = query.eq('sport_type', sportFilter)
        }

        const { data, error} = await query

        if (error) throw new Error(error.message)
        return data as Event[]
    })
}

/**
* Get a single event by ID
 * - Loading event details for editing
 * - Displaying event information
 * 
 * @param id - UUID of the event to fetch
 * @returns Promise<ActionResponse<Event>> - Single event or error
*/
export async function getEventById(id: string): Promise<ActionResponse<Event>> {
    return handleAction(async () => {
        const supabase = await createClient()

        const { data, error } = await supabase
        .from('events')
        .select(`*, venues (*)`).eq('id', id).single()


        if (error) throw new Error(error.message)
        return data as Event
    })
}

/**
 * Create a new event with venues
 * 1. Get authenticated user ID
 * 2. Create event record
 * 3. Create venue records linked to event
 * 4. Revalidate dashboard cache
 * 
 * If any step fails, Supabase RLS will prevent partial creation
 * 
 * @param input - Event data including venues array
 * @returns Promise<ActionResponse<Event>> - Created event or error
 */
export async function createEvent(input: CreateEventInput): Promise<ActionResponse<Event>> {
  return handleAction(async () => {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Create event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        name: input.name,
        sport_type: input.sport_type,
        date_time: input.date_time,
        description: input.description || null,
      })
      .select()
      .single()

    if (eventError) throw new Error(eventError.message)

    // Create venues
    if (input.venues.length > 0) {
      const venuesData = input.venues.map(venue => ({
        event_id: event.id,
        name: venue.name,
        address: venue.address || null,
      }))

      const { error: venuesError } = await supabase
        .from('venues')
        .insert(venuesData)

      if (venuesError) throw new Error(venuesError.message)
    }

    // Revalidate dashboard
    revalidatePath('/dashboard')

    return event as Event
  })
}

/**
 * Update an existing event and its venues
 * 1. Update event record
 * 2. Delete all existing venues for this event
 * 3. Create new venue records
 * 4. Revalidate dashboard cache
 * 
 * @param input - Updated event data (must include id)
 * @returns Promise<ActionResponse<Event>> - Updated event or error
 */
export async function updateEvent(input: UpdateEventInput): Promise<ActionResponse<Event>> {
  return handleAction(async () => {
    const supabase = await createClient()

    // Update event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .update({
        name: input.name,
        sport_type: input.sport_type,
        date_time: input.date_time,
        description: input.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.id)
      .select()
      .single()

    if (eventError) throw new Error(eventError.message)

    // Delete existing venues
    const { error: deleteError } = await supabase
      .from('venues')
      .delete()
      .eq('event_id', input.id)

    if (deleteError) throw new Error(deleteError.message)

    // Create new venues
    if (input.venues.length > 0) {
      const venuesData = input.venues.map(venue => ({
        event_id: event.id,
        name: venue.name,
        address: venue.address || null,
      }))

      const { error: venuesError } = await supabase
        .from('venues')
        .insert(venuesData)

      if (venuesError) throw new Error(venuesError.message)
    }

    // Revalidate dashboard
    revalidatePath('/dashboard')

    return event as Event
  })
}

/**
 * Database Configuration:
 * The venues table has ON DELETE CASCADE foreign key constraint,
 * so when an event is deleted, all its venues are automatically deleted
 * 
 * @param id - UUID of event to delete
 * @returns Promise<ActionResponse> - Success/error response
 */
export async function deleteEvent(id: string): Promise<ActionResponse> {
  return handleAction(async () => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)

    // Revalidate dashboard
    revalidatePath('/dashboard')
  })
}
