'use client';

import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import AuthLayout from '../../components/Auth/AuthLayout';

interface RegisterFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    accountType: 'user' | 'provider';
    termsAccepted: boolean;
}

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    accountType: Yup.string().oneOf(['user', 'provider'], 'Please select an account type').required('Account type is required'),
    termsAccepted: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [registerError, setRegisterError] = useState<string | null>(null);

    const handleSubmit = async (values: RegisterFormValues) => {
        try {
            // In a real app, this would be an API call
            console.log('Register values:', values);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock user data
            const user = {
                id: Math.floor(1000 + Math.random() * 9000).toString(),
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                role: values.accountType,
            };

            // Store user in localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect based on account type
            if (values.accountType === 'provider') {
                navigate('/provider/onboarding');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setRegisterError('An error occurred during registration. Please try again.');
        }
    };

    return (
        <AuthLayout title="Create an account" subtitle="Join our community today">
            {registerError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{registerError}</div>}

            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    accountType: 'user',
                    termsAccepted: false,
                }}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        autoComplete="given-name"
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="First Name"
                                    />
                                </div>
                                <ErrorMessage name="firstName" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Last Name"
                                    />
                                </div>
                                <ErrorMessage name="lastName" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
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
                                    placeholder="Email Address"
                                />
                            </div>
                            <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-gray-400" />
                                </div>
                                <Field
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Phone Number"
                                />
                            </div>
                            <ErrorMessage name="phone" component="p" className="text-red-500 text-xs mt-1" />
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
                                    autoComplete="new-password"
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                            <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                                </div>
                                <Field
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Confirm Password"
                                />
                            </div>
                            <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                    <Field type="radio" name="accountType" value="user" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                    <span className="ml-3 text-sm font-medium text-gray-700">Customer</span>
                                </label>
                                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                    <Field type="radio" name="accountType" value="provider" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                    <span className="ml-3 text-sm font-medium text-gray-700">Service Provider</span>
                                </label>
                            </div>
                            <ErrorMessage name="accountType" component="p" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div className="flex items-center">
                            <Field id="termsAccepted" name="termsAccepted" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
                                I agree to the{' '}
                                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        <ErrorMessage name="termsAccepted" component="p" className="text-red-500 text-xs mt-1" />

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating account...' : 'Create account'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>

            <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="font-medium text-[#dc711a] hover:text-[#dc711a]/80">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or sign up with</span>
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
        </AuthLayout>
    );
};

export default Register;
