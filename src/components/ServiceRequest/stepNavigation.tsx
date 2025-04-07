import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface StepNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  showBackButton?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  onBack,
  onNext,
  backLabel = 'Previous',
  nextLabel = 'Next',
  showBackButton = true,
  isLastStep = false,
  isSubmitting = false
}) => {
  return (
    <div className="flex justify-between mt-8">
      {showBackButton && (
        <button 
          type="button" 
          onClick={onBack} 
          className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          {backLabel}
        </button>
      )}
      
      <button 
        type={isLastStep ? "submit" : "button"} 
        onClick={isLastStep ? undefined : onNext}
        disabled={isSubmitting}
        className={`px-6 py-3 ${isLastStep ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} focus:ring-4 focus:ring-blue-300 focus:outline-none text-white font-medium rounded-lg flex items-center transition-colors duration-200 disabled:opacity-70`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Processing...
          </>
        ) : (
          <>
            {nextLabel}
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </>
        )}
      </button>
    </div>
  );
};

export default StepNavigation;