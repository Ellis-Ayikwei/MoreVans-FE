import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faBell,
  faCreditCard,
  faShieldAlt,
  faPaintBrush,
  faUserLock,
  faGlobe,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faSave,
  faUndoAlt,
  faDatabase,
  faEnvelope,
  faMobileAlt,
  faServer,
  faFileAlt,
  faCloudUploadAlt,
  faMoneyBillWave,
  faLock,
  faCode
} from '@fortawesome/free-solid-svg-icons';

// Define system settings types
interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  contact_phone: string;
  defaultLanguage: string;
  timezone: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

interface NotificationSettings {
  adminEmailNotifications: boolean;
  providerEmailNotifications: boolean;
  userEmailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  emailServiceProvider: string;
  smtpServer: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  smsApiKey: string;
  smsFrom: string;
}

interface PaymentSettings {
  currencyCode: string;
  currencySymbol: string;
  paymentGateways: {
    id: string;
    name: string;
    isActive: boolean;
    credentials: {
      apiKey?: string;
      secretKey?: string;
      merchantId?: string;
    };
    testMode: boolean;
  }[];
  serviceFeePercentage: number;
  minimumWithdrawalAmount: number;
  automaticPayouts: boolean;
  payoutSchedule: string;
}

interface SecuritySettings {
  twoFactorAuthRequired: boolean;
  passwordMinLength: number;
  passwordRequiresSpecialChars: boolean;
  passwordRequiresNumbers: boolean;
  passwordRequiresUppercase: boolean;
  accountLockoutAttempts: number;
  sessionTimeout: number; // in minutes
  ipRestriction: boolean;
  allowedIPs: string[];
}

interface AppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  footerText: string;
  customCss: string;
  customJs: string;
  homePageLayout: string;
}

interface RolePermission {
  id: string;
  role: string;
  permissions: {
    dashboard: boolean;
    users: boolean;
    providers: boolean;
    bookings: boolean;
    revenue: boolean;
    disputes: boolean;
    settings: boolean;
    createUser: boolean;
    deleteUser: boolean;
    viewTransactions: boolean;
  };
}

interface SystemSettings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  payment: PaymentSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;
  permissions: RolePermission[];
}

// Available languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' }
];

// Available timezones
const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
  { value: 'America/Chicago', label: 'Central Time (CST/CDT)' },
  { value: 'America/Denver', label: 'Mountain Time (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' }
];

// Available payment gateways
const availablePaymentGateways = [
  { id: 'stripe', name: 'Stripe' },
  { id: 'paypal', name: 'PayPal' },
  { id: 'square', name: 'Square' },
  { id: 'razorpay', name: 'Razorpay' },
  { id: 'authorize_net', name: 'Authorize.net' }
];

// Available email providers
const emailProviders = [
  { value: 'smtp', label: 'SMTP Server' },
  { value: 'sendgrid', label: 'SendGrid' },
  { value: 'mailchimp', label: 'Mailchimp' },
  { value: 'aws_ses', label: 'AWS SES' }
];

// Available roles
const roles = [
  { id: 'super_admin', name: 'Super Admin' },
  { id: 'admin', name: 'Admin' },
  { id: 'moderator', name: 'Moderator' },
  { id: 'support', name: 'Support Agent' }
];

// Create Reusable Components
const SectionHeader = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold flex items-center text-gray-800">
      <FontAwesomeIcon icon={icon} className="mr-2 text-blue-600" />
      {title}
    </h2>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

const ToggleSwitch = ({ 
  label, 
  checked, 
  onChange,
  description = ''
}: { 
  label: string, 
  checked: boolean, 
  onChange: (checked: boolean) => void,
  description?: string
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div>
      <label className="font-medium text-gray-800">{label}</label>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
        className="sr-only peer" 
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

const TextInput = ({ 
  label, 
  value, 
  onChange,
  name = '',
  placeholder = '',
  type = 'text',
  required = false,
  description = ''
}: { 
  label: string, 
  value: string, 
  onChange: (value: string) => void,
  name?: string,
  placeholder?: string,
  type?: string,
  required?: boolean,
  description?: string
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
    {description && <p className="text-xs text-gray-500 mb-1">{description}</p>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const TextArea = ({ 
  label, 
  value, 
  onChange, 
  rows = 3,
  placeholder = '',
  description = ''
}: { 
  label: string, 
  value: string, 
  onChange: (value: string) => void,
  rows?: number,
  placeholder?: string,
  description?: string
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {description && <p className="text-xs text-gray-500 mb-1">{description}</p>}
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const SelectField = ({ 
  label, 
  value, 
  onChange, 
  options,
  description = ''
}: { 
  label: string, 
  value: string, 
  onChange: (value: string) => void,
  options: { value: string, label: string }[],
  description?: string
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {description && <p className="text-xs text-gray-500 mb-1">{description}</p>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxInput = ({ 
  label, 
  checked, 
  onChange
}: { 
  label: string, 
  checked: boolean, 
  onChange: (checked: boolean) => void 
}) => (
  <label className="flex items-center space-x-2 mb-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

const Alert = ({ 
  type, 
  message 
}: { 
  type: 'success' | 'error' | 'warning' | 'info', 
  message: string 
}) => {
  const icons = {
    success: faCheckCircle,
    error: faExclamationTriangle,
    warning: faExclamationTriangle,
    info: faInfoCircle
  };
  
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };
  
  return (
    <div className={`p-4 rounded-md border ${colors[type]} mb-4 flex items-start`}>
      <FontAwesomeIcon icon={icons[type]} className="mr-3 mt-0.5" />
      <div>{message}</div>
    </div>
  );
};

const PermissionTable = ({ 
  roles, 
  permissions, 
  onChange 
}: { 
  roles: { id: string, name: string }[], 
  permissions: RolePermission[],
  onChange: (updatedPermissions: RolePermission[]) => void 
}) => {
  // All permission keys
  const permissionKeys = [
    { key: 'dashboard', label: 'View Dashboard' },
    { key: 'users', label: 'Manage Users' },
    { key: 'providers', label: 'Manage Providers' },
    { key: 'bookings', label: 'Manage Bookings' },
    { key: 'revenue', label: 'View Revenue' },
    { key: 'disputes', label: 'Handle Disputes' },
    { key: 'settings', label: 'Access Settings' },
    { key: 'createUser', label: 'Create Users' },
    { key: 'deleteUser', label: 'Delete Users' },
    { key: 'viewTransactions', label: 'View Transactions' }
  ];

  const handlePermissionChange = (roleId: string, permKey: string, value: boolean) => {
    const updatedPermissions = permissions.map(p => {
      if (p.id === roleId) {
        return {
          ...p,
          permissions: {
            ...p.permissions,
            [permKey]: value
          }
        };
      }
      return p;
    });
    
    onChange(updatedPermissions);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
            {roles.map(role => (
              <th key={role.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {role.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {permissionKeys.map(({ key, label }) => (
            <tr key={key}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {label}
              </td>
              {roles.map(role => {
                const rolePermission = permissions.find(p => p.id === role.id);
                const hasPermission = rolePermission?.permissions[key as keyof typeof rolePermission.permissions] || false;
                
                return (
                  <td key={`${role.id}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <input
                      type="checkbox"
                      checked={hasPermission}
                      onChange={(e) => handlePermissionChange(role.id, key, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      disabled={role.id === 'super_admin'} // Super admin has all permissions
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main component
const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    general: {
      siteName: 'MoreVans',
      siteDescription: 'The ultimate platform for van and moving services',
      supportEmail: 'support@morevans.com',
      contact_phone: '+1-555-123-4567',
      defaultLanguage: 'en',
      timezone: 'UTC',
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing maintenance. Please check back later.'
    },
    notifications: {
      adminEmailNotifications: true,
      providerEmailNotifications: true,
      userEmailNotifications: true,
      smsNotifications: false,
      pushNotifications: false,
      emailServiceProvider: 'smtp',
      smtpServer: 'smtp.example.com',
      smtpPort: '587',
      smtpUsername: 'notifications@morevans.com',
      smtpPassword: '',
      smsApiKey: '',
      smsFrom: 'MoreVans'
    },
    payment: {
      currencyCode: 'USD',
      currencySymbol: '$',
      paymentGateways: [
        {
          id: 'stripe',
          name: 'Stripe',
          isActive: true,
          credentials: {
            apiKey: '',
            secretKey: ''
          },
          testMode: true
        },
        {
          id: 'paypal',
          name: 'PayPal',
          isActive: false,
          credentials: {
            apiKey: '',
            secretKey: ''
          },
          testMode: true
        }
      ],
      serviceFeePercentage: 10,
      minimumWithdrawalAmount: 50,
      automaticPayouts: false,
      payoutSchedule: 'weekly'
    },
    security: {
      twoFactorAuthRequired: false,
      passwordMinLength: 8,
      passwordRequiresSpecialChars: true,
      passwordRequiresNumbers: true,
      passwordRequiresUppercase: true,
      accountLockoutAttempts: 5,
      sessionTimeout: 60,
      ipRestriction: false,
      allowedIPs: []
    },
    appearance: {
      primaryColor: '#dc711a',
      secondaryColor: '#1a56db',
      logoUrl: '/logo192.png',
      faviconUrl: '/favicon.png',
      footerText: '© 2025 MoreVans. All rights reserved.',
      customCss: '',
      customJs: '',
      homePageLayout: 'default'
    },
    permissions: [
      {
        id: 'super_admin',
        role: 'Super Admin',
        permissions: {
          dashboard: true,
          users: true,
          providers: true,
          bookings: true,
          revenue: true,
          disputes: true,
          settings: true,
          createUser: true,
          deleteUser: true,
          viewTransactions: true
        }
      },
      {
        id: 'admin',
        role: 'Admin',
        permissions: {
          dashboard: true,
          users: true,
          providers: true,
          bookings: true,
          revenue: true,
          disputes: true,
          settings: false,
          createUser: true,
          deleteUser: false,
          viewTransactions: true
        }
      },
      {
        id: 'moderator',
        role: 'Moderator',
        permissions: {
          dashboard: true,
          users: false,
          providers: true,
          bookings: true,
          revenue: false,
          disputes: true,
          settings: false,
          createUser: false,
          deleteUser: false,
          viewTransactions: false
        }
      },
      {
        id: 'support',
        role: 'Support Agent',
        permissions: {
          dashboard: true,
          users: false,
          providers: false,
          bookings: true,
          revenue: false,
          disputes: true,
          settings: false,
          createUser: false,
          deleteUser: false,
          viewTransactions: false
        }
      }
    ]
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update settings handler
  const updateSettings = <T extends keyof SystemSettings>(
    section: T,
    field: keyof SystemSettings[T],
    value: any
  ) => {
    setSystemSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    setUnsavedChanges(true);
  };

  // Handle adding a new payment gateway
  const addPaymentGateway = (gatewayId: string) => {
    const gateway = availablePaymentGateways.find(g => g.id === gatewayId);
    if (!gateway) return;
    
    if (systemSettings.payment.paymentGateways.some(g => g.id === gatewayId)) {
      return; // Gateway already exists
    }
    
    const newGateway = {
      id: gateway.id,
      name: gateway.name,
      isActive: false,
      credentials: {
        apiKey: '',
        secretKey: ''
      },
      testMode: true
    };
    
    setSystemSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        paymentGateways: [...prev.payment.paymentGateways, newGateway]
      }
    }));
    
    setUnsavedChanges(true);
  };

  // Handle removing a payment gateway
  const removePaymentGateway = (gatewayId: string) => {
    setSystemSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        paymentGateways: prev.payment.paymentGateways.filter(g => g.id !== gatewayId)
      }
    }));
    
    setUnsavedChanges(true);
  };

  // Handle updating a payment gateway
  const updatePaymentGateway = (gatewayId: string, field: string, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        paymentGateways: prev.payment.paymentGateways.map(g => {
          if (g.id === gatewayId) {
            if (field.startsWith('credentials.')) {
              const credentialKey = field.split('.')[1];
              return {
                ...g,
                credentials: {
                  ...g.credentials,
                  [credentialKey]: value
                }
              };
            }
            return {
              ...g,
              [field]: value
            };
          }
          return g;
        })
      }
    }));
    
    setUnsavedChanges(true);
  };

  // Handle updating role permissions
  const updatePermissions = (updatedPermissions: RolePermission[]) => {
    setSystemSettings(prev => ({
      ...prev,
      permissions: updatedPermissions
    }));
    
    setUnsavedChanges(true);
  };

  // Handle adding an IP to the allowed IPs list
  const addAllowedIP = (ip: string) => {
    if (!ip.trim() || systemSettings.security.allowedIPs.includes(ip.trim())) return;
    
    setSystemSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        allowedIPs: [...prev.security.allowedIPs, ip.trim()]
      }
    }));
    
    setUnsavedChanges(true);
  };

  // Handle removing an IP from the allowed IPs list
  const removeAllowedIP = (ip: string) => {
    setSystemSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        allowedIPs: prev.security.allowedIPs.filter(i => i !== ip)
      }
    }));
    
    setUnsavedChanges(true);
  };

  // Handle saving the settings
  const saveSettings = async () => {
    setIsSubmitting(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      setSaveMessage({
        type: 'success',
        message: 'Settings saved successfully'
      });
      
      setUnsavedChanges(false);
      
      // Hide the success message after a few seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 5000);
    } catch (error) {
      setSaveMessage({
        type: 'error',
        message: 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation before leaving with unsaved changes
  useEffect(() => {
    if (!unsavedChanges) return;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      const message = "You have unsaved changes. Are you sure you want to leave?";
      e.returnValue = message;
      return message;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => window.location.reload()}
            disabled={!unsavedChanges || isSubmitting}
            className={`px-4 py-2 rounded-md flex items-center ${
              !unsavedChanges || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FontAwesomeIcon icon={faUndoAlt} className="mr-2" />
            Discard Changes
          </button>
          <button
            onClick={saveSettings}
            disabled={!unsavedChanges || isSubmitting}
            className={`px-4 py-2 rounded-md flex items-center ${
              !unsavedChanges || isSubmitting
                ? 'bg-blue-300 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {saveMessage && (
        <Alert
          type={saveMessage.type}
          message={saveMessage.message}
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faBell} className="mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'payment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
              Payment
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'appearance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faPaintBrush} className="mr-2" />
              Appearance
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'permissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faUserLock} className="mr-2" />
              Permissions
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-8">
              <SectionHeader
                icon={faGlobe}
                title="General System Settings"
                description="Configure basic information about your application"
              />

              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    label="Site Name"
                    value={systemSettings.general.siteName}
                    onChange={(value) => updateSettings('general', 'siteName', value)}
                    placeholder="Your site name"
                    required
                  />
                  
                  <TextInput
                    label="Site Description"
                    value={systemSettings.general.siteDescription}
                    onChange={(value) => updateSettings('general', 'siteDescription', value)}
                    placeholder="Brief description of your site"
                  />
                  
                  <TextInput
                    label="Support Email"
                    type="email"
                    value={systemSettings.general.supportEmail}
                    onChange={(value) => updateSettings('general', 'supportEmail', value)}
                    placeholder="support@example.com"
                    required
                  />
                  
                  <TextInput
                    label="Contact Phone"
                    value={systemSettings.general.contact_phone}
                    onChange={(value) => updateSettings('general', 'contact_phone', value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </Card>

              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    label="Default Language"
                    value={systemSettings.general.defaultLanguage}
                    onChange={(value) => updateSettings('general', 'defaultLanguage', value)}
                    options={languages.map(lang => ({ value: lang.code, label: lang.name }))}
                  />
                  
                  <SelectField
                    label="Default Timezone"
                    value={systemSettings.general.timezone}
                    onChange={(value) => updateSettings('general', 'timezone', value)}
                    options={timezones}
                  />
                </div>
              </Card>

              <Card>
                <ToggleSwitch
                  label="Maintenance Mode"
                  checked={systemSettings.general.maintenanceMode}
                  onChange={(value) => updateSettings('general', 'maintenanceMode', value)}
                  description="Enable to temporarily disable public access to the site"
                />
                
                {systemSettings.general.maintenanceMode && (
                  <div className="mt-4">
                    <TextArea
                      label="Maintenance Message"
                      value={systemSettings.general.maintenanceMessage}
                      onChange={(value) => updateSettings('general', 'maintenanceMessage', value)}
                      placeholder="Message to display during maintenance"
                    />
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <SectionHeader
                icon={faBell}
                title="Notification Settings"
                description="Configure email and SMS notification preferences"
              />

              <Card>
                <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <ToggleSwitch
                    label="Admin Notifications"
                    checked={systemSettings.notifications.adminEmailNotifications}
                    onChange={(value) => updateSettings('notifications', 'adminEmailNotifications', value)}
                    description="Send email notifications to administrators"
                  />
                  
                  <ToggleSwitch
                    label="Provider Notifications"
                    checked={systemSettings.notifications.providerEmailNotifications}
                    onChange={(value) => updateSettings('notifications', 'providerEmailNotifications', value)}
                    description="Send email notifications to service providers"
                  />
                  
                  <ToggleSwitch
                    label="User Notifications"
                    checked={systemSettings.notifications.userEmailNotifications}
                    onChange={(value) => updateSettings('notifications', 'userEmailNotifications', value)}
                    description="Send email notifications to regular users"
                  />
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium mb-4">SMS & Push Notifications</h3>
                <div className="space-y-4">
                  <ToggleSwitch
                    label="SMS Notifications"
                    checked={systemSettings.notifications.smsNotifications}
                    onChange={(value) => updateSettings('notifications', 'smsNotifications', value)}
                    description="Send SMS notifications for important updates"
                  />
                  
                  <ToggleSwitch
                    label="Push Notifications"
                    checked={systemSettings.notifications.pushNotifications}
                    onChange={(value) => updateSettings('notifications', 'pushNotifications', value)}
                    description="Send mobile app push notifications"
                  />
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium mb-4">Email Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <SelectField
                    label="Email Service Provider"
                    value={systemSettings.notifications.emailServiceProvider}
                    onChange={(value) => updateSettings('notifications', 'emailServiceProvider', value)}
                    options={emailProviders}
                  />
                </div>
                
                {systemSettings.notifications.emailServiceProvider === 'smtp' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                      label="SMTP Server"
                      value={systemSettings.notifications.smtpServer}
                      onChange={(value) => updateSettings('notifications', 'smtpServer', value)}
                      placeholder="smtp.example.com"
                    />
                    
                    <TextInput
                      label="SMTP Port"
                      value={systemSettings.notifications.smtpPort}
                      onChange={(value) => updateSettings('notifications', 'smtpPort', value)}
                      placeholder="587"
                    />
                    
                    <TextInput
                      label="SMTP Username"
                      value={systemSettings.notifications.smtpUsername}
                      onChange={(value) => updateSettings('notifications', 'smtpUsername', value)}
                      placeholder="username@example.com"
                    />
                    
                    <TextInput
                      label="SMTP Password"
                      type="password"
                      value={systemSettings.notifications.smtpPassword}
                      onChange={(value) => updateSettings('notifications', 'smtpPassword', value)}
                      placeholder="••••••••"
                    />
                  </div>
                )}
                
                {(systemSettings.notifications.emailServiceProvider === 'sendgrid' || 
                  systemSettings.notifications.emailServiceProvider === 'mailchimp' || 
                  systemSettings.notifications.emailServiceProvider === 'aws_ses') && (
                  <div className="grid grid-cols-1 gap-6">
                    <TextInput
                      label="API Key"
                      type="password"
                      value={systemSettings.notifications.smtpPassword} // Reusing the same field
                      onChange={(value) => updateSettings('notifications', 'smtpPassword', value)}
                      placeholder="••••••••"
                    />
                  </div>
                )}
              </Card>

              {systemSettings.notifications.smsNotifications && (
                <Card>
                  <h3 className="text-lg font-medium mb-4">SMS Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                      label="SMS API Key"
                      type="password"
                      value={systemSettings.notifications.smsApiKey}
                      onChange={(value) => updateSettings('notifications', 'smsApiKey', value)}
                      placeholder="••••••••"
                    />
                    
                    <TextInput
                      label="SMS From Name/Number"
                      value={systemSettings.notifications.smsFrom}
                      onChange={(value) => updateSettings('notifications', 'smsFrom', value)}
                      placeholder="MoreVans"
                    />
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-8">
              <SectionHeader
                icon={faMoneyBillWave}
                title="Payment Settings"
                description="Configure payment gateways and financial settings"
              />

              <Card>
                <h3 className="text-lg font-medium mb-4">Currency Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    label="Currency Code"
                    value={systemSettings.payment.currencyCode}
                    onChange={(value) => updateSettings('payment', 'currencyCode', value)}
                    placeholder="USD"
                  />
                  
                  <TextInput
                    label="Currency Symbol"
                    value={systemSettings.payment.currencySymbol}
                    onChange={(value) => updateSettings('payment', 'currencySymbol', value)}
                    placeholder="$"
                  />
                  
                  <TextInput
                    label="Service Fee Percentage"
                    type="number"
                    value={systemSettings.payment.serviceFeePercentage.toString()}
                    onChange={(value) => updateSettings('payment', 'serviceFeePercentage', parseFloat(value) || 0)}
                    placeholder="10"
                  />
                  
                  <TextInput
                    label="Minimum Withdrawal Amount"
                    type="number"
                    value={systemSettings.payment.minimumWithdrawalAmount.toString()}
                    onChange={(value) => updateSettings('payment', 'minimumWithdrawalAmount', parseFloat(value) || 0)}
                    placeholder="50"
                  />
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium mb-4">Payout Settings</h3>
                <div className="space-y-4">
                  <ToggleSwitch
                    label="Automatic Payouts"
                    checked={systemSettings.payment.automaticPayouts}
                    onChange={(value) => updateSettings('payment', 'automaticPayouts', value)}
                    description="Automatically process payouts to providers"
                  />
                  
                  <div className="pt-2">
                    <SelectField
                      label="Payout Schedule"
                      value={systemSettings.payment.payoutSchedule}
                      onChange={(value) => updateSettings('payment', 'payoutSchedule', value)}
                      options={[
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'biweekly', label: 'Bi-weekly' },
                        { value: 'monthly', label: 'Monthly' }
                      ]}
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium mb-4">Payment Gateways</h3>
                
                {systemSettings.payment.paymentGateways.map((gateway) => (
                  <div key={gateway.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">{gateway.name}</h4>
                      <div className="flex items-center space-x-4">
                        <ToggleSwitch
                          label="Active"
                          checked={gateway.isActive}
                          onChange={(value) => updatePaymentGateway(gateway.id, 'isActive', value)}
                          description=""
                        />
                        <button
                          onClick={() => removePaymentGateway(gateway.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove gateway"
                        >
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        label="API Key"
                        type="password"
                        value={gateway.credentials.apiKey || ''}
                        onChange={(value) => updatePaymentGateway(gateway.id, 'credentials.apiKey', value)}
                        placeholder="••••••••"
                      />
                      
                      <TextInput
                        label="Secret Key"
                        type="password"
                        value={gateway.credentials.secretKey || ''}
                        onChange={(value) => updatePaymentGateway(gateway.id, 'credentials.secretKey', value)}
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <ToggleSwitch
                        label="Test Mode"
                        checked={gateway.testMode}
                        onChange={(value) => updatePaymentGateway(gateway.id, 'testMode', value)}
                        description="Use test credentials instead of live credentials"
                      />
                    </div>
                  </div>
                ))}
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Payment Gateway</label>
                  <div className="flex space-x-2">
                    <select
                      className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => {
                        if (e.target.value) {
                          addPaymentGateway(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select gateway to add</option>
                      {availablePaymentGateways
                        .filter(g => !systemSettings.payment.paymentGateways.some(pg => pg.id === g.id))
                        .map(gateway => (
                          <option key={gateway.id} value={gateway.id}>{gateway.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <SectionHeader
                icon={faShieldAlt}
                title="Security Settings"
                description="Configure password policies, authentication methods, and other security features"
              />

              <Card>
                <h3 className="text-lg font-medium mb-4">Authentication Settings</h3>
                <div className="space-y-4">
                  <ToggleSwitch
                    label="Require Two-Factor Authentication"
                    checked={systemSettings.security.twoFactorAuthRequired}
                    onChange={(value) => updateSettings('security', 'twoFactorAuthRequired', value)}
                    description="Force all administrative users to use 2FA"
                  />
                  
                  <div className="pt-2">
                    <TextInput
                      label="Session Timeout (minutes)"
                      type="number"
                      value={systemSettings.security.sessionTimeout.toString()}
                      onChange={(value) => updateSettings('security', 'sessionTimeout', parseInt(value) || 60)}
                      placeholder="60"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <TextInput
                      label="Account Lockout After Failed Attempts"
                      type="number"
                      value={systemSettings.security.accountLockoutAttempts.toString()}
                      onChange={(value) => updateSettings('security', 'accountLockoutAttempts', parseInt(value) || 5)}
                      placeholder="5"
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium mb-4">Password Policy</h3>
                <div className="space-y-4">
                  <TextInput
                    label="Minimum Password Length"
                    type="number"
                    value={systemSettings.security.passwordMinLength.toString()}
                    onChange={(value) => updateSettings('security', 'passwordMinLength', parseInt(value) || 8)}
                    placeholder="8"
                  />
                  
                  <div className="space-y-2 pt-2">
                    <CheckboxInput
                      label="Require special characters"
                      checked={systemSettings.security.passwordRequiresSpecialChars}
                      onChange={(value) => updateSettings('security', 'passwordRequiresSpecialChars', value)}
                    />
                    
                    <CheckboxInput
                      label="Require numbers"
                      checked={systemSettings.security.passwordRequiresNumbers}
                      onChange={(value) => updateSettings('security', 'passwordRequiresNumbers', value)}
                    />
                    
                    <CheckboxInput
                      label="Require uppercase letters"
                      checked={systemSettings.security.passwordRequiresUppercase}
                      onChange={(value) => updateSettings('security', 'passwordRequiresUppercase', value)}
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium mb-4">IP Restrictions</h3>
                <div className="space-y-4">
                  <ToggleSwitch
                    label="Enable IP Restriction"
                    checked={systemSettings.security.ipRestriction}
                    onChange={(value) => updateSettings('security', 'ipRestriction', value)}
                    description="Only allow admin access from specified IP addresses"
                  />
                  
                  {systemSettings.security.ipRestriction && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allowed IP Addresses</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {systemSettings.security.allowedIPs.map((ip) => (
                          <div key={ip} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                            <span className="text-sm">{ip}</span>
                            <button
                              onClick={() => removeAllowedIP(ip)}
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Enter IP address"
                          className="flex-1 p-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addAllowedIP((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                          onClick={(e) => {
                            const input = e.currentTarget.previousSibling as HTMLInputElement;
                            addAllowedIP(input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <SectionHeader
                icon={faPaintBrush}
                title="Appearance Settings"
                description="Customize the look and feel of your application"
              />

              <Card>
                <h3 className="text-lg font-medium mb-4">Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <TextInput
                      label="Primary Color"
                      type="color"
                      value={systemSettings.appearance.primaryColor}
                      onChange={(value) => updateSettings('appearance', 'primaryColor', value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Main color used throughout the application</p>
                  </div>
                  
                  <div>
                    <TextInput
                      label="Secondary Color"
                      type="color"
                      value={systemSettings.appearance.secondaryColor}
                      onChange={(value) => updateSettings('appearance', 'secondaryColor', value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Accent color for buttons and highlights</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <TextInput
                      label="Footer Text"
                      value={systemSettings.appearance.footerText}
                      onChange={(value) => updateSettings('appearance', 'footerText', value)}
                      placeholder="© 2025 MoreVans. All rights reserved."
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium mb-4">Logos & Icons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                    <div className="flex items-center space-x-4">
                      <img
                        src={systemSettings.appearance.logoUrl}
                        alt="Site Logo"
                        className="h-12 w-auto object-contain"
                      />
                      <div className="flex-1">
                        <TextInput
                          label=""
                          value={systemSettings.appearance.logoUrl}
                          onChange={(value) => updateSettings('appearance', 'logoUrl', value)}
                          placeholder="/logo.png"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
                    <div className="flex items-center space-x-4">
                      <img
                        src={systemSettings.appearance.faviconUrl}
                        alt="Favicon"
                        className="h-8 w-auto object-contain"
                      />
                      <div className="flex-1">
                        <TextInput
                          label=""
                          value={systemSettings.appearance.faviconUrl}
                          onChange={(value) => updateSettings('appearance', 'faviconUrl', value)}
                          placeholder="/favicon.png"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium mb-4">Layout & Design</h3>
                <div className="space-y-4">
                  <SelectField
                    label="Home Page Layout"
                    value={systemSettings.appearance.homePageLayout}
                    onChange={(value) => updateSettings('appearance', 'homePageLayout', value)}
                    options={[
                      { value: 'default', label: 'Default Layout' },
                      { value: 'hero', label: 'Hero Image Layout' },
                      { value: 'video', label: 'Video Background' },
                      { value: 'minimal', label: 'Minimal Layout' }
                    ]}
                  />
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-medium mb-4">Custom Code</h3>
                <div className="space-y-4">
                  <TextArea
                    label="Custom CSS"
                    value={systemSettings.appearance.customCss}
                    onChange={(value) => updateSettings('appearance', 'customCss', value)}
                    placeholder="/* Add your custom CSS here */"
                    rows={6}
                  />
                  
                  <TextArea
                    label="Custom JavaScript"
                    value={systemSettings.appearance.customJs}
                    onChange={(value) => updateSettings('appearance', 'customJs', value)}
                    placeholder="// Add your custom JavaScript here"
                    rows={6}
                  />
                </div>
              </Card>
            </div>
          )}

          {/* Role Permissions */}
          {activeTab === 'permissions' && (
            <div className="space-y-8">
              <SectionHeader
                icon={faUserLock}
                title="Role Permissions"
                description="Configure access control for different user roles"
              />

              <Card>
                <div className="mb-4">
                  <Alert
                    type="info"
                    message="Super Admin permissions cannot be modified and have full access to the system."
                  />
                </div>
                
                <PermissionTable
                  roles={roles}
                  permissions={systemSettings.permissions}
                  onChange={updatePermissions}
                />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;