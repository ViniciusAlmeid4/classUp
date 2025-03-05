import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'seu_segredo_super_secreto';

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // Verifica se a rota acessada está na lista de rotas protegidas
    if (protectedRoutes.includes(pathname)) {
        // Pegando o token do cookie
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        try {
            // Verifica o token
            jwt.verify(token, SECRET_KEY);
            return NextResponse.next();
        } catch (error) {
            return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 403 });
        }
    }

    return NextResponse.next();

    console.log('rodou o middleware.js');
    
}

export const config = {
    matcher: [
        '/login/:path*', 
        '/api/:path*', 
        '!api/auth/:path*'
    ],
};
