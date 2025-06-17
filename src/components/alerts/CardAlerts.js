'use client';

import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './cardAlerts.css';

export default function CardAlerts({ userType }) {
    const [warnings, setWarnings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ title: '', message: '', level: 'info' });

    const canEdit = userType === 'representative' || userType === 'professor';

    useEffect(() => {
        Modal.setAppElement('#warnings-element'); // Update if your root element has a different ID
        fetchWarnings();
    }, []);

    async function fetchWarnings() {
        setLoading(true);
        try {
            const res = await fetch('/api/warnings');
            const data = await res.json();
            setWarnings(data.warnings || []);
        } catch (err) {
            console.error('Failed to fetch warnings:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch('/api/warnings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setForm({ title: '', message: '', level: 'info' });
                setIsModalOpen(false);
                fetchWarnings();
            } else {
                console.error('Failed to create warning');
            }
        } catch (err) {
            console.error('Error submitting warning:', err);
        }
    }

    async function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this warning?')) {
            try {
                const res = await fetch(`/api/warnings/${id}`, {
                    method: 'DELETE',
                });
                if (res.ok) {
                    fetchWarnings();
                } else {
                    console.error('Failed to delete warning');
                }
            } catch (err) {
                console.error('Error deleting warning:', err);
            }
        }
    }

    return (
        <div
            className="h-full w-full flex flex-col items-center justify-start pt-1"
            id="warnings-element"
        >
            <div className="w-full flex flex-row justify-between px-2">
                <h2 className="text-[1.75em] mb-2">Warnings</h2>
                {canEdit && (
                    <button onClick={() => setIsModalOpen(true)} className="btn-secondary">
                        Novo
                    </button>
                )}
            </div>

            <div className="h-full w-full flex flex-col gap-3 items-center justify-start dash-card-alerts text-center overflow-y-auto px-2">
                {loading ? (
                    <p className="text-sm text-[--primary]">Carregando avisos...</p>
                ) : warnings.length === 0 ? (
                    <p className="text-sm text-[--primary]">Nenhum aviso no momento.</p>
                ) : (
                    warnings.map((w) => (
                        <div
                            key={w.id}
                            className={`w-full custom-card border-l-4 relative ${
                                w.level === 'info'
                                    ? 'border-blue-500'
                                    : w.level === 'warning'
                                    ? 'border-yellow-500'
                                    : 'border-red-500'
                            }`}
                        >
                            {canEdit && (
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(w.id)}
                                >
                                    ×
                                </button>
                            )}
                            <div className="card-header text-2xl">{w.title}</div>
                            <div className="card-body">{w.message}</div>
                            <div className="card-footer text-xs text-gray-500">
                                {w.createdAt?._seconds
                                    ? new Date(w.createdAt._seconds * 1000).toLocaleString()
                                    : 'Data inválida'}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Nova Advertência"
                className="calendar-modal-content"
                overlayClassName="calendar-modal-overlay"
            >
                <h2 className="text-base/7 font-semibold">Nova Advertência</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-12 h-fit">
                        <div className="sm:col-span-12">
                            <label className="block text-sm font-medium">Título</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="input-primary"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-12">
                            <label className="block text-sm font-medium">Mensagem</label>
                            <div className="mt-2">
                                <textarea
                                    className="input-primary resize-none"
                                    rows={3}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-12">
                            <label className="block text-sm font-medium">Nível</label>
                            <div className="mt-2">
                                <select
                                    className="input-primary"
                                    value={form.level}
                                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                                >
                                    <option value="info">Informação</option>
                                    <option value="warning">Advertência</option>
                                    <option value="critical">Crítico</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex mt-6">
                        <button
                            type="button"
                            className="btn-secondary me-auto"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Fechar
                        </button>
                        <button type="submit" className="btn-secondary ms-auto">
                            Criar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
