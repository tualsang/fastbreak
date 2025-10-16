/**
 * Create a Supabase client for use in Client Components
 * with NO direct Supabase client calls from client components
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * @example
 * In a Client Component:
 * 'use client'
 * import { createClient } from '@/lib/supabase/client'
 * 
 * const supabase = createClient()
 * const { data } = await supabase.auth.getUser()
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPBASE_ANON_KEY!
    )
}