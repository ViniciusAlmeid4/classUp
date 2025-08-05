'use client';

export default function ProfilePage({ user }) {
    if (!user) {
        return <p className="text-center text-red-500">User not found or not authenticated.</p>;
    }

    const userType = {
        'student': 'Estudante',
        'representative': 'Representante',
        'professor': 'Professor'
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Full Name */}
            <div>
                <label className="block font-medium">Nome</label>
                <input
                    type="text"
                    className="mt-1 w-full px-4 py-2 border rounded-lg cursor-not-allowed"
                    value={user.fullName || ''}
                    disabled
                />
            </div>

            {/* Email */}
            <div>
                <label className="block font-medium">Email</label>
                <input
                    type="email"
                    className="mt-1 w-full px-4 py-2 border rounded-lg cursor-not-allowed"
                    value={user.email || ''}
                    disabled
                />
            </div>

            {/* User Type */}
            <div>
                <label className="block font-medium">Tipo de usuário</label>
                <input
                    type="text"
                    className="mt-1 w-full px-4 py-2 border rounded-lg cursor-not-allowed capitalize"
                    value={userType[user.type] || ''}
                    disabled
                />
            </div>

            {/* RA and Sala (if student or representative) */}
            {(user.type === 'student' || user.type === 'representative') && (
                <div className="flex gap-3">
                    <div>
                        <label className="block font-medium">RA</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border rounded-lg cursor-not-allowed"
                            value={user.RA || ''}
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Sala</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border rounded-lg cursor-not-allowed"
                            value={user.className || ''}
                            disabled
                        />
                    </div>
                </div>
            )}

            {/* Created At */}
            <div>
                <label className="block font-medium">Conta criada em</label>
                <input
                    type="text"
                    className="mt-1 w-full px-4 py-2 border rounded-lg cursor-not-allowed"
                    value={user.createdAt ? new Date(user.createdAt).toLocaleString() : ''}
                    disabled
                />
            </div>
        </div>
    );
}
