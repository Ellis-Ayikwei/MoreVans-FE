import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSave,
  faTimesCircle,
  faExclamationTriangle,
  faPlus,
  faTrash,
  faCar,
  faUser,
  faIdCard,
  faCalendarAlt,
  faTruck,
  faEdit
} from '@fortawesome/free-solid-svg-icons';

interface Vehicle {
  id: string;
  type: string;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  capacity: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastInspection: string;
}

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'active' | 'inactive' | 'on_leave';
  joiningDate: string;
  emergencyContact: string;
  assignedVehicleId?: string;
}

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  verificationStatus: 'verified' | 'unverified' | 'in_progress';
  businessInfo?: {
    registrationNumber: string;
    taxId: string;
    businessType: string;
    foundedYear: number;
    website: string;
    operatingAreas: string[];
  };
  contactPerson?: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
  vehicles?: Vehicle[];
  drivers?: Driver[];
}

const ProviderEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Provider>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    verificationStatus: 'verified',
    businessInfo: {
      registrationNumber: '',
      taxId: '',
      businessType: '',
      foundedYear: new Date().getFullYear(),
      website: '',
      operatingAreas: []
    },
    contactPerson: {
      name: '',
      position: '',
      email: '',
      phone: ''
    },
    bankDetails: {
      accountHolder: '',
      accountNumber: '',
      bankName: '',
      routingNumber: ''
    },
    vehicles: [],
    drivers: []
  });
  const [operatingArea, setOperatingArea] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  
  // Vehicle form state
  const [vehicleForm, setVehicleForm] = useState<Vehicle>({
    id: '',
    type: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    registrationNumber: '',
    capacity: '',
    status: 'active',
    lastInspection: new Date().toISOString().split('T')[0]
  });
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicleIndex, setEditingVehicleIndex] = useState<number | null>(null);
  
  // Driver form state
  const [driverForm, setDriverForm] = useState<Driver>({
    id: '',
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: new Date().toISOString().split('T')[0],
    status: 'active',
    joiningDate: new Date().toISOString().split('T')[0],
    emergencyContact: '',
    assignedVehicleId: undefined
  });
  const [isAddingDriver, setIsAddingDriver] = useState(false);
  const [editingDriverIndex, setEditingDriverIndex] = useState<number | null>(null);
  
  useEffect(() => {
    fetchProviderDetails();
  }, [id]);
  
  const fetchProviderDetails = async () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data for provider details
      const mockProvider: Provider = {
        id: id || '',
        name: 'Quick Transport',
        email: 'support@quicktransport.com',
        phone: '(555) 234-5678',
        address: '2345 Moving Blvd, Chicago, IL 60007',
        status: 'active',
        verificationStatus: 'verified',
        businessInfo: {
          registrationNumber: 'BRN-789012',
          taxId: 'TAX-456789012',
          businessType: 'Corporation',
          foundedYear: 2017,
          website: 'https://quicktransport.com',
          operatingAreas: ['Chicago', 'Milwaukee', 'Detroit']
        },
        contactPerson: {
          name: 'Emma Rodriguez',
          position: 'Fleet Manager',
          email: 'emma@quicktransport.com',
          phone: '(555) 876-5432'
        },
        bankDetails: {
          accountHolder: 'Quick Transport Inc.',
          accountNumber: '****8765',
          bankName: 'Bank of America',
          routingNumber: '***4321'
        },
        vehicles: [
          {
            id: 'v1',
            type: 'Box Truck',
            make: 'Ford',
            model: 'E-450',
            year: 2021,
            registrationNumber: 'IL-12345',
            capacity: '16 ft / 3,000 lbs',
            status: 'active',
            lastInspection: '2025-01-15'
          },
          {
            id: 'v2',
            type: 'Van',
            make: 'Mercedes-Benz',
            model: 'Sprinter',
            year: 2022,
            registrationNumber: 'IL-67890',
            capacity: '12 ft / 2,000 lbs',
            status: 'active',
            lastInspection: '2025-02-20'
          }
        ],
        drivers: [
          {
            id: 'd1',
            name: 'John Smith',
            email: 'john@quicktransport.com',
            phone: '(555) 111-2222',
            licenseNumber: 'DL-987654',
            licenseExpiry: '2027-06-30',
            status: 'active',
            joiningDate: '2022-03-15',
            emergencyContact: '(555) 333-4444',
            assignedVehicleId: 'v1'
          },
          {
            id: 'd2',
            name: 'Sarah Johnson',
            email: 'sarah@quicktransport.com',
            phone: '(555) 555-6666',
            licenseNumber: 'DL-123456',
            licenseExpiry: '2026-04-22',
            status: 'active',
            joiningDate: '2023-01-10',
            emergencyContact: '(555) 777-8888',
            assignedVehicleId: 'v2'
          }
        ]
      };
      
      setFormData(mockProvider);
      setLoading(false);
    }, 1000);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [objectName, fieldName] = name.split('.');
      setFormData({
        ...formData,
        [objectName]: {
          ...formData[objectName as keyof Provider],
          [fieldName]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleAddOperatingArea = () => {
    if (operatingArea.trim() === '') return;
    
    if (formData.businessInfo && formData.businessInfo.operatingAreas) {
      setFormData({
        ...formData,
        businessInfo: {
          ...formData.businessInfo,
          operatingAreas: [...formData.businessInfo.operatingAreas, operatingArea.trim()]
        }
      });
    }
    
    setOperatingArea('');
  };
  
  const handleRemoveOperatingArea = (index: number) => {
    if (formData.businessInfo && formData.businessInfo.operatingAreas) {
      const updatedAreas = [...formData.businessInfo.operatingAreas];
      updatedAreas.splice(index, 1);
      
      setFormData({
        ...formData,
        businessInfo: {
          ...formData.businessInfo,
          operatingAreas: updatedAreas
        }
      });
    }
  };

  // Vehicle form handlers
  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleForm({
      ...vehicleForm,
      [name]: value
    });
  };

  const handleAddVehicle = () => {
    setIsAddingVehicle(true);
    setVehicleForm({
      id: `v${Date.now()}`,
      type: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      registrationNumber: '',
      capacity: '',
      status: 'active',
      lastInspection: new Date().toISOString().split('T')[0]
    });
    setEditingVehicleIndex(null);
  };

  const handleEditVehicle = (index: number) => {
    setIsAddingVehicle(true);
    setVehicleForm(formData.vehicles![index]);
    setEditingVehicleIndex(index);
  };

  const handleRemoveVehicle = (index: number) => {
    const updatedVehicles = [...(formData.vehicles || [])];
    const removedVehicleId = updatedVehicles[index].id;
    updatedVehicles.splice(index, 1);

    // Update any drivers assigned to this vehicle
    const updatedDrivers = formData.drivers?.map(driver => 
      driver.assignedVehicleId === removedVehicleId 
        ? { ...driver, assignedVehicleId: undefined } 
        : driver
    ) || [];
    
    setFormData({
      ...formData,
      vehicles: updatedVehicles,
      drivers: updatedDrivers
    });
  };

  const handleSaveVehicle = () => {
    if (editingVehicleIndex !== null) {
      // Update existing vehicle
      const updatedVehicles = [...(formData.vehicles || [])];
      updatedVehicles[editingVehicleIndex] = vehicleForm;
      setFormData({
        ...formData,
        vehicles: updatedVehicles
      });
    } else {
      // Add new vehicle
      setFormData({
        ...formData,
        vehicles: [...(formData.vehicles || []), vehicleForm]
      });
    }
    
    // Reset form and state
    setIsAddingVehicle(false);
    setEditingVehicleIndex(null);
  };

  const handleCancelVehicle = () => {
    setIsAddingVehicle(false);
    setEditingVehicleIndex(null);
  };

  // Driver form handlers
  const handleDriverInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDriverForm({
      ...driverForm,
      [name]: value
    });
  };

  const handleAddDriver = () => {
    setIsAddingDriver(true);
    setDriverForm({
      id: `d${Date.now()}`,
      name: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseExpiry: new Date().toISOString().split('T')[0],
      status: 'active',
      joiningDate: new Date().toISOString().split('T')[0],
      emergencyContact: '',
      assignedVehicleId: undefined
    });
    setEditingDriverIndex(null);
  };

  const handleEditDriver = (index: number) => {
    setIsAddingDriver(true);
    setDriverForm(formData.drivers![index]);
    setEditingDriverIndex(index);
  };

  const handleRemoveDriver = (index: number) => {
    const updatedDrivers = [...(formData.drivers || [])];
    updatedDrivers.splice(index, 1);
    
    setFormData({
      ...formData,
      drivers: updatedDrivers
    });
  };

  const handleSaveDriver = () => {
    if (editingDriverIndex !== null) {
      // Update existing driver
      const updatedDrivers = [...(formData.drivers || [])];
      updatedDrivers[editingDriverIndex] = driverForm;
      setFormData({
        ...formData,
        drivers: updatedDrivers
      });
    } else {
      // Add new driver
      setFormData({
        ...formData,
        drivers: [...(formData.drivers || []), driverForm]
      });
    }
    
    // Reset form and state
    setIsAddingDriver(false);
    setEditingDriverIndex(null);
  };

  const handleCancelDriver = () => {
    setIsAddingDriver(false);
    setEditingDriverIndex(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log('Provider data to save:', formData);
      setSaving(false);
      navigate(`/admin/providers/${id}`);
    }, 1500);
  };
  
  const handleCancel = () => {
    navigate(`/admin/providers/${id}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link to={`/admin/providers/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h2 className="text-xl font-semibold">Edit Provider</h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" />
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Information
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'vehicles'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('vehicles')}
          >
            Vehicles
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'drivers'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('drivers')}
          >
            Drivers
          </button>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <>
              {/* Basic Information Card */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="status">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="verificationStatus">
                        Verification Status
                      </label>
                      <select
                        id="verificationStatus"
                        name="verificationStatus"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.verificationStatus}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                        <option value="in_progress">In Progress</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Business Information Card */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold">Business Information</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="businessInfo.businessType">
                        Business Type
                      </label>
                      <input
                        type="text"
                        id="businessInfo.businessType"
                        name="businessInfo.businessType"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.businessInfo?.businessType || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="businessInfo.registrationNumber">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        id="businessInfo.registrationNumber"
                        name="businessInfo.registrationNumber"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.businessInfo?.registrationNumber || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="businessInfo.taxId">
                        Tax ID
                      </label>
                      <input
                        type="text"
                        id="businessInfo.taxId"
                        name="businessInfo.taxId"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.businessInfo?.taxId || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="businessInfo.foundedYear">
                        Founded Year
                      </label>
                      <input
                        type="number"
                        id="businessInfo.foundedYear"
                        name="businessInfo.foundedYear"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.businessInfo?.foundedYear || ''}
                        onChange={handleInputChange}
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="businessInfo.website">
                        Website
                      </label>
                      <input
                        type="url"
                        id="businessInfo.website"
                        name="businessInfo.website"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.businessInfo?.website || ''}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Operating Areas
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.businessInfo?.operatingAreas.map((area, index) => (
                          <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center">
                            <span>{area}</span>
                            <button
                              type="button"
                              className="ml-2 text-blue-500 hover:text-blue-700"
                              onClick={() => handleRemoveOperatingArea(index)}
                            >
                              <FontAwesomeIcon icon={faTimesCircle} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={operatingArea}
                          onChange={(e) => setOperatingArea(e.target.value)}
                          placeholder="Add an operating area"
                        />
                        <button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
                          onClick={handleAddOperatingArea}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Person Card */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold">Contact Person</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contactPerson.name">
                        Name
                      </label>
                      <input
                        type="text"
                        id="contactPerson.name"
                        name="contactPerson.name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.contactPerson?.name || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contactPerson.position">
                        Position
                      </label>
                      <input
                        type="text"
                        id="contactPerson.position"
                        name="contactPerson.position"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.contactPerson?.position || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contactPerson.email">
                        Email
                      </label>
                      <input
                        type="email"
                        id="contactPerson.email"
                        name="contactPerson.email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.contactPerson?.email || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contactPerson.phone">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="contactPerson.phone"
                        name="contactPerson.phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.contactPerson?.phone || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Banking Information Card */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold">Banking Information</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bankDetails.accountHolder">
                        Account Holder
                      </label>
                      <input
                        type="text"
                        id="bankDetails.accountHolder"
                        name="bankDetails.accountHolder"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.bankDetails?.accountHolder || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bankDetails.accountNumber">
                        Account Number
                      </label>
                      <input
                        type="text"
                        id="bankDetails.accountNumber"
                        name="bankDetails.accountNumber"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.bankDetails?.accountNumber || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bankDetails.bankName">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        id="bankDetails.bankName"
                        name="bankDetails.bankName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.bankDetails?.bankName || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bankDetails.routingNumber">
                        Routing Number
                      </label>
                      <input
                        type="text"
                        id="bankDetails.routingNumber"
                        name="bankDetails.routingNumber"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.bankDetails?.routingNumber || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Vehicles Tab */}
          {activeTab === 'vehicles' && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vehicle Management</h3>
                {!isAddingVehicle && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    onClick={handleAddVehicle}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Vehicle
                  </button>
                )}
              </div>
              
              <div className="p-6">
                {isAddingVehicle ? (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="text-md font-medium mb-4">{editingVehicleIndex !== null ? 'Edit Vehicle' : 'Add New Vehicle'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="type">
                          Vehicle Type
                        </label>
                        <select
                          id="type"
                          name="type"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={vehicleForm.type}
                          onChange={handleVehicleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Box Truck">Box Truck</option>
                          <option value="Van">Van</option>
                          <option value="Pickup Truck">Pickup Truck</option>
                          <option value="Moving Truck">Moving Truck</option>
                          <option value="Semi Truck">Semi Truck</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="make">
                          Make
                        </label>
                        <input
                          type="text"
                          id="make"
                          name="make"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={vehicleForm.make}
                          onChange={handleVehicleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="model">
                          Model
                        </label>
                        <input
                          type="text"
                          id="model"
                          name="model"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={vehicleForm.model}
                          onChange={handleVehicleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">
                          Year
                        </label>
                        <input
                          type="number"
                          id="year"
                          name="year"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={vehicleForm.year}
                          onChange={handleVehicleInputChange}
                          min="1990"
                          max={new Date().getFullYear() + 1}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="registrationNumber">
                          Registration Number
                        </label>
                        <input
                          type="text"
                          id="registrationNumber"
                          name="registrationNumber"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={vehicleForm.registrationNumber}
                          onChange={handleVehicleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="capacity">
                          Capacity
                        </label>
                        <input
                          type="text"
                          id="capacity"
                          name="capacity"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={vehicleForm.capacity}
                          onChange={handleVehicleInputChange}
                          placeholder="e.g. 16 ft / 3,000 lbs"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={vehicleForm.status}
                          onChange={handleVehicleInputChange}
                          required
                        >
                          <option value="active">Active</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastInspection">
                          Last Inspection Date
                        </label>
                        <input
                          type="date"
                          id="lastInspection"
                          name="lastInspection"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={vehicleForm.lastInspection}
                          onChange={handleVehicleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        onClick={handleCancelVehicle}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={handleSaveVehicle}
                      >
                        Save Vehicle
                      </button>
                    </div>
                  </div>
                ) : (
                  formData.vehicles && formData.vehicles.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FontAwesomeIcon icon={faTruck} className="text-gray-400 text-4xl mb-2" />
                      <p className="text-gray-500">No vehicles added yet</p>
                      <button
                        type="button"
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                        onClick={handleAddVehicle}
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add First Vehicle
                      </button>
                    </div>
                  )
                )}
                
                {!isAddingVehicle && formData.vehicles && formData.vehicles.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vehicle
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Registration
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Capacity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.vehicles.map((vehicle, index) => (
                          <tr key={vehicle.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <FontAwesomeIcon icon={faTruck} className="text-gray-500" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{vehicle.type}</div>
                                  <div className="text-sm text-gray-500">{vehicle.make} {vehicle.model} ({vehicle.year})</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{vehicle.registrationNumber}</div>
                              <div className="text-xs text-gray-500">Last inspection: {new Date(vehicle.lastInspection).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {vehicle.capacity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                                vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {vehicle.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                onClick={() => handleEditVehicle(index)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleRemoveVehicle(index)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Drivers Tab */}
          {activeTab === 'drivers' && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Driver Management</h3>
                {!isAddingDriver && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    onClick={handleAddDriver}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Driver
                  </button>
                )}
              </div>
              
              <div className="p-6">
                {isAddingDriver ? (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="text-md font-medium mb-4">{editingDriverIndex !== null ? 'Edit Driver' : 'Add New Driver'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={driverForm.name}
                          onChange={handleDriverInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={driverForm.email}
                          onChange={handleDriverInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={driverForm.phone}
                          onChange={handleDriverInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="licenseNumber">
                          License Number
                        </label>
                        <input
                          type="text"
                          id="licenseNumber"
                          name="licenseNumber"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={driverForm.licenseNumber}
                          onChange={handleDriverInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="licenseExpiry">
                          License Expiry Date
                        </label>
                        <input
                          type="date"
                          id="licenseExpiry"
                          name="licenseExpiry"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={driverForm.licenseExpiry}
                          onChange={handleDriverInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={driverForm.status}
                          onChange={handleDriverInputChange}
                          required
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="on_leave">On Leave</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="joiningDate">
                          Joining Date
                        </label>
                        <input
                          type="date"
                          id="joiningDate"
                          name="joiningDate"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={driverForm.joiningDate}
                          onChange={handleDriverInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="emergencyContact">
                          Emergency Contact
                        </label>
                        <input
                          type="tel"
                          id="emergencyContact"
                          name="emergencyContact"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={driverForm.emergencyContact}
                          onChange={handleDriverInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assignedVehicleId">
                          Assigned Vehicle
                        </label>
                        <select
                          id="assignedVehicleId"
                          name="assignedVehicleId"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={driverForm.assignedVehicleId || ''}
                          onChange={handleDriverInputChange}
                        >
                          <option value="">None</option>
                          {formData.vehicles?.map(vehicle => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.make} {vehicle.model} ({vehicle.registrationNumber})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        onClick={handleCancelDriver}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={handleSaveDriver}
                      >
                        Save Driver
                      </button>
                    </div>
                  </div>
                ) : (
                  formData.drivers && formData.drivers.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400 text-4xl mb-2" />
                      <p className="text-gray-500">No drivers added yet</p>
                      <button
                        type="button"
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                        onClick={handleAddDriver}
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add First Driver
                      </button>
                    </div>
                  )
                )}
                
                {!isAddingDriver && formData.drivers && formData.drivers.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Driver
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            License
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assigned Vehicle
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.drivers.map((driver, index) => (
                          <tr key={driver.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                  <div className="text-sm text-gray-500">{driver.email}</div>
                                  <div className="text-xs text-gray-500">{driver.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{driver.licenseNumber}</div>
                              <div className="text-xs text-gray-500">Expires: {new Date(driver.licenseExpiry).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                driver.status === 'active' ? 'bg-green-100 text-green-800' :
                                driver.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {driver.status === 'on_leave' ? 'On Leave' : driver.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {driver.assignedVehicleId ? (
                                (() => {
                                  const assignedVehicle = formData.vehicles?.find(v => v.id === driver.assignedVehicleId);
                                  return assignedVehicle ? 
                                    `${assignedVehicle.make} ${assignedVehicle.model} (${assignedVehicle.registrationNumber})` : 
                                    'Unknown Vehicle';
                                })()
                              ) : (
                                <span className="text-gray-400">None assigned</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                onClick={() => handleEditDriver(index)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleRemoveDriver(index)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Form Actions - always visible */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              disabled={saving || isAddingVehicle || isAddingDriver}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProviderEdit;