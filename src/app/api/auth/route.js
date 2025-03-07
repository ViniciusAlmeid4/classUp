export const runtime = 'nodejs'; // Switch to Node.js runtime

import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';
// import { serialize } from 'cookie';

// Dummy user data (Replace with a real database query)
const users = [
    {
        id: 1,
        username: 'testeuser',
        password: '$2b$10$BYL0c1f1sse7Yl8HopY/iuWTl8GvHhBm6jvoeoqQUn8cs7wUv4EGO',
    },
];

const saltRounds = 10;

export async function POST(req, res) {
    let { username, password } = await req.json();

    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);

    // Find user in database
    const user = users.find((u) => u.username === username);
    if (!user) {
        return NextResponse.json(
            { message: 'Invalid credentials '},
            { status: 401 }
        );
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return NextResponse.json(
            { message: 'Invalid credentials '},
            { status: 401 }
        );
    }

    // Generate jose
    const token = await new SignJWT({ username: 'testuser' })
        .setProtectedHeader({ alg: 'HS256' }) // Set the algorithm in the protected header
        .setExpirationTime('1h')
        .sign(secretKey);

    // Create JSON response and set cookie
    const response = NextResponse.json({ message: 'Login successful', redirectTo: '/home' });

    response.cookies.set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        sameSite: 'strict',
    });

    return response;
}
