'use client'; // Ensure this is at the very top

import { useState } from 'react';
import Link from 'next/link';
import './login.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState('');
    const [error, setError] = useState('');
    
    async function login(email, password) {
        if (loading) {
            return;
        }
    
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include', // Ensures cookies are sent
        });
    
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
            setError(data.error);
        } else {
            window.location.href = data.redirectTo;
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        login(email, password);
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md p-6 rounded-2xl custom-shadow bg-(--middleground)">
                <h2 className="text-2xl font-bold text-center">Login</h2>

                <form className="mt-6" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            // type="text"  
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

                    {/* Display Error */}
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-2 rounded-lg transition bg-primary"
                    >
                        Sign In
                    </button>
                </form>

                {/* Register Link */}
                <p className="text-sm text-center mt-4">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
