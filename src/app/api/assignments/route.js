import { NextResponse } from 'next/server';
import * as jose from 'jose';

export async function GET() {
    return NextResponse.json({ message: 'Lista de atividades' });
}

export async function POST(req) {
    const token = req.cookies.get('authToken')?.value;

    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);

    try {
        jose.jwtVerify(token, secretKey);
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL('/login', req.url)); // Redirect if token is invalid
    }

    const user = jose.decodeJwt(token);

    if (user.userType !== 'representative' && user.userType !== 'professor') {
        console.log(error);
        return NextResponse.redirect(new URL('/login', req.url)); // Redirect if token is invalid
    }

    let reqData = await req.json();

    console.log(reqData);

    return NextResponse.json({ message: 'Atividade criada' }, { status: 201 });
}

export async function PUT(req) {
    return NextResponse.json({ message: 'Atividade atualizada' });
}

export async function DELETE(req) {
    return NextResponse.json({ message: 'Atividade deletada' });
}
