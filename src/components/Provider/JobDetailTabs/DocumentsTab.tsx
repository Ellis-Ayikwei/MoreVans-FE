import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFileInvoice, faFileContract, faFileSignature, faFileUpload, faDownload, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Job } from '../../../types/job';

interface DocumentsTabProps {
    job: Job;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ job }) => {
    const getDocumentIcon = (type: string) => {
        switch (type) {
            case 'invoice':
                return faFileInvoice;
            case 'contract':
                return faFileContract;
            case 'signature':
                return faFileSignature;
            default:
                return faFileAlt;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Job Documents</h2>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center">
                        <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                        Upload Document
                    </button>
                </div>

                {/* Document categories */}
                <div className="space-y-6">
                    {/* Invoices */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <FontAwesomeIcon icon={faFileInvoice} className="text-blue-500 mr-2" />
                            Invoices
                        </h3>
                        <div className="space-y-3">
                            {job.documents
                                ?.filter((doc) => doc.type === 'invoice')
                                .map((doc, index) => (
                                    <div key={doc.id || index} className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                                    <FontAwesomeIcon icon={getDocumentIcon(doc.type)} className="text-blue-500 dark:text-blue-400 text-lg" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {formatFileSize(doc.size)} • Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                                    <FontAwesomeIcon icon={faDownload} />
                                                </button>
                                                <button className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Contracts */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <FontAwesomeIcon icon={faFileContract} className="text-purple-500 mr-2" />
                            Contracts
                        </h3>
                        <div className="space-y-3">
                            {job.documents
                                ?.filter((doc) => doc.type === 'contract')
                                .map((doc, index) => (
                                    <div key={doc.id || index} className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                                    <FontAwesomeIcon icon={getDocumentIcon(doc.type)} className="text-purple-500 dark:text-purple-400 text-lg" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {formatFileSize(doc.size)} • Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                                    <FontAwesomeIcon icon={faDownload} />
                                                </button>
                                                <button className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Other Documents */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <FontAwesomeIcon icon={faFileAlt} className="text-gray-500 mr-2" />
                            Other Documents
                        </h3>
                        <div className="space-y-3">
                            {job.documents
                                ?.filter((doc) => !['invoice', 'contract'].includes(doc.type))
                                .map((doc, index) => (
                                    <div key={doc.id || index} className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                    <FontAwesomeIcon icon={getDocumentIcon(doc.type)} className="text-gray-500 dark:text-gray-400 text-lg" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {formatFileSize(doc.size)} • Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                                    <FontAwesomeIcon icon={faDownload} />
                                                </button>
                                                <button className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentsTab;
