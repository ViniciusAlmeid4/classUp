export const runtime = 'nodejs'; // Switch to Node.js runtime

import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';
import { db } from '@/models/db';

export async function POST(req) {
    let { email, password } = await req.json();
    let user;

    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        const userDb = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // TODO: correct error sending pattern
        
        if (userDb.length == 1) {
            user = userDb[0];
            if (!(await bcrypt.compare(password, user.password))) {
                return NextResponse.json({ error: 'Wrong password.' }, { status: 400 });
            } else if (user.status == 'awaiting') {
                return NextResponse.json(
                    { error: 'Almost there, wait for someone to accept you.' },
                    { status: 403 }
                );
            }
        } else if (userDb.length > 1) {
            return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'No user found.' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }

    // Generate jose
    const token = await new SignJWT({ id: user.id, email: user.email, userType: user.type })
        .setProtectedHeader({ alg: 'HS256' }) // Set the algorithm in the protected header
        .setExpirationTime('1h')
        .sign(secretKey);

    // Create JSON response and set cookie
    const response = NextResponse.json({ message: 'Login successful', redirectTo: '/' });

    response.cookies.set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1h
        path: '/',
        sameSite: 'strict',
    });

    return response;
}
