import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/models/db';

export async function GET() {
    try {
        const warningsRef = db.collection('warnings');
        const snapshot = await warningsRef.get();

        const warnings = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ warnings });
    } catch (error) {
        console.error('Error fetching warnings:', error);
        return NextResponse.json({ error: 'Failed to fetch warnings' }, { status: 500 });
    }
}

export async function POST(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;
    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);

    let userId = null;
    if (token) {
        try {
            const { payload } = await jwtVerify(token, secretKey);
            if (payload.userType !== 'representative' && payload.userType !== 'professor') {
                return NextResponse.json({ message: 'Permission denied' }, { status: 403 });
            }
            userId = payload.id;
        } catch (error) {
            console.error('JWT verification failed:', error);
        }
    }

    const { title, message, level } = await req.json();

    try {
        const docRef = await db.collection('warnings').add({
            title,
            message,
            level,
            createdAt: new Date(),
            user: 'user/' + userId,
        });
        return NextResponse.json({ message: 'Warning created', id: docRef.id }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to create warning' }, { status: 500 });
    }
}
