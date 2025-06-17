import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import MyHeader from '@/components/header/Header'; // Import Header

export default async function Atividade() {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);

    let userType = null;

    if (token) {
        try {
            const { payload } = await jwtVerify(token, secretKey);
            userType = payload.userType;
        } catch (error) {
            console.error('JWT verification failed:', error);
        }
    }

    return (
        <>
            <MyHeader userType={userType} />
            <main className="flex h-screen w-full items-center justify-center">
                <div className="flex flex-col gap-8 items-center sm:items-start">
                    Pagina de atividades!!
                </div>
            </main>
        </>
    );
}
