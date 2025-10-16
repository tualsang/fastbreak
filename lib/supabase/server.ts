/**
 * Creates a Supbase Client for use in Server Components and Server Actions.
 * 
 * Feature:
 * - Works with Next.js App Router for SERVER-SIDE rendering
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies() // Get the Next.js cookies store

    return createServerClient(      // Create and return a Supbase client with server-side cooking handling
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {      // Reads all cookies from the request allowing Supbase to read the autentication session.
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {      // Writes cookies back to the response, updating the autentication session cookies.
                    try {
                        cookiesToSet.forEach(({name, value, options}) =>
                            cookieStore.set(name, value, options)
                        )
                } catch {
                        // 'SetAll' method was called from Server Component.
                        // ignored because middlware is refreshing user sessions.
                    }
                },
            },
        }
    )
}