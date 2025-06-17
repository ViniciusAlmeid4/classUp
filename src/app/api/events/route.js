import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/models/db';

export async function GET() {
    try {
        const eventsRef = db.collection('events');
        // const snapshot = await eventsRef.where('user', '==', userRef).get();
        const snapshot = await eventsRef.get();

        const events = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            classNames: [`event-primary-${doc.data().display}`],
        }));

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
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
                return NextResponse.json({ message: 'Você não tem permissão para realizar essa ação' }, { status: 403 });
            }
            userId = payload.id;
        } catch (error) {
            console.error('JWT verification failed:', error);
        }
    }

    const { title, start, end, allDay, display } = await req.json();

    try {
        let event = {
            title,
            start,
            end: end || null,
            allDay,
            display,
            user: 'user/' + userId,
        }
        const docRef = await db.collection('events').add(event);
        console.log('Event created with ID:', docRef.id);
        return NextResponse.json({ message: 'Evento criado', eventId: docRef.id }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'O servidor não consegiu cadastrar o novo evento, sentimos muito' }, { status: 500 });
    }
}

export async function PUT(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);

    let userId = null;

    if (token) {
        try {
            const { payload } = await jwtVerify(token, secretKey);
            if (payload.userType != 'representative' || 'professor') {
                return NextResponse.json({ message: 'Você não tem permissão para realizar essa ação' }, { status: 403 });
            }
            // userId = payload.id;
        } catch (error) {
            console.error('JWT verification failed:', error);
        }
    }

    const { id, title, start, end, allDay, display } = await req.json();

    try {
        let event = {
            title,
            start,
            end: end || null,
            allDay,
            display,
            // user: 'user/' + userId,
        }
        const docRef = await db.collection('events').doc(id).update(event);
        console.log('Event uptaded');
        return NextResponse.json({ message: 'Evento atualizado' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'O servidor não consegiu atualizar o evento, sentimos muito' }, { status: 500 });
    }
}

export async function DELETE(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);

    let userId = null;

    if (token) {
        try {
            const { payload } = await jwtVerify(token, secretKey);
            if (payload.userType != 'representative' || payload.userType != 'professor') {
                return NextResponse.json({ message: 'Você não tem permissão para realizar essa ação' }, { status: 403 });
            }
            // userId = payload.id;
        } catch (error) {
            console.error('JWT verification failed:', error);
        }
    }

    const { id } = await req.json();

    try {
        const docRef = await db.collection('events').doc(id).delete();
        console.log('Event deleted');
        return NextResponse.json({ message: 'Evento removido' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'O servidor não consegiu remover o evento, sentimos muito' }, { status: 500 });
    }
}
