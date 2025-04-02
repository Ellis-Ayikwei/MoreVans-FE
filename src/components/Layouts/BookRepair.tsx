import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalStyles } from './styles/ModalStyles';

interface BookRepairProps {
    isOpen: boolean;
    onClose: () => void;
}

interface RepairForm {
    name: string;
    email: string;
    phone: string;
    deviceType: 'phone' | 'laptop' | 'tablet' | 'other';
    deviceModel: string;
    issueDescription: string;
    preferredDate: string;
}

const initialFormState: RepairForm = {
    name: '',
    email: '',
    phone: '',
    deviceType: 'phone',
    deviceModel: '',
    issueDescription: '',
    preferredDate: '',
};

const BookRepair: React.FC<BookRepairProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<RepairForm>(initialFormState);
    const [step, setStep] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        // Reset form and close modal
        setFormData(initialFormState);
        setStep(1);
        onClose();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={modalStyles.overlay} onClick={onClose}>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className={modalStyles.container}
                    >
                        {/* Header */}
                        <div className={modalStyles.header}>
                            <h2 className={modalStyles.title}>Book a Repair</h2>
                            <p className={modalStyles.subtitle}>Let us help fix your device</p>
                        </div>

                        {/* Form */}
                        <div className={modalStyles.content}>
                            <form onSubmit={handleSubmit} className={modalStyles.form}>
                                {/* Progress Steps */}
                                <div className="flex justify-between mb-6 px-2">
                                    {[1, 2].map((item) => (
                                        <div key={item} className={`flex items-center ${item !== 2 ? 'flex-1' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= item ? 'bg-[#dc711a] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                {item}
                                            </div>
                                            {item === 1 && (
                                                <div className="flex-1 h-1 mx-2 sm:mx-4 bg-gray-200">
                                                    <div className="h-full bg-[#dc711a] transition-all duration-300" style={{ width: step > 1 ? '100%' : '0%' }} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {step === 1 ? (
                                    <div className={modalStyles.grid}>
                                        <div>
                                            <label className={modalStyles.label}>Name</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={modalStyles.input} required />
                                        </div>
                                        <div>
                                            <label className={modalStyles.label}>Email</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={modalStyles.input} required />
                                        </div>
                                    </div>
                                ) : (
                                    <div className={modalStyles.grid}>
                                        <div>
                                            <label className={modalStyles.label}>Device Type</label>
                                            <select name="deviceType" value={formData.deviceType} onChange={handleInputChange} className={modalStyles.input} required>
                                                <option value="phone">Phone</option>
                                                <option value="laptop">Laptop</option>
                                                <option value="tablet">Tablet</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={modalStyles.label}>Device Model</label>
                                            <input
                                                type="text"
                                                name="deviceModel"
                                                value={formData.deviceModel}
                                                onChange={handleInputChange}
                                                placeholder="e.g., iPhone 13 Pro, Dell XPS 15"
                                                className={modalStyles.input}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 1 ? (
                                    <div className={modalStyles.grid}>
                                        <div>
                                            <label className={modalStyles.label}>Phone Number</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={modalStyles.input} required />
                                        </div>
                                    </div>
                                ) : (
                                    <div className={modalStyles.grid}>
                                        <div>
                                            <label className={modalStyles.label}>Issue Description</label>
                                            <textarea name="issueDescription" value={formData.issueDescription} onChange={handleInputChange} rows={3} className={modalStyles.input} required></textarea>
                                        </div>
                                        <div>
                                            <label className={modalStyles.label}>Preferred Service Date</label>
                                            <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleInputChange} className={modalStyles.input} required />
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className={modalStyles.footer}>
                                    <button type="button" onClick={onClose} className={modalStyles.button.secondary}>
                                        Cancel
                                    </button>
                                    {step === 1 ? (
                                        <button type="button" onClick={() => setStep(2)} className={modalStyles.button.primary}>
                                            Next
                                        </button>
                                    ) : (
                                        <>
                                            <button type="button" onClick={() => setStep(1)} className={modalStyles.button.secondary}>
                                                Back
                                            </button>
                                            <button type="submit" className={modalStyles.button.primary}>
                                                Submit
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BookRepair;
