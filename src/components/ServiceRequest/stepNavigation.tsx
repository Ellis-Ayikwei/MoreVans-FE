import React from 'react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

interface StepNavigationProps {
    onBack: () => void;
    onNext?: () => void;
    handleSubmit?: () => void;
    isLastStep?: boolean;
    isSubmitting?: boolean;
    nextLabel?: string;
    backLabel?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ onBack, onNext, handleSubmit, isLastStep = false, isSubmitting = false, nextLabel = 'Next', backLabel = 'Back' }) => {
    return (
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
                <IconArrowLeft className="mr-2" size={18} />
                {backLabel}
            </button>

            {isLastStep ? (
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            {nextLabel}
                            <IconArrowRight className="ml-2" size={18} />
                        </>
                    )}
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onNext}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                >
                    {nextLabel}
                    <IconArrowRight className="ml-2" size={18} />
                </button>
            )}
        </div>
    );
};

export default StepNavigation;
