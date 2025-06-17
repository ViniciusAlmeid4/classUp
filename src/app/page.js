import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import CardAlerts from '@/components/alerts/CardAlerts';
import Calendar from '@/components/calendar/Calendar';
import MyHeader from '@/components/header/Header';

export default async function Home() {
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
            <MyHeader userType={userType}/>
            <main className="flex h-screen w-full">
                {/* Calendar Section (9/12 width) */}
                <div className="w-9/12 h-full flex">
                    <Calendar userType={userType} />  {/* ✅ Pass userType as a prop */}
                </div>

                {/* Warnings Section (3/12 width) */}
                <div className="w-3/12 h-full p-4 flex flex-col items-center justify-center">
                    <CardAlerts userType={userType} />  {/* ✅ Pass userType as a prop */}
                </div>
            </main>
        </>
    );
}
