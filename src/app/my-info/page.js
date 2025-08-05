import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/models/db';
import MyHeader from '@/components/header/Header'; // Import Header
import ProfilePage from '@/components/user/ProfilePage';

export default async function Users() {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    const secretKey = new TextEncoder().encode(process.env.jose_SECRET);
    let user;
    try {
        const { payload } = await jwtVerify(token, secretKey);
        const usersRef = db.collection('users');
        const snapshot = await usersRef.doc(payload.id).get();

        if (snapshot.exists) {
            const data = snapshot.data();

            // Convert Firestore Timestamp to ISO string if needed
            if (data.createdAt?.toDate) {
                data.createdAt = data.createdAt.toDate().toISOString();
            }

            // Remove password before passing to client
            delete data.password;

            user = { id: snapshot.id, ...data };
        } else {
            console.error(`User with ID ${payload.id} not found`);
        }
    } catch (error) {
        console.error('JWT verification failed:', error);
    }

    return (
        <>
            <MyHeader userType={user.type} />
            <main className="flex h-screen w-full items-center justify-center">
                <ProfilePage user={user} />
            </main>
        </>
    );
}
