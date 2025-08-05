'use client';
import UserCard from '@/components/user/UserCard';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalUser, setModalUser] = useState({});
    const [modalFormData, setModalFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    function closeModal() {
        setModalIsOpen(false);
        setModalUser(null);
        setModalFormData({});
    }

    async function getUsers(name = '') {
        let url = '/api/users';
        if (name) {
            url += `?name=${encodeURIComponent(name)}`;
        }
        const res = await fetch(url, {
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

    useEffect(() => {
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

    function handleReject(userId) {
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
            <div className="flex flex-col items-start w-full h-screen p-4 gap-4" id="app">
                {/* Barra de busca */}
                <div className="w-full flex items-center justify-center gap-4 my-6">
                    <input
                        id="search-user"
                        name="search-user"
                        type="text"
                        className="w-64 px-3 py-1.5 border rounded-md"
                        placeholder="Nome do usuário..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button
                        className="btn-primary px-4 py-1.5 rounded-md"
                        onClick={() => getUsers(searchTerm)}
                    >
                        Buscar
                    </button>
                </div>

                {/* Conteúdo de usuários */}
                <div className="flex w-full gap-6 flex-1 overflow-hidden">
                    {/* Usuários aceitos */}
                    <div className="w-2/3">
                        <h2 className="text-xl font-bold mb-4">Lista de Aceitos</h2>
                        <div className="overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                                {users
                                    .filter((user) => user.status !== 'awaiting')
                                    .map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            onAccept={handleAccept}
                                            onReject={handleReject}
                                            onEdit={() => handleEdit(user)}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Pendentes */}
                    <div className="w-1/3">
                        <h2 className="text-xl font-bold mb-4">Pendentes</h2>
                        <div className="overflow-y-auto max-h-[calc(100vh-220px)] pr-2 space-y-4">
                            {users
                                .filter((user) => user.status === 'awaiting')
                                .map((user) => (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        onAccept={handleAccept}
                                        onReject={handleReject}
                                        onEdit={() => handleEdit(user)}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Edit User Modal"
                className="calendar-modal-content"
                overlayClassName="calendar-modal-overlay"
            >
                <h2 className="text-base/7 font-semibold">{modalFormData?.fullName || ''}</h2>

                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-12 h-fit">
                    <div className="sm:col-span-12">
                        <label htmlFor="fullName" className="block text-sm/6 font-medium">
                            Full name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            className="input-primary mt-2"
                            value={modalFormData?.fullName || ''}
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
                            value={modalFormData?.email || ''}
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
                            value={modalFormData?.type || ''}
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
                            value={modalFormData?.RA || ''}
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
                            value={modalFormData?.className || ''}
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
                        <select
                            id="status"
                            className="input-primary mt-2"
                            value={modalFormData?.status || ''}
                            onChange={(e) =>
                                setModalFormData({ ...modalFormData, status: e.target.value })
                            }
                        >
                            <option value="accepted">Aceito</option>
                            <option value="rejected">Rejeitado</option>
                            <option value="awaiting">Aguardando</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button className="btn-primary" onClick={submitEdit}>
                        Editar
                    </button>
                </div>
            </Modal>
        </>
    );
}
