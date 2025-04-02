import { 
  faBell, faBoxOpen, faCalendarAlt, faCreditCard, 
  faEnvelope, faLock, faMapMarker, faPhone, 
  faShieldAlt, faTruckMoving, faUser, faGlobe, 
  faBuilding, faReceipt, faClock, faInfoCircle, 
  faPlus, faEye, faEyeSlash, faKey, faHistory, faDesktop, faMobile, faCog
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// ================== Type Definitions ==================
interface UserSettings {
  personal: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    company?: {
      name: string;
      vatNumber?: string;
    };
    language: string;
  };
  movingPreferences: {
    vehicleType: 'smallVan' | 'mediumVan' | 'largeTruck' | 'specialty';
    packingService: boolean;
    insuranceLevel: 'basic' | 'premium' | 'fullCoverage';
    preferredDates: Date[];
    timeWindows: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
    specialRequirements?: string;
  };
  payment: {
    cards: PaymentMethod[];
    defaultPaymentId: string;
    billingAddress: string;
  };
  notifications: {
    bookingConfirmation: boolean;
    driverAssigned: boolean;
    etaUpdate: boolean;
    paymentReceipt: boolean;
    promotions: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastLogin: string;
    trustedDevices: number;
  };
}

interface PaymentMethod {
  id: string;
  last4: string;
  brand: string;
  expiry: string;
}

// ================== Reusable Components ==================
const SectionHeader = ({ icon, title, description }: { 
  icon: any, 
  title: string, 
  description: string 
}) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold flex items-center">
      <FontAwesomeIcon icon={icon} className="mr-2 text-gray-500" />
      {title}
    </h2>
    <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

const ValidatedInput = ({ 
  label, 
  icon, 
  error, 
  ...props 
}: { 
  label: string, 
  icon?: any, 
  error?: string,
  [key: string]: any 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 flex items-center">
      <FontAwesomeIcon icon={icon} className="mr-2 text-gray-400" />
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-4 py-2 border ${
        error ? 'border-red-500' : 'border-gray-300'
      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({ 
  label, 
  options, 
  value, 
  onChange 
}: { 
  label: string, 
  options: { value: string, label: string }[], 
  value: string, 
  onChange: (value: string) => void 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ToggleField = ({ 
  label, 
  checked, 
  onChange 
}: { 
  label: string, 
  checked: boolean, 
  onChange: (checked: boolean) => void 
}) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
    <span className="font-medium">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
        className="sr-only peer" 
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

// ================== Main Section Components ==================
const CompanyInfo = ({ 
  value, 
  onChange 
}: { 
  value?: { name: string, vatNumber?: string }, 
  onChange: (value: any) => void 
}) => (
  <div className="space-y-4 col-span-2">
    <ValidatedInput
      label="Company Name"
      icon={faBuilding}
      value={value?.name || ''}
      onChange={(v: string) => onChange({ ...value, name: v })}
    />
    <ValidatedInput
      label="VAT Number"
      icon={faReceipt}
      value={value?.vatNumber || ''}
      pattern="\d{9}"
      onChange={(v: string) => onChange({ ...value, vatNumber: v })}
    />
  </div>
);

const AddressField = ({ 
  value, 
  onChange 
}: { 
  value: UserSettings['personal']['address'], 
  onChange: (value: UserSettings['personal']['address']) => void 
}) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (value.country) {
      setStates(State.getStatesOfCountry(value.country));
      setCities([]);
    }
  }, [value.country]);

  useEffect(() => {
    if (value.country && value.state) {
      setCities(City.getCitiesOfState(value.country, value.state));
    }
  }, [value.state]);

  return (
    <div className="space-y-4 col-span-2">
      <ValidatedInput
        label="Street Address"
        icon={faMapMarker}
        value={value.street}
        required
        onChange={(v: string) => onChange({ ...value, street: v })}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SelectField
          label="Country"
          options={countries.map(c => ({ 
            value: c.isoCode, 
            label: c.name 
          }))}
          value={value.country}
          onChange={(v) => onChange({ ...value, country: v, state: '', city: '' })}
        />

        <SelectField
          label="State/Province"
          options={states.map(s => ({ 
            value: s.isoCode, 
            label: s.name 
          }))}
          value={value.state}
          onChange={(v) => onChange({ ...value, state: v, city: '' })}
        />

        <SelectField
          label="City"
          options={cities.map(c => ({
            value: c.name,
            label: c.name
          }))}
          value={value.city}
          onChange={(v) => onChange({ ...value, city: v })}
        />

        <ValidatedInput
          label="Postal Code"
          value={value.postalCode}
          pattern="[A-Za-z0-9 ]{4,10}"
          icon={faUser}
          onChange={(v: string) => onChange({ ...value, postalCode: v })}
        />
      </div>
    </div>
  );
};

const PersonalInfoSection = ({ settings, onChange, errors }) => {
  return (
    <div className="space-y-8">
      {/* Section Header with Animation */}
      <div className="border-b border-gray-100 pb-6 mb-8">
        <SectionHeader
          icon={faUser}
          title="Personal & Business Information"
          description="Manage your personal details and business information"
        />
      </div>
      
      {/* User Profile Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Profile Photo with hover effects */}
          <div className="relative group">
            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <img
                className="h-full w-full object-cover"
                src={settings?.profileImage || '/default-avatar.png'}
                alt="Profile"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 text-transparent group-hover:text-white rounded-full cursor-pointer transition-all duration-300">
              <label className="cursor-pointer flex flex-col items-center">
                <FontAwesomeIcon icon={faUser} className="text-xl mb-1" />
                <span className="text-xs font-medium">Change Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        onChange('personal', 'profileImage', event.target?.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-medium text-gray-800">
              {settings?.name || 'Complete Your Profile'}
            </h3>
            <p className="text-gray-600 mb-2">
              {settings?.email || 'Add your contact information'}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {settings?.isBusinessAccount ? 'Business Account' : 'Personal Account'}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {settings?.language === 'en' ? 'English' : settings?.language}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Sections */}
      <div className="grid grid-cols-1 gap-8">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-md">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
              Basic Information
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ValidatedInput
                label="Full Name"
                icon={faUser}
                value={settings?.name}
                required
                error={errors['personal-name']}
                onChange={(v) => onChange('personal', 'name', v)}
                placeholder="John Doe"
              />

              <ValidatedInput
                label="Email Address"
                icon={faEnvelope}
                type="email"
                value={settings?.email}
                required
                error={errors['personal-email']}
                onChange={(v) => onChange('personal', 'email', v)}
                placeholder="john@example.com"
              />

              <ValidatedInput
                label="Phone Number"
                icon={faPhone}
                type="tel"
                value={settings?.phone}
                pattern="^\+?[1-9]\d{1,14}$"
                error={errors['personal-phone']}
                onChange={(v) => onChange('personal', 'phone', v)}
                placeholder="+44 1234 567890"
              />

              <SelectField
                label="Preferred Language"
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' }
                ]}
                value={settings?.language}
                onChange={(v) => onChange('personal', 'language', v)}
              />
            </div>
          </div>
        </div>
        
        {/* Address Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-md">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faMapMarker} className="mr-2 text-blue-500" />
              Address Details
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <ValidatedInput
                  label="Street Address"
                  icon={faMapMarker}
                  value={settings?.address?.street}
                  required
                  onChange={(v) => onChange('personal', 'address', {
                    ...settings.personal.address,
                    street: v
                  })}
                  placeholder="123 Main Street"
                />
              </div>

              <ValidatedInput
                label="Apartment/Suite"
                value={settings?.address?.apt || ''}
                onChange={(v) => onChange('personal', 'address', {
                  ...settings.personal.address,
                  apt: v
                })}
                placeholder="Apt #42 (Optional)"
              />

              <SelectField
                label="Country"
                options={Country.getAllCountries().map(c => ({
                  value: c.isoCode,
                  label: c.name
                }))}
                value={settings?.address?.country}
                onChange={(v) => onChange('personal', 'address', {
                  ...settings.personal.address,
                  country: v,
                  state: '',
                  city: ''
                })}
              />

              <ValidatedInput
                label="Postal Code"
                value={settings?.address?.postalCode || ''}
                pattern="[A-Za-z0-9 ]{4,10}"
                onChange={(v) => onChange('personal', 'address', {
                  ...settings.personal.address,
                  postalCode: v
                })}
                placeholder="SW1A 1AA"
              />
            </div>
          </div>
        </div>
        
        {/* Emergency Contact */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-md">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-blue-500" />
              Emergency Contact
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ValidatedInput
                label="Contact Name"
                icon={faUser}
                value={settings?.emergencyContact?.name || ''}
                onChange={(v) => onChange('personal', 'emergencyContact', {
                  ...settings.personal.emergencyContact,
                  name: v
                })}
                placeholder="Jane Doe"
              />

              <ValidatedInput
                label="Contact Phone"
                icon={faPhone}
                type="tel"
                value={settings?.emergencyContact?.phone || ''}
                pattern="^\+?[1-9]\d{1,14}$"
                onChange={(v) => onChange('personal', 'emergencyContact', {
                  ...settings.personal.emergencyContact,
                  phone: v
                })}
                placeholder="+44 9876 543210"
              />

              <ValidatedInput
                label="Relationship"
                value={settings?.emergencyContact?.relationship || ''}
                onChange={(v) => onChange('personal', 'emergencyContact', {
                  ...settings.personal.emergencyContact,
                  relationship: v
                })}
                placeholder="Spouse, Parent, Friend"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Business Account Toggle */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-shadow duration-300 hover:shadow-md">
        <div>
          <h3 className="font-medium text-gray-800 text-lg">Business Account</h3>
          <p className="text-gray-600 mt-1">Enable this if you're using our services for business purposes</p>
        </div>
        <div className="flex items-center">
          <span className="mr-3 text-sm text-gray-600">
            {settings?.isBusinessAccount ? 'Enabled' : 'Disabled'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings?.isBusinessAccount || false} 
              onChange={(e) => onChange('personal', 'isBusinessAccount', e.target.checked)} 
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      {/* Conditional Business Information */}
      {settings?.isBusinessAccount && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-md">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-500" />
              Business Details
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ValidatedInput
                label="Company Name"
                icon={faBuilding}
                value={settings?.company?.name || ''}
                required
                onChange={(v) => onChange('personal', 'company', {
                  ...settings.personal.company,
                  name: v
                })}
                placeholder="Acme Corporation"
              />

              <ValidatedInput
                label="VAT Number"
                icon={faReceipt}
                value={settings?.company?.vatNumber || ''}
                pattern="^[A-Za-z0-9]{8,15}$"
                onChange={(v) => onChange('personal', 'company', {
                  ...settings.personal.company,
                  vatNumber: v
                })}
                placeholder="GB123456789"
              />

              <ValidatedInput
                label="Business Hours"
                icon={faClock}
                value={settings?.company?.businessHours || ''}
                placeholder="Mon-Fri 9AM-5PM"
                onChange={(v) => onChange('personal', 'company', {
                  ...settings.personal.company,
                  businessHours: v
                })}
              />

              <ValidatedInput
                label="Website"
                icon={faGlobe}
                type="url"
                value={settings?.company?.website || ''}
                onChange={(v) => onChange('personal', 'company', {
                  ...settings.personal.company,
                  website: v
                })}
                placeholder="https://www.example.com"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Marketing Preferences */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-shadow duration-300 hover:shadow-md">
        <h3 className="text-lg font-medium text-gray-800 flex items-center mb-4">
          <FontAwesomeIcon icon={faBell} className="mr-2 text-blue-500" />
          Communication Preferences
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={settings?.marketingEmails || false}
              onChange={(e) => onChange('personal', 'marketingEmails', e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="ml-3">
              <span className="text-gray-700 font-medium">Marketing Emails</span>
              <p className="text-sm text-gray-500">Receive updates about promotions and new features</p>
            </div>
          </label>
          
          <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={settings?.smsNotifications || false}
              onChange={(e) => onChange('personal', 'smsNotifications', e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="ml-3">
              <span className="text-gray-700 font-medium">SMS Notifications</span>
              <p className="text-sm text-gray-500">Receive booking updates via text message</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};


const MovingPreferencesSection = ({ 
  settings, 
  onChange 
}: { 
  settings: UserSettings['movingPreferences'], 
  onChange: (field: string, value: any) => void 
}) => (
  <div className="space-y-6">
    <SectionHeader
      icon={faTruckMoving}
      title="Moving Preferences"
      description="Set your default moving preferences for quick bookings"
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SelectField
        label="Vehicle Type"
        options={[
          { value: 'smallVan', label: 'Small Van (up to 1 bedroom)' },
          { value: 'mediumVan', label: 'Medium Van (2-3 bedrooms)' },
          { value: 'largeTruck', label: 'Large Truck (4+ bedrooms)' },
          { value: 'specialty', label: 'Specialty Equipment' },
        ]}
        value={settings.vehicleType}
        onChange={(v) => onChange('vehicleType', v)}
      />

      <SelectField
        label="Insurance Level"
        options={[
          { value: 'basic', label: 'Basic Coverage (£500)' },
          { value: 'premium', label: 'Premium Coverage (£2000)' },
          { value: 'fullCoverage', label: 'Full Coverage (£5000)' },
        ]}
        value={settings.insuranceLevel}
        onChange={(v) => onChange('insuranceLevel', v)}
      />

      <ToggleField
        label="Include Professional Packing Service"
        checked={settings.packingService}
        onChange={(v) => onChange('packingService', v)}
      />

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Moving Dates
        </label>
        <DatePicker
          selected={null}
          onChange={(dates: Date[]) => onChange('preferredDates', dates)}
          startDate={settings.preferredDates[0]}
          endDate={settings.preferredDates[settings.preferredDates.length - 1]}
          selectsRange
          inline
          minDate={new Date()}
          isClearable
          className="w-full"
        />
      </div>

      <div className="col-span-2 space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Preferred Time Windows
        </label>
        <div className="grid grid-cols-3 gap-4">
          <ToggleField
            label="Morning (8am-12pm)"
            checked={settings.timeWindows.morning}
            onChange={(v) => onChange('timeWindows', { ...settings.timeWindows, morning: v })}
          />
          <ToggleField
            label="Afternoon (12pm-5pm)"
            checked={settings.timeWindows.afternoon}
            onChange={(v) => onChange('timeWindows', { ...settings.timeWindows, afternoon: v })}
          />
          <ToggleField
            label="Evening (5pm-9pm)"
            checked={settings.timeWindows.evening}
            onChange={(v) => onChange('timeWindows', { ...settings.timeWindows, evening: v })}
          />
        </div>
      </div>

      <div className="col-span-2">
        <ValidatedInput
          label="Special Requirements"
          icon={faInfoCircle}
          value={settings.specialRequirements || ''}
          onChange={(v: string) => onChange('specialRequirements', v)}
          placeholder="E.g., Piano moving, fragile items, parking restrictions..."
          as="textarea"
          rows={3}
        />
      </div>
    </div>
  </div>
);



const PaymentSection = ({ settings, onChange }) => {
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [showAddCard, setShowAddCard] = useState(false);

  const handleAddCard = () => {
    if (settings?.payment?.cards.some(card => card.last4 === newCard.number.slice(-4))) {
      return;
    }

    const card = {
      id: `card_${Date.now()}`,
      last4: newCard.number.slice(-4),
      brand: detectCardType(newCard.number),
      expiry: newCard.expiry,
      name: newCard.name
    };

    onChange('cards', [...settings.payment.cards, card]);
    if (!settings.payment.defaultPaymentId) {
      onChange('defaultPaymentId', card.id);
    }
    setShowAddCard(false);
    setNewCard({ number: '', expiry: '', cvc: '' });
  };

  const detectCardType = (number) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };
    return Object.entries(patterns).find(([_, pattern]) => pattern.test(number))?.[0] || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={faCreditCard}
        title="Payment Methods"
        description="Manage your payment methods and billing information"
      />

      <div className="space-y-4">
        {settings?.payment?.cards.map(card => (
          <div key={card.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`payment-logo ${card.brand.toLowerCase()}`} />
              <div>
                <p className="font-medium">**** **** **** {card.last4}</p>
                <p className="text-sm text-gray-600">Expires {card.expiry}</p>
                {card.name && <p className="text-sm text-gray-600">{card.name}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {settings.payment.defaultPaymentId === card.id && (
                <span className="text-sm text-green-600">Default</span>
              )}
              <button
                onClick={() => onChange('cards', settings.payment.cards.filter(c => c.id !== card.id))}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {showAddCard ? (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <ValidatedInput
              label="Card Number"
              value={newCard.number}
              onChange={(v) => setNewCard({ ...newCard, number: v })}
              pattern="\d{16}"
              errorMessage="Enter a valid 16-digit card number"
            />
            <div className="grid grid-cols-2 gap-4">
              <ValidatedInput
                label="Expiration Date (MM/YY)"
                value={newCard.expiry}
                onChange={(v) => setNewCard({ ...newCard, expiry: v })}
                pattern="\d{2}/\d{2}"
              />
              <ValidatedInput
                label="CVC"
                value={newCard.cvc}
                onChange={(v) => setNewCard({ ...newCard, cvc: v })}
                pattern="\d{3}"
              />
            </div>
            <ValidatedInput
              label="Cardholder Name"
              value={newCard.name}
              onChange={(v) => setNewCard({ ...newCard, name: v })}
            />
            <div className="flex space-x-4">
              <button
                onClick={handleAddCard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Card
              </button>
              <button
                onClick={() => setShowAddCard(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Payment Method
          </button>
        )}
      </div>

      <div className="pt-6 border-t border-gray-200">
        <ValidatedInput
          label="Billing Address"
          icon={faMapMarker}
          value={settings?.payment?.billingAddress}
          onChange={(v) => onChange('billingAddress', v)}
          required
        />
      </div>
    </div>
  );
};

const SecuritySection = ({ settings, onChange }) => {
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  useEffect(() => {
    if (password.new) {
      // Simple password strength calculator
      let strength = 0;
      if (password.new.length > 8) strength += 1;
      if (/[A-Z]/.test(password.new)) strength += 1;
      if (/[0-9]/.test(password.new)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password.new)) strength += 1;
      setPasswordStrength(strength);
      
      const feedbacks = [
        "Very weak", "Weak", "Medium", "Strong", "Very strong"
      ];
      setPasswordFeedback(feedbacks[strength]);
    } else {
      setPasswordStrength(0);
      setPasswordFeedback('');
    }
  }, [password.new]);

  const handlePasswordChange = () => {
    if (password.new !== password.confirm) {
      // Add visual feedback for non-matching passwords
      return;
    }
    // Add password change logic
    setPassword({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={faShieldAlt}
        title="Security Settings"
        description="Manage your account security and privacy settings"
      />

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-md">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faLock} className="mr-2 text-blue-500" />
            Two-Factor Authentication
          </h3>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className={`inline-flex h-4 w-4 rounded-full mr-2 ${
                  settings?.security?.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}></span>
                <span className="font-medium">
                  {settings?.security?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600">
                {settings?.security?.twoFactorEnabled 
                  ? "Your account is protected with an additional layer of security."
                  : "Add an extra layer of security to protect your account."
                }
              </p>
              
              {settings?.security?.twoFactorEnabled && (
                <div className="mt-2 py-2 px-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-sm text-blue-700">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                    <p>You have {settings.security.trustedDevices} trusted device{settings.security.trustedDevices !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => onChange('twoFactorEnabled', !settings.security.twoFactorEnabled)}
              className={`px-5 py-2.5 rounded-lg transition-all duration-200 font-medium text-white ${
                settings?.security?.twoFactorEnabled
                ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {settings?.security?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Password Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-md">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faKey} className="mr-2 text-blue-500" />
            Password Management
          </h3>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="relative">
            <ValidatedInput
              label="Current Password"
              type={showPassword.current ? "text" : "password"}
              value={password.current}
              onChange={(v) => setPassword({ ...password, current: v })}
              icon={faLock}
              placeholder="Enter your current password"
              required
            />
            <button 
              type="button" 
              className="absolute top-8 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
            >
              <FontAwesomeIcon icon={showPassword.current ? faEyeSlash : faEye} />
            </button>
          </div>
          
          <div className="relative">
            <ValidatedInput
              label="New Password"
              type={showPassword.new ? "text" : "password"}
              value={password.new}
              onChange={(v) => setPassword({ ...password, new: v })}
              icon={faLock}
              placeholder="Create a strong password"
              required
            />
            <button 
              type="button" 
              className="absolute top-8 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
            >
              <FontAwesomeIcon icon={showPassword.new ? faEyeSlash : faEye} />
            </button>
          </div>
          
          {password.new && (
            <div className="space-y-1">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    passwordStrength === 0 ? 'bg-gray-300 w-0' :
                    passwordStrength === 1 ? 'bg-red-500 w-1/4' :
                    passwordStrength === 2 ? 'bg-yellow-500 w-2/4' :
                    passwordStrength === 3 ? 'bg-blue-500 w-3/4' :
                    'bg-green-500 w-full'
                  }`}
                ></div>
              </div>
              <p className={`text-xs ${
                passwordStrength <= 1 ? 'text-red-500' :
                passwordStrength === 2 ? 'text-yellow-500' :
                passwordStrength === 3 ? 'text-blue-500' :
                'text-green-500'
              }`}>
                {passwordFeedback} password
              </p>
            </div>
          )}
          
          <div className="relative">
            <ValidatedInput
              label="Confirm New Password"
              type={showPassword.confirm ? "text" : "password"}
              value={password.confirm}
              onChange={(v) => setPassword({ ...password, confirm: v })}
              icon={faLock}
              placeholder="Confirm your new password"
              required
              error={password.new && password.confirm && password.new !== password.confirm ? "Passwords don't match" : ""}
            />
            <button 
              type="button" 
              className="absolute top-8 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
            >
              <FontAwesomeIcon icon={showPassword.confirm ? faEyeSlash : faEye} />
            </button>
          </div>
          
          <div className="pt-2">
            <button
              onClick={handlePasswordChange}
              disabled={!password.current || !password.new || !password.confirm || password.new !== password.confirm}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                !password.current || !password.new || !password.confirm || password.new !== password.confirm
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
      
      {/* Login History & Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-md">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faHistory} className="mr-2 text-blue-500" />
            Login History & Sessions
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faDesktop} className="mr-2 text-blue-500" />
                <span className="font-medium">Current Device</span>
                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
              </div>
              <p className="text-xs text-gray-600">Last active: {new Date().toLocaleString()}</p>
              <p className="text-xs text-gray-600">IP Address: 192.168.1.XXX</p>
            </div>
            <div className="text-xs">
              This device
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between border-b border-gray-100 py-3">
              <div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faMobile} className="mr-2 text-gray-500" />
                  <span className="text-sm">Mobile App - iPhone</span>
                </div>
                <p className="text-xs text-gray-500">
                  Last active: {new Date(settings?.security?.lastLogin).toLocaleString()}
                </p>
              </div>
              <button className="text-xs text-red-600 hover:text-red-800">
                End Session
              </button>
            </div>
            
            {/* Add more sessions as needed */}
          </div>
          
          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200">
              Logout from All Devices
            </button>
          </div>
        </div>
      </div>
      
      {/* Advanced Security Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-md">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faCog} className="mr-2 text-blue-500" />
            Advanced Security Options
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium">Account Recovery Options</p>
                <p className="text-sm text-gray-600">Add recovery methods in case you lose access</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                Manage
              </button>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium">Login Notifications</p>
                <p className="text-sm text-gray-600">Get alerted about new sign-ins</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings?.security?.loginAlerts || false} 
                  onChange={(e) => onChange('loginAlerts', e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Account Activity Log</p>
                <p className="text-sm text-gray-600">View all actions taken on your account</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                View Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================== Main Component ==================
const AnyVanSettings = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [settings, setSettings] = useState<UserSettings>({
    personal: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      },
      language: 'en',
      marketingEmails: true,
      isBusinessAccount: false
    },
    movingPreferences: {
      vehicleType: 'mediumVan',
      packingService: false,
      insuranceLevel: 'basic',
      preferredDates: [],
      timeWindows: {
        morning: false,
        afternoon: true,
        evening: false
      }
    },
    payment: {
      cards: [],
      defaultPaymentId: '',
      billingAddress: ''
    },
    security: {
      twoFactorEnabled: false,
      lastLogin: new Date().toISOString(),
      trustedDevices: 1
    }
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUnsavedChanges(false);
      setFeedback({ type: 'success', message: 'Settings saved successfully!' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to save settings' });
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal', icon: faUser },
    { id: 'moving', label: 'Moving', icon: faTruckMoving },
    { id: 'payment', label: 'Payment', icon: faCreditCard },
    { id: 'security', label: 'Security', icon: faLock }
  ];

  return (
    <div className="w-full px-4 py-8 bg-gray-50">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
      </div>
      
      {/* Enhanced Horizontal Navigation - Full Width */}
      <div className="relative mb-8 w-full">
        {/* Tabs Background with Bottom Border */}
        <div className="relative border-b border-gray-200 dark:border-gray-700 w-full">
          <div className="flex overflow-x-auto hide-scrollbar">
            {sections.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`
                  relative py-4 px-8 min-w-[120px] flex-1
                  flex items-center justify-center transition-all duration-200
                  text-sm font-medium rounded-t-lg
                  ${activeSection === id
                    ? 'text-blue-600 bg-white dark:text-blue-400 dark:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <FontAwesomeIcon icon={icon} className={`mr-2 ${activeSection === id ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                {label}
                
                {/* Active Tab Indicator */}
                {activeSection === id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transform translate-y-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CSS to add to your global styles */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;     /* Firefox */
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;             /* Chrome, Safari, Opera */
        }
      `}</style>

      {/* Feedback Messages */}
      {feedback && (
        <div className={`mb-6 p-4 rounded-lg ${
          feedback.type === 'success' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Main Content - Full Width */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full">
        {activeSection === 'personal' && (
          <PersonalInfoSection
            settings={settings.personal}
            onChange={(field, value) => handleChange('personal', field, value)}
            errors={validationErrors}
          />
        )}

        {activeSection === 'moving' && (
          <MovingPreferencesSection
            settings={settings.movingPreferences}
            onChange={(field, value) => handleChange('movingPreferences', field, value)}
          />
        )}


{activeSection === 'payment' && (
        <PaymentSection
          settings={settings.payment}
          onChange={(field, value) => handleChange('payment', field, value)}
        />
      )}

      {activeSection === 'security' && (
        <SecuritySection
          settings={settings.security}
          onChange={(field, value) => handleChange('security', field, value)}
        />
      )}

        {unsavedChanges && (
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600">You have unsaved changes</p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Discard Changes
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default AnyVanSettings;


