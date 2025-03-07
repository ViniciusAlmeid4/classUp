import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const token = req.cookies.get('authToken')?.value;

    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);

    if (!token) {
        console.log('Não achou o token');
        return NextResponse.redirect(new URL('/login', req.url)); // Redirect to `/login` if no token
    }

    try {
        // node runtime não deixa o jose funcionars
        await jwtVerify(token, secretKey);
        return NextResponse.next(); // Proceed if token is valid
    } catch (error) {
        console.log(error);
        
        return NextResponse.redirect(new URL('/login', req.url)); // Redirect if token is invalid
    }
}

export const config = {
    matcher: [
        '/((?!api/auth|login|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
