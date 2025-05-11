'use client';

import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faEye, faEyeSlash, faExclamationCircle, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
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

    const { loading, error, user } = useSelector((state: IRootState) => state.auth);
    const from = new URLSearchParams(location.search).get('from') || '/dashboard';

    const handleSubmit = async (values: LoginFormValues, { setSubmitting }: any) => {
        try {
            setLoginAttempts((prev) => prev + 1);

            if (loginAttempts >= 5) {
                setSubmitting(false);
                return;
            }

            const resultAction = await dispatch(
                LoginUser({
                    email: values.email,
                    password: values.password,
                    extra: {
                        signIn: signIn,
                    },
                })
            );
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to your account">
            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        className="bg-red-500/10 border-l-4 border-red-500 text-red-200 p-4 rounded-lg mb-6 flex items-start"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                        <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 mr-3 text-red-400 mt-0.5" />
                        <div>
                            <p className="font-medium">{error}</p>
                            {loginAttempts >= 3 && (
                                <p className="text-sm mt-1">
                                    <Link to="/forgot-password" className="text-red-200 font-medium underline">
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
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faEnvelope} className={`h-5 w-5 ${errors.email && touched.email ? 'text-red-400' : 'text-white/50'}`} />
                                </div>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className={`appearance-none block w-full px-3 py-3 pl-10 border ${
                                        errors.email && touched.email ? 'border-red-300 text-red-200 bg-red-500/10' : 'border-white/20 text-white bg-white/5'
                                    } rounded-xl shadow-sm placeholder-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-200`}
                                    placeholder="name@company.com"
                                />
                                <AnimatePresence>
                                    {errors.email && touched.email && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400"
                                        >
                                            <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <ErrorMessage name="email">
                                {(msg) => (
                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1 ml-1">
                                        {msg}
                                    </motion.p>
                                )}
                            </ErrorMessage>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-white/80 hover:text-white transition">
                                        Forgot?
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faLock} className={`h-5 w-5 ${errors.password && touched.password ? 'text-red-400' : 'text-white/50'}`} />
                                </div>
                                <Field
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    className={`appearance-none block w-full pl-10 pr-10 py-3 border ${
                                        errors.password && touched.password ? 'border-red-300 text-red-200 bg-red-500/10' : 'border-white/20 text-white bg-white/5'
                                    } rounded-xl shadow-sm placeholder-white/50 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-200`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/80 focus:outline-none transition"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                                </button>
                            </div>
                            <ErrorMessage name="password">
                                {(msg) => (
                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1 ml-1">
                                        {msg}
                                    </motion.p>
                                )}
                            </ErrorMessage>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Field id="rememberMe" name="rememberMe" type="checkbox" className="h-4 w-4 text-white/80 focus:ring-white/20 border-white/20 rounded transition" />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-white/80">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <div>
                            <motion.button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-secondary hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 disabled:opacity-70 transition-all duration-200 relative overflow-hidden"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                {isSubmitting || loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
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

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-transparent text-white/60">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <motion.button
                        type="button"
                        onClick={() => dispatch(LoginUser({ provider: 'google' }))}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-white/20 rounded-xl shadow-sm bg-white/5 text-sm font-medium text-white hover:bg-white/10 transition-all duration-150"
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-red-400" />
                        <span className="ml-2">Google</span>
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={() => dispatch(LoginUser({ provider: 'facebook' }))}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-white/20 rounded-xl shadow-sm bg-white/5 text-sm font-medium text-white hover:bg-white/10 transition-all duration-150"
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faFacebookF} className="h-5 w-5 text-blue-400" />
                        <span className="ml-2">Facebook</span>
                    </motion.button>
                </div>
            </div>

            <div className="mt-8 text-center">
                <motion.p className="text-sm text-white/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-white hover:text-white/90 transition-colors">
                        Create an account
                    </Link>
                </motion.p>
            </div>

            <div className="mt-4 text-center">
                <motion.p className="text-xs text-white/40 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <FontAwesomeIcon icon={faShieldAlt} className="mr-1 h-3 w-3" />
                    Secure login protected by 256-bit encryption
                </motion.p>
            </div>
        </AuthLayout>
    );
};

export default Login;
