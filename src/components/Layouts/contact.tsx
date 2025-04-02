// First install EmailJS:
// npm install @emailjs/browser

import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

import emailjs from '@emailjs/browser';
import { faFacebookF, faGithub, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ContactMe = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    interface FormData {
        name: string;
        email: string;
        subject: string;
        message: string;
    }

    interface ContactInfo {
        icon: React.ComponentType;
        text: string;
        label: string;
    }

    interface SocialMedia {
        icon: any;
        href: string;
    }

   
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            // Replace these with your actual EmailJS credentials
            const result = await emailjs.send(
                'service_w4epcaw',
                'template_fb40bc2',
                {
                    from_name: formData.name,
                    reply_to: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                },
                '0tcbTOTGOBiuu2G5f'
            );

            if (result.status === 200) {
                setStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                });
            }
        } catch (error) {
            console.error('Email sending failed:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        { icon: Mail, text: 'ellisarmahayikwei@gmail.com', label: 'Email' },
        { icon: Phone, text: '+233 24 813 8722', label: 'Phone' },
        { icon: MapPin, text: 'Accra, Ghana', label: 'Location' },
    ];

    
    const socialMedia = [
        { icon: faFacebookF, href: 'https://web.facebook.com/ellis.hero/' },
        { icon: faGithub, href: 'https://github.com/Ellis-Ayikwei' },
        { icon: faInstagram, href: 'https://www.instagram.com/ellis_rockefeller/' },
        { icon: faLinkedin, href: 'https://www.linkedin.com/in/ellis-armah-ayikwei-4a817b192/' },
        { icon: faTwitter, href: 'https://x.com/home' },
    ];

    return (
        <div className="min-h-screen w-full backdrop-blur-sm bg-transparent text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
                    <p className="text-gray-400">Let's work together to bring your ideas to life</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Information Cards */}
                    <div className="lg:col-span-1 space-y-4">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="p-6 border-none">
                                <div className="flex items-center space-x-4">
                                    <div className="p-4 bg-[#dc711a] rounded-full">
                                        <info.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-300">{info.label}</h3>
                                        <p className="text-white">{info.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-4 hero-content mt-5">
                {socialMedia.map(({ icon, href }, idx) => (
                    <a key={idx} href={href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 text-white bg-[#dc711a] rounded-full flex items-center justify-center hover:scale-125 transition-all duration-300 shadow-lg">
                        <FontAwesomeIcon icon={icon} />
                    </a>
                ))}
            </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="p-8  border-none">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#dc711a] outline-none"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Your Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#dc711a] outline-none"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#dc711a] outline-none"
                                        placeholder="How can I help you?"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#dc711a] outline-none resize-none"
                                        placeholder="Your message here..."
                                        required
                                    />
                                </div>

                                {status === 'success' && <div className="p-4 bg-green-800 text-white rounded-lg">Message sent successfully!</div>}

                                {status === 'error' && <div className="p-4 bg-red-800 text-white rounded-lg">Failed to send message. Please try again.</div>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-6 bg-[#dc711a] text-white font-semibold rounded-lg 
                    ${!loading ? 'hover:bg-[#dc711a]/90 hover:scale-105' : 'opacity-75 cursor-not-allowed'}
                    transition duration-300 shadow-lg`}
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactMe;
