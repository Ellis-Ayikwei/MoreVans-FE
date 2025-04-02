'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/Auth/AuthLayout';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle password reset logic here
        console.log('Reset password for:', email);
        setIsSubmitted(true);
    };

    return (
        <AuthLayout title="Reset your password" subtitle="Enter your email address and we'll send you a link to reset your password">
            {!isSubmitted ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#dc711a] hover:bg-[#dc711a]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc711a]"
                    >
                        Send reset link
                    </button>

                    <div className="text-center">
                        <Link to="/auth/login" className="text-sm font-medium text-[#dc711a] hover:text-[#dc711a]/80">
                            Back to login
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                        <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Check your email</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        We've sent a password reset link to
                        <br />
                        <span className="font-medium text-gray-900 dark:text-white">{email}</span>
                    </p>
                    <div className="mt-6">
                        <Link to="/auth/login" className="text-sm font-medium text-[#dc711a] hover:text-[#dc711a]/80 flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to login
                        </Link>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}
