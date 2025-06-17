'use client'; // Ensure this is at the very top

import { useState } from 'react';
import Link from 'next/link';
import './register.css';

async function signUp(fullName, email, password, userType, RA, className) {
    const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, userType, RA, className }),
        credentials: 'include', // Ensures cookies are sent
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
}

export default function LoginPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const [RA, setRA] = useState('');
    const [className, setClassName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signUp(fullName, email, password, userType, RA, className);
            window.location.href = '/'; // Redirect after successful login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-3xl p-6 rounded-2xl custom-shadow bg-(--middleground)">
                <h2 className="text-2xl font-bold text-center">Register</h2>
                <form className="mt-6 flex flex-col" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <div className="w-12/12">
                            {/* Name Field */}
                            <div>
                                <label className="block font-medium">Nome</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full px-4 py-2 border rounded-lg"
                                    placeholder="Enter your name"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="w-6/12">
                                {/* Email Field */}
                                <div className="mt-4">
                                    <label className="block font-medium">Email</label>
                                    <input
                                        type="email"
                                        className="mt-1 w-full px-4 py-2 border rounded-lg"
                                        placeholder="Enter your email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="mt-4">
                                    <label className="block font-medium">Password</label>
                                    <input
                                        type="password"
                                        className="mt-1 w-full px-4 py-2 border rounded-lg"
                                        placeholder="Enter your password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block font-medium">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="mt-1 w-full px-4 py-2 border rounded-lg"
                                        placeholder="Enter your password"
                                        required
                                        value={confPassword}
                                        onChange={(e) => setConfPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="w-6/12">
                                <div className="mt-4">
                                    <label htmlFor="user-type" className="block font-medium ">
                                        Tipo de usuário
                                    </label>
                                    <select
                                        id="user-type"
                                        name="user-type"
                                        className="custom-select mt-1 w-full px-4 py-2 border rounded-lg"
                                        value={userType}
                                        onChange={(e) => setUserType(e.target.value)}
                                    >
                                        <option value="student">Aluno</option>
                                        <option value="representative">Representante</option>
                                        <option value="professor">Professor</option>
                                    </select>
                                </div>
                                {(userType === 'student' || userType === 'representative') && (
                                    <>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="user-type"
                                                className="block font-medium "
                                            >
                                                RA
                                            </label>
                                            <input
                                                id="ra"
                                                name="ra"
                                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                                                value={RA}
                                                onChange={(e) => setRA(e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <label
                                                htmlFor="user-type"
                                                className="block font-medium "
                                            >
                                                Sala
                                            </label>
                                            <input
                                                id="class"
                                                name="class"
                                                className="mt-1 w-full px-4 py-2 border rounded-lg"
                                                value={className}
                                                onChange={(e) => setClassName(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Display Error */}
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full mt-6 py-2 rounded-lg transition bg-primary max-w-sm mx-auto"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Register Link */}
                <p className="text-sm text-center mt-4">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
