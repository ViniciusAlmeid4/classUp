import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import MyHeader from '@/components/header/Header'; // Import Header
import UserList from '@/components/user/ListUser';

export default async function Atividade() {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);

    let userType = null;

    if (token) {
        try {
            const { payload } = await jwtVerify(token, secretKey);
            userType = payload.userType;
            if (userType !== 'representative' && userType !== 'professor') {
                return (
                    <div className="flex h-screen w-full items-center justify-center">
                        <p className="text-red-500">
                            Você não tem permissão para acessar esta página.
                        </p>
                    </div>
                );
            }
        } catch (error) {
            console.error('JWT verification failed:', error);
        }
    }

    return (
        <>
            <MyHeader userType={userType} />
            <main className="flex h-screen w-full items-center justify-center">
                <UserList />
            </main>
        </>
    );
}
