import { faFacebook, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">MoveIt</h3>
                        <p className="mb-4">Connecting you with trusted logistics providers for all your moving needs.</p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" className="text-gray-400 hover:text-white">
                                <FontAwesomeIcon icon={faFacebook} size="lg" />
                            </a>
                            <a href="https://twitter.com" className="text-gray-400 hover:text-white">
                                <FontAwesomeIcon icon={faTwitter} size="lg" />
                            </a>
                            <a href="https://instagram.com" className="text-gray-400 hover:text-white">
                                <FontAwesomeIcon icon={faInstagram} size="lg" />
                            </a>
                            <a href="https://linkedin.com" className="text-gray-400 hover:text-white">
                                <FontAwesomeIcon icon={faLinkedin} size="lg" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/service-request" className="text-gray-400 hover:text-white">
                                    Request Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/how-it-works" className="text-gray-400 hover:text-white">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Providers */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">For Providers</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/provider/register" className="text-gray-400 hover:text-white">
                                    Become a Provider
                                </Link>
                            </li>
                            <li>
                                <Link to="/provider/how-it-works" className="text-gray-400 hover:text-white">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link to="/provider/faq" className="text-gray-400 hover:text-white">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/provider/resources" className="text-gray-400 hover:text-white">
                                    Resources
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-gray-400" />
                                <span>123 Main Street, New York, NY 10001</span>
                            </li>
                            <li className="flex items-center">
                                <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
                                <span>(123) 456-7890</span>
                            </li>
                            <li className="flex items-center">
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-400" />
                                <span>info@moveit.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} MoveIt. All rights reserved.</p>
                    <div className="mt-2">
                        <Link to="/privacy" className="hover:text-white mr-4">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="hover:text-white mr-4">
                            Terms of Service
                        </Link>
                        <Link to="/cookies" className="hover:text-white">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
