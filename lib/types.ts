/**
 * Contains all the Typescript types used in the Fastbreak Dashboard application.
 * @property id - Unique identifier (UUID) for the event.
 * @property user_id - ID for the user who created the event. (Forgein key to auth.users)
 * @property name - Display name of the event (eg. "Grass Volleyball Tournament")
 * @property sport_type - Type of Sport.. duh (eg. Volleyball, Soccer)
 * @property date_time - Date of the Event
 * @property description - Description of th Event.
 * @property created_at - When the event was created (database)
 * @property updated_at - When the event last modified (database)
 * @property venues - Optional Array of venues for the event.
 */
export interface Event {
    id: string
    user_id: string
    name: string
    sport_type: string
    date_time: string
    description: string | null  
    created_at: string
    updated_at: string
    venues?: Venue[]    // (plural)
}

/**
 * Venue Interface
 * Represents a venue where an event takes place and can have multiple venues.
 */
export interface Venue {
    id: string
    event_id: string
    name: string
    address: string | null // string or empty (optional)
    created_at: string
}

/**
 * CreateEventInput Interface
 * Data structure for creating a new event
 * Expectation from the vent creation form.
 */
export interface CreateEventInput {
    name: string
    sport_type: string
    date_time: string
    description?: string // optional
    venues: Array< {
        name: string
        address?: string    // optional
    }>
}
/**
 * Update Event extends from Create Event and require ID.
 */
export interface UpdateEventInput extends CreateEventInput {
    id: string
}

/**
 * @example
 * const result: ActionResponse<Event> = await createEvent(data)
 * if (result.success) {
 *   console.log(result.data) // TypeScript knows 'data' exists
 * } else {
 *   console.log(result.error) // TypeScript knows 'error' exists
 * }
 */
export type ActionResponse<T = void> = 
    | { success: true; data: T}
    | { success: false; error: string}