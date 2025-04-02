import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTruck, faUser, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const HowItWorks: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-6">How It Works</h1>
            <p className="text-gray-600 text-center mb-8">
                Our platform connects customers with drivers for efficient moving services. Here's how it works:
            </p>

            <div className="space-y-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        1. Customer Service Request Submission
                    </h2>
                    <FontAwesomeIcon icon={faUser} className="text-blue-600 mb-2" />
                    <p>
                        Customers fill out a service request form with details about their move, including pickup and dropoff locations, item types, preferred dates, and any special requirements.
                    </p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        2. Job Posting and Auction Process
                    </h2>
                    <FontAwesomeIcon icon={faClipboardList} className="text-blue-600 mb-2" />
                    <p>
                        The service request is posted as a job on the platform, where registered drivers can view and place bids to offer their services.
                    </p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        3. Driver Selection and Job Assignment
                    </h2>
                    <FontAwesomeIcon icon={faTruck} className="text-blue-600 mb-2" />
                    <p>
                        Customers review the bids and select a driver based on price, estimated time, and ratings. The job is then assigned to the chosen driver.
                    </p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        4. Job Completion and Feedback
                    </h2>
                    <FontAwesomeIcon icon={faBox} className="text-blue-600 mb-2" />
                    <p>
                        After the job is completed, customers confirm the service and provide feedback, helping maintain quality and assist future customers.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks; 