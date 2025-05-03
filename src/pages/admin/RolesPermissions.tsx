import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faUserShield,
  faSave,
  faTimes,
  faCheckCircle,
  faExclamationCircle,
  faUserCog
} from '@fortawesome/free-solid-svg-icons';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const MODULES = [
  'Dashboard',
  'Users',
  'Providers',
  'Bookings',
  'Vehicles',
  'Payments',
  'Reports',
  'Disputes',
  'Settings',
  'Maintenance'
];

const RolesPermissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    isDefault: false
  });
  
  useEffect(() => {
    // Fetch roles and permissions from API
    fetchRolesAndPermissions();
  }, []);
  
  useEffect(() => {
    if (activeTab === 'roles') {
      filterRoles();
    } else {
      filterPermissions();
    }
  }, [searchTerm, roles, permissions, moduleFilter]);
  
  const fetchRolesAndPermissions = () => {
    // Mock data for roles
    const mockRoles: Role[] = [
      {
        id: 'role-1',
        name: 'Super Admin',
        description: 'Full access to all system features and settings',
        permissions: ['perm-1', 'perm-2', 'perm-3', 'perm-4', 'perm-5', 'perm-6', 'perm-7', 'perm-8', 'perm-9', 'perm-10'],
        userCount: 2,
        isDefault: false,
        createdAt: '2025-01-15T10:00:00',
        updatedAt: '2025-01-15T10:00:00'
      },
      {
        id: 'role-2',
        name: 'Admin',
        description: 'Administrative access to manage platform operations',
        permissions: ['perm-1', 'perm-2', 'perm-3', 'perm-4', 'perm-5', 'perm-6', 'perm-8'],
        userCount: 5,
        isDefault: false,
        createdAt: '2025-01-15T10:00:00',
        updatedAt: '2025-02-20T14:30:00'
      },
      {
        id: 'role-3',
        name: 'Customer Service',
        description: 'Access to handle customer inquiries and disputes',
        permissions: ['perm-1', 'perm-4', 'perm-5', 'perm-8'],
        userCount: 8,
        isDefault: false,
        createdAt: '2025-01-20T09:15:00',
        updatedAt: '2025-03-10T11:45:00'
      },
      {
        id: 'role-4',
        name: 'Provider Manager',
        description: 'Manage van providers and their vehicles',
        permissions: ['perm-1', 'perm-3', 'perm-5', 'perm-7'],
        userCount: 4,
        isDefault: false,
        createdAt: '2025-02-05T13:20:00',
        updatedAt: '2025-03-15T16:10:00'
      },
      {
        id: 'role-5',
        name: 'Finance',
        description: 'Access to manage payments, refunds, and financial reports',
        permissions: ['perm-1', 'perm-6', 'perm-9'],
        userCount: 3,
        isDefault: false,
        createdAt: '2025-02-10T08:45:00',
        updatedAt: '2025-03-01T09:30:00'
      },
      {
        id: 'role-6',
        name: 'User',
        description: 'Standard user role for customers',
        permissions: ['perm-1'],
        userCount: 245,
        isDefault: true,
        createdAt: '2025-01-15T10:00:00',
        updatedAt: '2025-01-15T10:00:00'
      }
    ];
    
    // Mock data for permissions
    const mockPermissions: Permission[] = [
      {
        id: 'perm-1',
        name: 'Dashboard View',
        description: 'Access to view dashboard information',
        module: 'Dashboard'
      },
      {
        id: 'perm-2',
        name: 'User Management',
        description: 'Ability to create, edit, and delete user accounts',
        module: 'Users'
      },
      {
        id: 'perm-3',
        name: 'Provider Management',
        description: 'Ability to create, edit, and delete provider accounts',
        module: 'Providers'
      },
      {
        id: 'perm-4',
        name: 'Booking Management',
        description: 'Ability to view, edit, and cancel bookings',
        module: 'Bookings'
      },
      {
        id: 'perm-5',
        name: 'Vehicle Management',
        description: 'Ability to manage vehicle listings',
        module: 'Vehicles'
      },
      {
        id: 'perm-6',
        name: 'Payment Processing',
        description: 'Ability to process payments and refunds',
        module: 'Payments'
      },
      {
        id: 'perm-7',
        name: 'Reports Access',
        description: 'Access to view and generate reports',
        module: 'Reports'
      },
      {
        id: 'perm-8',
        name: 'Dispute Resolution',
        description: 'Ability to manage and resolve disputes',
        module: 'Disputes'
      },
      {
        id: 'perm-9',
        name: 'System Settings',
        description: 'Access to modify system settings',
        module: 'Settings'
      },
      {
        id: 'perm-10',
        name: 'Maintenance Mode',
        description: 'Ability to enable/disable maintenance mode',
        module: 'Maintenance'
      }
    ];
    
    setRoles(mockRoles);
    setPermissions(mockPermissions);
    setFilteredRoles(mockRoles);
    setFilteredPermissions(mockPermissions);
  };
  
  const filterRoles = () => {
    let filtered = [...roles];
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredRoles(filtered);
  };
  
  const filterPermissions = () => {
    let filtered = [...permissions];
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply module filter
    if (moduleFilter !== 'all') {
      filtered = filtered.filter(permission => permission.module === moduleFilter);
    }
    
    setFilteredPermissions(filtered);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm('');
  };
  
  const handleModuleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModuleFilter(e.target.value);
  };
  
  const openRoleModal = (role?: Role) => {
    if (role) {
      setSelectedRole(role);
      setRoleForm({
        name: role.name,
        description: role.description,
        permissions: [...role.permissions],
        isDefault: role.isDefault
      });
    } else {
      setSelectedRole(null);
      setRoleForm({
        name: '',
        description: '',
        permissions: [],
        isDefault: false
      });
    }
    setIsRoleModalOpen(true);
  };
  
  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedRole(null);
  };
  
  const handleRoleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setRoleForm({
        ...roleForm,
        [name]: checkbox.checked
      });
    } else {
      setRoleForm({
        ...roleForm,
        [name]: value
      });
    }
  };
  
  const handlePermissionToggle = (permissionId: string) => {
    const currentPermissions = [...roleForm.permissions];
    
    if (currentPermissions.includes(permissionId)) {
      // Remove permission
      setRoleForm({
        ...roleForm,
        permissions: currentPermissions.filter(id => id !== permissionId)
      });
    } else {
      // Add permission
      setRoleForm({
        ...roleForm,
        permissions: [...currentPermissions, permissionId]
      });
    }
  };
  
  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRole) {
      // Update existing role
      const updatedRoles = roles.map(role =>
        role.id === selectedRole.id
          ? {
              ...role,
              name: roleForm.name,
              description: roleForm.description,
              permissions: roleForm.permissions,
              isDefault: roleForm.isDefault,
              updatedAt: new Date().toISOString()
            }
          : role
      );
      
      setRoles(updatedRoles);
      setSuccessMessage('Role updated successfully!');
    } else {
      // Create new role
      const newRole: Role = {
        id: `role-${roles.length + 1}`,
        name: roleForm.name,
        description: roleForm.description,
        permissions: roleForm.permissions,
        userCount: 0,
        isDefault: roleForm.isDefault,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setRoles([...roles, newRole]);
      setSuccessMessage('Role created successfully!');
    }
    
    closeRoleModal();
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId('');
  };
  
  const handleDeleteRole = () => {
    const updatedRoles = roles.filter(role => role.id !== deleteTargetId);
    setRoles(updatedRoles);
    closeDeleteModal();
    setSuccessMessage('Role deleted successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const getPermissionName = (permissionId: string): string => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission ? permission.name : 'Unknown Permission';
  };
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold mb-4 md:mb-0">Roles & Permissions Management</h2>
        
        {activeTab === 'roles' && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => openRoleModal()}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create New Role
          </button>
        )}
      </div>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex items-center py-3 px-4 text-sm font-medium ${
              activeTab === 'roles'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('roles')}
          >
            <FontAwesomeIcon icon={faUserShield} className="mr-2" />
            Roles
          </button>
          
          <button
            className={`flex items-center py-3 px-4 text-sm font-medium ${
              activeTab === 'permissions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('permissions')}
          >
            <FontAwesomeIcon icon={faUserCog} className="mr-2" />
            Permissions
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={activeTab === 'roles' ? "Search roles..." : "Search permissions..."}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            {activeTab === 'permissions' && (
              <div className="md:w-64">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={moduleFilter}
                  onChange={handleModuleFilterChange}
                >
                  <option value="all">All Modules</option>
                  {MODULES.map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        
        {/* Roles Tab Content */}
        {activeTab === 'roles' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.length > 0 ? (
                  filteredRoles.map(role => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{role.name}</div>
                          {role.isDefault && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Default
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">{role.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.length > 0 ? (
                            <>
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {role.permissions.length} permissions
                              </span>
                              {role.permissions.length > 3 ? (
                                <span className="text-gray-500 text-xs italic mt-1">
                                  Including: {getPermissionName(role.permissions[0])}, {getPermissionName(role.permissions[1])}, +{role.permissions.length - 2} more
                                </span>
                              ) : (
                                role.permissions.map(permId => (
                                  <span key={permId} className="text-gray-500 text-xs block">
                                    {getPermissionName(permId)}
                                  </span>
                                ))
                              )}
                            </>
                          ) : (
                            <span className="text-gray-500 text-xs italic">No permissions</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{role.userCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(role.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => openRoleModal(role)}
                            title="Edit Role"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          {!role.isDefault && role.userCount === 0 && (
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => openDeleteModal(role.id)}
                              title="Delete Role"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No roles found. Try adjusting your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Permissions Tab Content */}
        {activeTab === 'permissions' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permission Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Used In Roles
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPermissions.length > 0 ? (
                  filteredPermissions.map(permission => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{permission.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {permission.module}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {roles.filter(role => role.permissions.includes(permission.id)).length} roles
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No permissions found. Try adjusting your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Role Create/Edit Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{selectedRole ? 'Edit Role' : 'Create New Role'}</h3>
              <button
                onClick={closeRoleModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleRoleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter role name"
                    value={roleForm.name}
                    onChange={handleRoleFormChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter role description"
                    value={roleForm.description}
                    onChange={handleRoleFormChange}
                  ></textarea>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isDefault"
                    id="isDefault"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={roleForm.isDefault}
                    onChange={handleRoleFormChange}
                  />
                  <label htmlFor="isDefault" className="text-sm text-gray-700">
                    Set as default role for new users
                  </label>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Permissions</h4>
                  
                  {MODULES.map(module => (
                    <div key={module} className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">{module}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {permissions
                          .filter(permission => permission.module === module)
                          .map(permission => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`perm-${permission.id}`}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={roleForm.permissions.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                              />
                              <label htmlFor={`perm-${permission.id}`} className="text-sm text-gray-900">
                                {permission.name}
                                <span className="block text-xs text-gray-500">{permission.description}</span>
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeRoleModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {selectedRole ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FontAwesomeIcon icon={faExclamationCircle} className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Delete Role</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this role? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center mt-4 space-x-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteRole}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissions;