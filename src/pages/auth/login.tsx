'use client';

import { faFacebookF, faGoogle, faApple, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faEye, faEyeSlash, faExclamationCircle, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import AuthLayout from '../../components/Auth/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, IRootState } from '../../store/index';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser } from '../../store/authSlice';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { ThunkDispatch } from '@reduxjs/toolkit';

interface LoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
  
    
    const dispatch: ThunkDispatch<IRootState, unknown, AnyAction> = useDispatch();
    const signIn = useSignIn();
    const [showPassword, setShowPassword] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    
    // Get auth state from Redux
    const { loading, error, user } = useSelector((state: IRootState) => state.auth);
    
    // Get redirect URL from query params if available
    const from = new URLSearchParams(location.search).get('from') || '/dashboard';
    
   
    // Monitor for auth changes
    useEffect(() => {
        // If user is authenticated, redirect to appropriate page
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'provider') {
                navigate('/provider/dashboard');
            } else {
                navigate(from);
            }
        }
    }, [user, navigate, from]);

    const handleSubmit = async (values: LoginFormValues, { setSubmitting }: any) => {
        try {
            // Increment login attempts
            setLoginAttempts(prev => prev + 1);
            
            // Check if too many failed attempts
            if (loginAttempts >= 5) {
                // Dispatch an action to update the auth state with a rate limit error
                // Or handle it locally
                setSubmitting(false);
                return;
            }
            
            // Dispatch the login action
            const resultAction = await dispatch(LoginUser({
                email: values.email,
                password: values.password,
                extra: {
                    signIn: signIn
                }
            }));
        } catch (error) {
            console.error('Login error:', error);
            // Error handling is done by the Redux slice
        } finally {
            setSubmitting(false);
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to your account">
            <AnimatePresence mode="wait">
                {error && (
                    <motion.div 
                        className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                        <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 mr-3 text-red-500 mt-0.5" />
                        <div>
                            <p className="font-medium">{error}</p>
                            {loginAttempts >= 3 && (
                                <p className="text-sm mt-1">
                                    <Link to="/forgot-password" className="text-red-700 font-medium underline">
                                        Forgot your password?
                                    </Link>
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    rememberMe: false,
                }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form className="space-y-6">
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faEnvelope} className={`h-5 w-5 ${errors.email && touched.email ? 'text-red-400' : 'text-gray-400'}`} />
                                </div>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className={`appearance-none block w-full px-3 py-3 pl-10 border ${
                                        errors.email && touched.email 
                                            ? 'border-red-300 text-red-600 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    } rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200`}
                                    placeholder="name@company.com"
                                />
                                <AnimatePresence>
                                    {errors.email && touched.email && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
                                        >
                                            <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <ErrorMessage name="email">
                                {msg => (
                                    <motion.p 
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-xs mt-1 ml-1"
                                    >
                                        {msg}
                                    </motion.p>
                                )}
                            </ErrorMessage>
                        </div>

                        {/* Password field */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition">
                                        Forgot?
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faLock} className={`h-5 w-5 ${errors.password && touched.password ? 'text-red-400' : 'text-gray-400'}`} />
                                </div>
                                <Field
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    className={`appearance-none block w-full pl-10 pr-10 py-3 border ${
                                        errors.password && touched.password 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    } rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                                </button>
                                <AnimatePresence>
                                    {errors.password && touched.password && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500"
                                        >
                                            <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <ErrorMessage name="password">
                                {msg => (
                                    <motion.p 
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-xs mt-1 ml-1"
                                    >
                                        {msg}
                                    </motion.p>
                                )}
                            </ErrorMessage>
                        </div>

                        {/* Remember me checkbox */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Field 
                                    id="rememberMe" 
                                    name="rememberMe" 
                                    type="checkbox" 
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition"
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        {/* Submit button */}
                        <div>
                            <motion.button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all duration-200 relative overflow-hidden"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                {(isSubmitting || loading) ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : (
                                    <>
                                        Sign in
                                        <FontAwesomeIcon icon={faShieldAlt} className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </Form>
                )}
            </Formik>

            {/* Social Login Section */}
            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <motion.button
                        type="button"
                        onClick={() => dispatch(loginUser({ provider: 'google' }))}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-150"
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-red-500" />
                        <span className="ml-2">Google</span>
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={() => dispatch(loginUser({ provider: 'facebook' }))}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-150"
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faFacebookF} className="h-5 w-5 text-blue-600" />
                        <span className="ml-2">Facebook</span>
                    </motion.button>
                </div>
            </div>

            {/* Sign up redirect */}
            <div className="mt-8 text-center">
                <motion.p 
                    className="text-sm text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Don't have an account?{' '}
                    <Link 
                        to="/register" 
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                        Create an account
                    </Link>
                </motion.p>
            </div>

            {/* Security notice */}
            <div className="mt-4 text-center">
                <motion.p 
                    className="text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <FontAwesomeIcon icon={faShieldAlt} className="mr-1 h-3 w-3" />
                    Secure login protected by 256-bit encryption
                </motion.p>
            </div>
        </AuthLayout>
    );
};

export default Login;
