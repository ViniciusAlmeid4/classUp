export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/models/db';

export async function DELETE(req, { params }) {
    const { id } = await params;
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
        await db.collection('warnings').doc(id).delete();
        return NextResponse.json({ message: 'Aviso deletado com sucesso!' }, { status: 200 });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ message: 'Erro ao deletar o aviso' }, { status: 500 });
    }
}
