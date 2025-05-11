'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IconUser, IconMail, IconPhone, IconLock, IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';
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
                    <Form className="space-y-4 sm:space-y-6">
                        {/* Name Fields Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-white">
                                    First Name
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IconUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        autoComplete="given-name"
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="First Name"
                                    />
                                </div>
                                <ErrorMessage name="firstName" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-white">
                                    Last Name
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IconUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Last Name"
                                    />
                                </div>
                                <ErrorMessage name="lastName" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                        </div>

                        {/* Contact Fields Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white">
                                    Email Address
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IconMail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Email Address"
                                    />
                                </div>
                                <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-white">
                                    Phone Number
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IconPhone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <ErrorMessage name="phone" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                        </div>

                        {/* Password Fields Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IconLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Password"
                                    />
                                </div>
                                <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IconLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Confirm Password"
                                    />
                                </div>
                                <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                        </div>

                        {/* Account Type */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Account Type</label>
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <div>
                                    <Field type="radio" name="accountType" value="user" id="user" className="hidden peer" />
                                    <label
                                        htmlFor="user"
                                        className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black/50 bg-white hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-600 cursor-pointer"
                                    >
                                        User
                                    </label>
                                </div>
                                <div>
                                    <Field type="radio" name="accountType" value="provider" id="provider" className="hidden peer" />
                                    <label
                                        htmlFor="provider"
                                        className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black/50 bg-white hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-600 cursor-pointer"
                                    >
                                        Provider
                                    </label>
                                </div>
                            </div>
                            <ErrorMessage name="accountType" component="p" className="text-red-500 text-xs mt-1" />
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center">
                            <Field type="checkbox" name="termsAccepted" id="termsAccepted" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor="termsAccepted" className="ml-2 block text-sm text-white">
                                I agree to the{' '}
                                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                                    Terms and Conditions
                                </Link>
                            </label>
                        </div>
                        <ErrorMessage name="termsAccepted" component="p" className="text-red-500 text-xs mt-1" />

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating account...' : 'Create account'}
                            </button>
                        </div>

                        {/* Social Login */}
                        <div className="mt-4 sm:mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <IconBrandGoogle className="h-5 w-5" />
                                    <span className="ml-2">Google</span>
                                </button>
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <IconBrandFacebook className="h-5 w-5" />
                                    <span className="ml-2">Facebook</span>
                                </button>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center text-sm">
                            <span className="text-white">Already have an account?</span>{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign in
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </AuthLayout>
    );
};

export default Register;
