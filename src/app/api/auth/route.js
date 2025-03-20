export const runtime = 'nodejs'; // Switch to Node.js runtime

import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';

// Dummy user data
// User types: professor, admin, representative and student
const users = [
    {
        id: 1,
        email: 'testeuser',
        password: '$2b$10$BYL0c1f1sse7Yl8HopY/iuWTl8GvHhBm6jvoeoqQUn8cs7wUv4EGO', // teste
        userType: 'admin'
    },
];

const saltRounds = 10;

export async function POST(req, res) {
    let { email, password } = await req.json();

    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);

    // Find user in database
    const user = users.find((u) => u.email === email);
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
    const token = await new SignJWT({ email: user.email, userType: user.userType })
        .setProtectedHeader({ alg: 'HS256' }) // Set the algorithm in the protected header
        .setExpirationTime('1h')
        .sign(secretKey);

    // Create JSON response and set cookie
    const response = NextResponse.json({ message: 'Login successful', redirectTo: '/home' });

    response.cookies.set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1h
        path: '/',
        sameSite: 'strict',
    });

    return response;
}
