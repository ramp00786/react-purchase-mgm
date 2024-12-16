import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {

    const path = request.nextUrl.pathname;

    const isPublicPath = path === "/login" || path === "/register" || path === "/";

    const token = request.cookies.get('auth_token')?.value;

    if(isPublicPath && token ){
        return NextResponse.redirect(new URL('/papers', request.url))
    }

    if(!isPublicPath && !token ){
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/papers/submit',
    '/papers',
    '/login',
    '/register'
],
}