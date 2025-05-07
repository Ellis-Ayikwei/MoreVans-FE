import React from 'react';
import { Modal, Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeDraft } from '../store/slices/draftRequestsSlice';
import { IRootState } from '../store';
import { format } from 'date-fns';

interface DraftRequestsModalProps {
    visible: boolean;
    onClose: () => void;
}

interface DraftRequest {
    id: string;
    createdAt: string;
    lastModified: string;
    data: {
        service_type?: string;
    };
    source: 'local' | 'api';
}

const DraftRequestsModal: React.FC<DraftRequestsModalProps> = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const drafts = useSelector((state: IRootState) => state.draftRequests.drafts);

    const handleContinue = (id: string) => {
        navigate(`/service-request/${id}`);
        onClose();
    };

    const handleDelete = (id: string, source: 'local' | 'api') => {
        dispatch(removeDraft({ id, source }));
    };

    const columns: ColumnsType<DraftRequest> = [
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => format(new Date(date), 'PPp'),
        },
        {
            title: 'Last Modified',
            dataIndex: 'lastModified',
            key: 'lastModified',
            render: (date: string) => format(new Date(date), 'PPp'),
        },
        {
            title: 'Service Type',
            dataIndex: ['data', 'service_type'],
            key: 'service_type',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button type="primary" onClick={() => handleContinue(record.id)}>
                        Continue
                    </Button>
                    <Button danger onClick={() => handleDelete(record.id, record.source)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Modal title="Your Draft Requests" open={visible} onCancel={onClose} footer={null} width={800}>
            <Table<DraftRequest> dataSource={drafts} columns={columns} rowKey="id" pagination={false} />
        </Modal>
    );
};

export default DraftRequestsModal;
