import React from 'react';
import ServiceRequestForm from './ServiceRequestForm';

const EditRequestForm: React.FC = () => {
  return <ServiceRequestForm isEditing={true} />;
};

export default EditRequestForm;