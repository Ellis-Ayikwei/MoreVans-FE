import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSave,
  faTimesCircle,
  faExclamationTriangle,
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faIdCard,
  faShieldAlt,
  faGlobe,
  faBuilding,
  faCalendarAlt,
  faUsers,
  faCheckCircle,
  faBan,
  faHistory,
  faLock
} from '@fortawesome/free-solid-svg-icons';

interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'user' | 'guest' | 'provider';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
  verificationStatus: 'verified' | 'unverified' | 'in_progress';
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  personalInfo?: {
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    idNumber?: string;
  };
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  securitySettings?: {
    twoFactorEnabled: boolean;
    passwordLastChanged: string;
    lastLoginIp: string;
  };
}

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserAccount>({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    joinDate: '',
    lastActive: '',
    verificationStatus: 'verified',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    personalInfo: {
      dateOfBirth: '',
      gender: '',
      nationality: '',
      idNumber: ''
    },
    notificationPreferences: {
      email: true,
      sms: true,
      push: true,
      marketing: false
    },
    securitySettings: {
      twoFactorEnabled: false,
      passwordLastChanged: '',
      lastLoginIp: ''
    }
  });
  
  useEffect(() => {
    fetchUserDetails();
  }, [id]);
  
  const fetchUserDetails = async () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data for user details
      const mockUser: UserAccount = {
        id: id || 'U-1001',
        fullName: 'Emma Wilson',
        email: 'emma.wilson@example.com',
        phone: '(555) 987-6543',
        role: 'user',
        status: 'active',
        joinDate: '2023-03-15T09:30:00',
        lastActive: '2023-06-21T16:45:00',
        verificationStatus: 'verified',
        address: {
          street: '123 Oak Avenue',
          city: 'San Francisco',
          state: 'California',
          country: 'United States',
          postalCode: '94107'
        },
        personalInfo: {
          dateOfBirth: '1988-05-12',
          gender: 'Female',
          nationality: 'American',
          idNumber: 'ID-54321'
        },
        notificationPreferences: {
          email: true,
          sms: true,
          push: false,
          marketing: false
        },
        securitySettings: {
          twoFactorEnabled: true,
          passwordLastChanged: '2023-05-10T08:15:00',
          lastLoginIp: '192.168.1.1'
        }
      };
      
      setFormData(mockUser);
      setLoading(false);
    }, 1000);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [objectName, fieldName] = name.split('.');
      setFormData({
        ...formData,
        [objectName]: {
          ...formData[objectName as keyof UserAccount],
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
  
  const handleCheckboxChange = (objectName: string, fieldName: string, checked: boolean) => {
    setFormData({
      ...formData,
      [objectName]: {
        ...formData[objectName as keyof UserAccount],
        [fieldName]: checked
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log('User data to save:', formData);
      setSaving(false);
      navigate(`/admin/users/${id}`);
    }, 1500);
  };
  
  const handleCancel = () => {
    navigate(`/admin/users/${id}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="px-4 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link to={`/admin/users/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h2 className="text-xl font-semibold">Edit User</h2>
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
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fullName">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-400" />
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
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="role">
                    <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-400" />
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="admin">Administrator</option>
                    <option value="user">User</option>
                    <option value="provider">Provider</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="status">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-gray-400" />
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
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="verificationStatus">
                    <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-gray-400" />
                    Verification Status
                  </label>
                  <select
                    id="verificationStatus"
                    name="verificationStatus"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.verificationStatus}
                    onChange={handleInputChange}
                  >
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                    <option value="in_progress">In Progress</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Joined:</span> {formatDate(formData.joinDate)}
                </div>
                <div>
                  <span className="font-medium">Last Active:</span> {formatDate(formData.lastActive)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Address Information Card */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold">Address Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address.street">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.address.street}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address.city">
                    City
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.address.city}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address.state">
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.address.state}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address.country">
                    Country
                  </label>
                  <input
                    type="text"
                    id="address.country"
                    name="address.country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.address.country}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address.postalCode">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="address.postalCode"
                    name="address.postalCode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Personal Information Card */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="personalInfo.dateOfBirth">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="personalInfo.dateOfBirth"
                    name="personalInfo.dateOfBirth"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.personalInfo?.dateOfBirth || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="personalInfo.gender">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
                    Gender
                  </label>
                  <select
                    id="personalInfo.gender"
                    name="personalInfo.gender"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.personalInfo?.gender || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="personalInfo.nationality">
                    <FontAwesomeIcon icon={faGlobe} className="mr-2 text-gray-400" />
                    Nationality
                  </label>
                  <input
                    type="text"
                    id="personalInfo.nationality"
                    name="personalInfo.nationality"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.personalInfo?.nationality || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="personalInfo.idNumber">
                    <FontAwesomeIcon icon={faIdCard} className="mr-2 text-gray-400" />
                    ID Number
                  </label>
                  <input
                    type="text"
                    id="personalInfo.idNumber"
                    name="personalInfo.idNumber"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.personalInfo?.idNumber || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Notification Preferences Card */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationPreferences.email"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.notificationPreferences?.email || false}
                    onChange={(e) => handleCheckboxChange('notificationPreferences', 'email', e.target.checked)}
                  />
                  <label htmlFor="notificationPreferences.email" className="ml-2 block text-sm text-gray-700">
                    Email Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationPreferences.sms"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.notificationPreferences?.sms || false}
                    onChange={(e) => handleCheckboxChange('notificationPreferences', 'sms', e.target.checked)}
                  />
                  <label htmlFor="notificationPreferences.sms" className="ml-2 block text-sm text-gray-700">
                    SMS Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationPreferences.push"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.notificationPreferences?.push || false}
                    onChange={(e) => handleCheckboxChange('notificationPreferences', 'push', e.target.checked)}
                  />
                  <label htmlFor="notificationPreferences.push" className="ml-2 block text-sm text-gray-700">
                    Push Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificationPreferences.marketing"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.notificationPreferences?.marketing || false}
                    onChange={(e) => handleCheckboxChange('notificationPreferences', 'marketing', e.target.checked)}
                  />
                  <label htmlFor="notificationPreferences.marketing" className="ml-2 block text-sm text-gray-700">
                    Marketing Communications
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Settings Card */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold">Security Settings</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="securitySettings.twoFactorEnabled"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={formData.securitySettings?.twoFactorEnabled || false}
                      onChange={(e) => handleCheckboxChange('securitySettings', 'twoFactorEnabled', e.target.checked)}
                    />
                    <label htmlFor="securitySettings.twoFactorEnabled" className="ml-2 block text-sm text-gray-700">
                      Two-Factor Authentication
                    </label>
                  </div>
                  
                  <button
                    type="button"
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    onClick={() => {
                      // Implement reset password functionality
                      alert('Password reset email would be sent to the user');
                    }}
                  >
                    <FontAwesomeIcon icon={faLock} className="mr-1" />
                    Reset Password
                  </button>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Password Last Changed:</span> {formatDate(formData.securitySettings?.passwordLastChanged || '')}
                  </div>
                  <div>
                    <span className="font-medium">Last Login IP:</span> {formData.securitySettings?.lastLoginIp || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
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
              disabled={saving}
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

export default UserEdit;