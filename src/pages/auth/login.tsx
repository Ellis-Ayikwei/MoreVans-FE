'use client';

import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import AuthLayout from '../../components/Auth/AuthLayout';

interface LoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleSubmit = async (values: LoginFormValues) => {
        try {
            // In a real app, this would be an API call
            console.log('Login values:', values);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock user data
            const user = {
                id: '123',
                name: 'John Doe',
                email: values.email,
                role: 'user', // or 'provider' or 'admin'
            };

            // Store user in localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect based on user role
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'provider') {
                navigate('/provider/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Invalid email or password. Please try again.');
        }
    };

    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to your account">
            {loginError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{loginError}</div>}

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    rememberMe: false,
                }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                                </div>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                                </div>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                            <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Field id="rememberMe" name="rememberMe" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <div>
                        <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-red-500" />
                            <span className="ml-2">Google</span>
                        </a>
                    </div>

                    <div>
                        <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <FontAwesomeIcon icon={faFacebookF} className="h-5 w-5 text-blue-600" />
                            <span className="ml-2">Facebook</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;
