'use client';

import React from 'react';

export default function UserCard({ user, onAccept, onReject, onEdit }) {
    return (
        <div className="rounded-2xl p-4 bg-(--middleground) custom-shadow w-340 max-w-md flex flex-col gap-2">
            <h2 className="text-lg font-semibold truncate">{user.fullName}</h2>
            <p className="text-sm"><strong>Email:</strong> {user.email}</p>
            <p className="text-sm"><strong>Tipo:</strong> {user.type}</p>
            {user.RA && (
                <p className="text-sm"><strong>RA:</strong> {user.RA}</p>
            )}
            {user.className && (
                <p className="text-sm"><strong>Class:</strong> {user.className}</p>
            )}
            <p className="text-sm italic"><strong>Status:</strong> {user.status}</p>

            <div className="mt-4 flex gap-3">
                {onAccept && user.status == 'awaiting' && (
                    <button
                        onClick={() => onAccept(user.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Accept
                    </button>
                )}
                {onReject && user.status == 'awaiting' && (
                    <button
                        onClick={() => onReject(user.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Reject
                    </button>
                )}
                {onEdit && (
                    <button
                        onClick={() => onEdit(user.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}
