/**
 * Middle Ware for Route Protection
 * 1. Refresh Supabase autentication
 * 2. Protect routes that require autentication
 * 3. Redirect unautenticated users to login
 * 4. Redirect autenticated users away from auth pages
 **/

console.log('URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
console.log('Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length)

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 1. Create a Supabase client with request/response cookie handling
 * 2. Attempt to get the current user's session
 * 3. Check if the route requires authentication
 * 4. Redirect if necessary based on auth status
 * 
 * @param request - The incoming Next.js request object
 * @returns NextResponse - Modified response with proper redirects/cookies
 */
export async function middleware(request: NextRequest) {
  // Response Object to return.
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if needed ensuring user stay logged in across requests.
  const {
    data: { user },
  } = await supabase.auth.getUser()

 /**
  * If user is NOT authenticated and tries to access protected routes,
  * redirect them to the login page
  */
  if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || 
                request.nextUrl.pathname.startsWith('/events'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

 /**
  * If user IS authenticated and tries to access login/signup pages,
  * redirect them to the dashboard preventing authenticated users from seeing login pages.
  */
  if (user && (request.nextUrl.pathname === '/login' || 
               request.nextUrl.pathname === '/signup' ||
               request.nextUrl.pathname === '/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse // return with updated Cookies.
}

// This was suggested by AI, this matcher excludes image files, static files, so it runs faster.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}