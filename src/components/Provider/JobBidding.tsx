import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser, faStar } from '@fortawesome/free-solid-svg-icons';
import { Bid, Job } from '../../types/job';

interface JobBiddingProps {
    job: Job;
    onBidSubmit: (bid: Bid) => void;
}

const JobBidding: React.FC<JobBiddingProps> = ({ job, onBidSubmit }) => {
    const [bidAmount, setBidAmount] = useState<string>('');
    const [bidMessage, setBidMessage] = useState<string>('');
    const [isSubmittingBid, setIsSubmittingBid] = useState(false);

    const handleSubmitBid = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bidAmount || !job) return;

        setIsSubmittingBid(true);
        try {
            const newBid: Bid = {
                id: `BID-${Date.now()}`,
                provider: 'YOUR-PROVIDER-ID',
                amount: parseFloat(bidAmount),
                message: bidMessage,
                createdAt: new Date().toISOString(),
                status: 'pending',
            };

            onBidSubmit(newBid);

            // Clear the form
            setBidAmount('');
            setBidMessage('');
        } catch (error) {
            console.error('Error submitting bid:', error);
        } finally {
            setIsSubmittingBid(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Auction Details</h2>
            </div>

            <div className="px-6 py-4">
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bidding Ends</h3>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faClock} className="text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{job.bidding_end_time ? new Date(job.bidding_end_time).toLocaleDateString() : 'No deadline set'}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Current Bids</h3>
                    <div className="space-y-4">
                        {job.bids?.map((bid) => (
                            <div key={bid.id} className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">{bid.provider}</h4>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">£{bid.amount.toFixed(2)}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Bid placed {new Date(bid.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Place Your Bid</h3>
                    <form onSubmit={handleSubmitBid} className="space-y-4">
                        <div>
                            <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Bid Amount (£)
                            </label>
                            <input
                                type="number"
                                id="bidAmount"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="bidMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Message (optional)
                            </label>
                            <textarea
                                id="bidMessage"
                                value={bidMessage}
                                onChange={(e) => setBidMessage(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmittingBid}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm disabled:bg-blue-300 dark:disabled:bg-blue-900 disabled:cursor-not-allowed"
                            >
                                {isSubmittingBid ? 'Submitting...' : 'Submit Bid'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobBidding;
