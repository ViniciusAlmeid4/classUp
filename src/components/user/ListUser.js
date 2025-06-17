'use client';
import UserCard from '@/components/user/UserCard';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalUser, setModalUser] = useState({});
    const [modalFormData, setModalFormData] = useState({});

    function closeModal() {
        setModalIsOpen(false);
        setModalUser({});
        setModalFormData({});
    }

    useEffect(() => {
        async function getUsers() {
            const res = await fetch('/api/users', {
                method: 'GET',
                headers: { 'content-type': 'application/json' },
                credentials: 'include',
            });
            const dataRes = await res.json();
            if (res.ok) {
                setUsers(dataRes.users);
            } else {
                console.error('Failed to fetch users:', dataRes.error);
            }
        }

        Modal.setAppElement('#app');
        getUsers();
    }, []);

    function handleAccept(userId) {
        fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status: 'accepted' }),
        });
    }

    function handelReject(userId) {
        fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status: 'rejected' }),
        });
    }

    function handleEdit(user) {
        setModalUser(user);
        setModalFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            type: user.type || '',
            RA: user.RA || '',
            className: user.className || '',
            status: user.status || '',
        });
        setModalIsOpen(true);
    }

    async function submitEdit() {
        try {
            const res = await fetch(`/api/users/${modalUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(modalFormData),
            });

            if (res.ok) {
                closeModal();
                const updatedUsers = users.map((u) =>
                    u.id === modalUser.id ? { ...u, ...modalFormData } : u
                );
                setUsers(updatedUsers);
            } else {
                const errorData = await res.json();
                console.error('Failed to update user:', errorData.error);
            }
        } catch (err) {
            console.error('Error updating user:', err);
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-start w-full h-full p-4" id="app">
                <div className="my-10">
                    <span className="text-2xl font-bold">Lista de Usuários</span>
                </div>
                <div className="h-100 flex gap-8 items-center sm:items-start">
                    {users.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onAccept={handleAccept}
                            onReject={handelReject}
                            onEdit={() => handleEdit(user)}
                        />
                    ))}
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Edit User Modal"
                className="calendar-modal-content"
                overlayClassName="calendar-modal-overlay"
            >
                <h2 className="text-base/7 font-semibold">{modalFormData.fullName || ''}</h2>

                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-12 h-fit">
                    <div className="sm:col-span-12">
                        <label htmlFor="fullName" className="block text-sm/6 font-medium">
                            Full name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            className="input-primary mt-2"
                            value={modalFormData.fullName}
                            onChange={(e) =>
                                setModalFormData({ ...modalFormData, fullName: e.target.value })
                            }
                        />
                    </div>

                    <div className="sm:col-span-12">
                        <label htmlFor="email" className="block text-sm/6 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="input-primary mt-2"
                            value={modalFormData.email}
                            onChange={(e) =>
                                setModalFormData({ ...modalFormData, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="type" className="block text-sm/6 font-medium">
                            Type
                        </label>
                        <select
                            id="type"
                            className="input-primary mt-2"
                            value={modalFormData.type}
                            onChange={(e) =>
                                setModalFormData({ ...modalFormData, type: e.target.value })
                            }
                        >
                            <option value="student">Aluno</option>
                            <option value="representative">Representante</option>
                            <option value="professor">Professor</option>
                        </select>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="ra" className="block text-sm/6 font-medium">
                            RA
                        </label>
                        <input
                            type="text"
                            id="ra"
                            className="input-primary mt-2"
                            value={modalFormData.RA}
                            onChange={(e) =>
                                setModalFormData({ ...modalFormData, RA: e.target.value })
                            }
                        />
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="className" className="block text-sm/6 font-medium">
                            Class
                        </label>
                        <input
                            type="text"
                            id="className"
                            className="input-primary mt-2"
                            value={modalFormData.className}
                            onChange={(e) =>
                                setModalFormData({
                                    ...modalFormData,
                                    className: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="status" className="block text-sm/6 font-medium">
                            Status
                        </label>
                        <input
                            type="text"
                            id="status"
                            className="input-primary mt-2"
                            value={modalFormData.status}
                            onChange={(e) =>
                                setModalFormData({ ...modalFormData, status: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button className="btn-primary" onClick={submitEdit}>
                        Editar
                    </button>
                    <button className="btn-primary" onClick={closeModal}>
                        Close
                    </button>
                </div>
            </Modal>
        </>
    );
}
