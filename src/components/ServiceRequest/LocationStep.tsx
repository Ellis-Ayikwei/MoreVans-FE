import React from 'react';
import { ErrorMessage, Field, FormikProps } from 'formik';
import {
    faBox,
    faBuilding,
    faCalendarAlt,
    faLocationDot,
    faTruck,
    faDollarSign,
    faPhone,
    faEnvelope,
    faWarehouse,
    faElevator,
    faCar,
    faImage,
    faClipboardList,
    faUser,
    faRulerCombined,
    faFileUpload,
    faGlobe,
    faMusic,
    faPalette,
    faCheckCircle,
    faShieldAlt,
    faThumbsUp,
    faCheck,
    faMoneyBill,
    faTag,
    faGavel,
    faArrowRight,
    faArrowLeft,
    faCamera,
    faCalendarCheck,
    faClock,
    faClipboardCheck,
    faFilePdf,
    faFile,
    faTimes,
    faCouch,
    faList,
    faPlus,
    faChevronUp,
    faChevronDown,
    faTv,
    faBlender,
    faInfoCircle,
    faWineGlassAlt,
    faDumbbell,
    faLeaf,
    faMapMarkedAlt,
    faGripLines,
    faRoute,
    faMapMarkerAlt,
    faTrash,
  } from '@fortawesome/free-solid-svg-icons';

import JourneyPlanning from './JourneryPlanning';
import StepNavigation from './stepNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const propertyTypes = ['house', 'apartment', 'office', 'storage'];
const vehicleTypes = ['motorcycle', 'car', 'suv', 'truck', 'van'];
const storageDurations = ['<1 month', '1-3 months', '3-6 months', '6+ months'];


const LocationsStep = ({ values, setFieldValue, onNext, onBack }: any) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center mb-6">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                  <FontAwesomeIcon icon={faLocationDot} />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Location Information</h2>
                              </div>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Pickup location */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                      <span className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 mr-3 flex items-center justify-center text-white text-sm">A</span>
                                      Pickup Address
                                    </h3>
                                  </div>
                                  <div className="p-6 space-y-6">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Street Address <span className="text-red-500">*</span>
                                      </label>
                                      <div className="relative">
                                        <FontAwesomeIcon icon={faLocationDot} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                        <Field 
                                          name="pickupLocation" 
                                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                          placeholder="Enter full address"
                                        />
                                      </div>
                                      <ErrorMessage name="pickupLocation" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
      
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                          Floor
                                        </label>
                                        <Field 
                                          name="pickupFloor" 
                                          type="number" 
                                          min="0" 
                                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                          placeholder="0"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                          Unit/Apt #
                                        </label>
                                        <Field 
                                          name="pickupUnitNumber" 
                                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                          placeholder="e.g., Apt 42"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                          <FontAwesomeIcon icon={faCar} className="mr-2 text-blue-600 dark:text-blue-400" />
                                          Parking Info
                                        </label>
                                        <Field 
                                          name="pickupParkingInfo" 
                                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                          placeholder="e.g., Street parking"
                                        />
                                      </div>
                                    </div>
                                    
                                    {/* Additional pickup property details */}
                                    {['Residential Moving', 'Office Relocation'].includes(values.itemType) && (
                                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                          <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-600 dark:text-blue-400" />
                                          Property Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                              Property Type
                                            </label>
                                            <Field as="select" name="propertyType" className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                                              {propertyTypes.map(type => (
                                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                              ))}
                                            </Field>
                                          </div>
      
                                          <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                              Number of Floors <span className="text-red-500">*</span>
                                            </label>
                                            <Field 
                                              type="number" 
                                              name="pickupNumberOfFloors" 
                                              min="1"
                                              className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                            <ErrorMessage name="pickupNumberOfFloors" component="p" className="text-red-500 text-xs mt-1" />
                                          </div>
      
                                          <div className="flex items-center">
                                            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                              <Field 
                                                type="checkbox" 
                                                name="pickupHasElevator" 
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600" 
                                              />
                                              <span className="ml-2 flex items-center">
                                                <FontAwesomeIcon icon={faElevator} className="mr-1.5 text-gray-500 dark:text-gray-400" />
                                                Elevator Access
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
      
                                {/* Dropoff location */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                      <span className="h-8 w-8 rounded-full bg-green-600 dark:bg-green-500 mr-3 flex items-center justify-center text-white text-sm">B</span>
                                      Dropoff Address
                                    </h3>
                                  </div>
                                  <div className="p-6 space-y-6">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Street Address <span className="text-red-500">*</span>
                                      </label>
                                      <div className="relative">
                                        <FontAwesomeIcon icon={faLocationDot} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                        <Field 
                                          name="dropoffLocation" 
                                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-10 pr-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                          placeholder="Enter full address"
                                        />
                                      </div>
                                      <ErrorMessage name="dropoffLocation" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
      
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                          Floor
                                        </label>
                                        <Field 
                                          name="dropoffFloor" 
                                          type="number" 
                                          min="0" 
                                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                          placeholder="0"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                          Unit/Apt #
                                        </label>
                                        <Field 
                                          name="dropoffUnitNumber" 
                                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                          placeholder="e.g., Apt 42"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                          <FontAwesomeIcon icon={faCar} className="mr-2 text-blue-600 dark:text-blue-400" />
                                          Parking Info
                                        </label>
                                        <Field 
                                          name="dropoffParkingInfo" 
                                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                          placeholder="e.g., Private driveway"
                                        />
                                      </div>
                                    </div>
                                    
                                    {/* Additional dropoff property details */}
                                    {['Residential Moving', 'Office Relocation'].includes(values.itemType) && (
                                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                          <FontAwesomeIcon icon={faBuilding} className="mr-2 text-green-600 dark:text-green-400" />
                                          Property Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                              Property Type
                                            </label>
                                            <Field as="select" name="dropoffPropertyType" className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                                              {propertyTypes.map(type => (
                                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                              ))}
                                            </Field>
                                          </div>
      
                                          <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                              Number of Floors <span className="text-red-500">*</span>
                                            </label>
                                            <Field 
                                              type="number" 
                                              name="dropoffNumberOfFloors" 
                                              min="1"
                                              className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                            <ErrorMessage name="dropoffNumberOfFloors" component="p" className="text-red-500 text-xs mt-1" />
                                          </div>
      
                                          <div className="flex items-center">
                                            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                              <Field 
                                                type="checkbox" 
                                                name="dropoffHasElevator" 
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600" 
                                              />
                                              <span className="ml-2 flex items-center">
                                                <FontAwesomeIcon icon={faElevator} className="mr-1.5 text-gray-500 dark:text-gray-400" />
                                                Elevator Access
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
      
      {/* Journey Planning */}
      {values.requestType === 'journey' && (
        <JourneyPlanning values={values} setFieldValue={setFieldValue} />
      )}

      <StepNavigation onNext={onNext} onBack={onBack} />
    </div>
  );
};

export default LocationsStep;