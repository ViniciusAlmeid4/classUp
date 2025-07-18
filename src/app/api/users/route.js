export const runtime = 'nodejs'; // Switch to Node.js runtime

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/models/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies(); // ✅ Await it here
    const token = cookieStore.get('authToken')?.value;

    let userType = null;

    if (token) {
        try {
            const secretKey = new TextEncoder().encode(process.env.jose_SECRET);
            const { payload } = await jwtVerify(token, secretKey);
            userType = payload.userType;
        } catch (err) {
            console.error('JWT verification failed:', err);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    } else {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    if (userType !== 'representative' && userType !== 'professor') {
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
    }

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();

        const users = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ users });
    } catch (err) {
        console.error('Error fetching users:', err);
        return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(req) {
    let { fullName, email, password, userType, RA, className } = await req.json();

    // const secretKey = new TextEncoder().encode(process.env.jose_SECRET);
    if (userType !== 'student' && userType !== 'representative' && userType !== 'professor') {
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
    }

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        const userDb = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (userDb.length > 0) {
            return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
        }

        usersRef.add({
            fullName,
            email,
            type: userType,
            RA,
            className,
            password: await bcrypt.hash(password, 10),
            status: 'awaiting',
            createdAt: new Date(),
        });

        return NextResponse.json({ message: 'Nova solicitação enviada.' }, { status: 201 });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
