'use client'; // Required for interactivity in Next.js App Router

import { useState } from 'react';
import Link from 'next/link';
import './header.css';

export default function Header({userType}) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <header className="bg-neutral-800 shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center custom-header">
                {/* LOGO */}
                <Link href="/">
                    <span className="text-2xl font-bold text-neutral-100">ClassUP</span>
                </Link>

                {/* DESKTOP MENU */}
                <nav className="hidden md:flex text-neutral-300 space-x-6">
                    <Link href="/" className="">
                        Home
                    </Link>
                    {(userType === 'representative' || userType === 'professor') && (
                        <Link href="/users" className="">
                            Users
                        </Link>
                    )}
                    <Link href="/users" className="">
                        My Account
                    </Link>
                    {/* Admins only link
                    <Link href="/contact" className="">
						Contact
					</Link> */}
                </nav>

                {/* MOBILE MENU BUTTON */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-gray-700 focus:outline-none"
                >
                    {/* Hamburger Icon */}
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                        />
                    </svg>
                </button>
            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <nav className="md:hidden bg-gray-100">
                    <Link href="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
                        Home
                    </Link>
                    <Link href="/about" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
                        About
                    </Link>
                    <Link
                        href="/services"
                        className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
                    >
                        Services
                    </Link>
                    <Link
                        href="/contact"
                        className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
                    >
                        Contact
                    </Link>
                </nav>
            )}
        </header>
    );
}
