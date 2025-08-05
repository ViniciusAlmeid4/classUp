export const runtime = 'nodejs'; // Switch to Node.js runtime

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/models/db';

export async function GET(req, {params}) {
    
}

export async function PATCH(req, { params }) {
    const { id } = await params;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return NextResponse.json(
            { message: 'Corpo da requisição inválido ou ausente' },
            { status: 400 }
        );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);

    if (token) {
        try {
            const { payload } = await jwtVerify(token, secretKey);
            if (payload.userType !== 'representative' && payload.userType !== 'professor') {
                return NextResponse.json(
                    { message: 'Você não tem permissão para realizar essa ação' },
                    { status: 403 }
                );
            }
        } catch (error) {
            console.error('JWT verification failed:', error);
        }
    }

    try {
        await db.collection('users').doc(id).update(body);
        return NextResponse.json({ message: 'Usuário atualizado com sucesso!' }, { status: 200 });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ message: 'Erro ao atualizar o usuário' }, { status: 500 });
    }
}
