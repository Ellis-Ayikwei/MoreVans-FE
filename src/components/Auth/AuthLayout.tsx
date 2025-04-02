'use client';

import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="/logo.svg"
                        alt="MoveIt Logo"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/120x40?text=MoveIt';
                        }}
                    />
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {title}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {subtitle}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
