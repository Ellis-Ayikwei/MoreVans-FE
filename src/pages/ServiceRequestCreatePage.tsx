import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContactDetailsStep, ServiceDetailsStep, JourneyPlanning, ScheduleStep } from '../components/ServiceRequest';
import { useDispatch } from 'react-redux';
import { createServiceRequest } from '../store/slices/serviceRequestSlice';

const ServiceRequestCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [step, setStep] = React.useState(1);
    const [formData, setFormData] = React.useState({
        contactDetails: {},
        serviceDetails: {},
        journeyDetails: {},
        scheduleDetails: {},
    });

    const handleNext = (data: any) => {
        setFormData((prev) => ({
            ...prev,
            ...data,
        }));
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleSubmit = async (data: any) => {
        try {
            const finalData = {
                ...formData,
                ...data,
            };
            await dispatch(createServiceRequest(finalData));
            navigate('/service-requests');
        } catch (error) {
            console.error('Error creating service request:', error);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <ContactDetailsStep onNext={handleNext} />;
            case 2:
                return <ServiceDetailsStep onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <JourneyPlanning onNext={handleNext} onBack={handleBack} />;
            case 4:
                return <ScheduleStep onSubmit={handleSubmit} onBack={handleBack} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Service Request</h1>
                <div className="flex space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Step {step} of 4</span>
                </div>
            </div>
            {renderStep()}
        </div>
    );
};

export default ServiceRequestCreatePage;
