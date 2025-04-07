import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import StepNavigation from './stepNavigation';

import {
  faBox,
  faBuilding,
 
  faTruck,

  faElevator,
  faCar,
  faImage,
  faClipboardList,
  faUser,
  faRulerCombined,
  faFileUpload,
 
  faCheckCircle,

  faCamera,

  faTimes,
  faCouch,
  faList,
  faPlus,

  faTv,
  faBlender,
  faInfoCircle,

} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, FieldArray } from 'formik';
import { useServiceRequestForm } from '../../hooks/useServiceRequestForm';
import { get } from 'sortablejs';
import { getItemIcon } from '../../utilities/getItemIcon';
import { commonItems } from '../../data/commonItems';

const itemTypes = [
  'Residential Moving',
  'Office Relocation', 
  'Piano Moving',
  'Antique Moving',
  'Storage Services',
  'Packing Services',
  'Vehicle Transportation',
  'International Moving',
  'Furniture Assembly',
  'Fragile Items',
  'Artwork Moving',
  'Industrial Equipment',
  'Electronics',
  'Appliances',
  'Boxes/Parcels'
];

const propertyTypes = ['house', 'apartment', 'office', 'storage'];
const vehicleTypes = ['motorcycle', 'car', 'suv', 'truck', 'van'];
const storageDurations = ['<1 month', '1-3 months', '3-6 months', '6+ months'];



 





interface MovingItem {
  name: string;
  category: string;
  quantity: number;
  weight?: string;
  dimensions?: string;
  value?: string;
  fragile?: boolean;
  needsDisassembly?: boolean;
  notes?: string;
  photo?: File | string | null;
}

const ServiceDetailsStep = ({ values, onNext, onBack, previewImages, handleImageUpload, removeImage, setFieldValue }: any) => {
    const [showCommonItems, setShowCommonItems] = useState(false);
    const { setFormValues } = useServiceRequestForm();


    const scrollToPosition =(id: string)=>{
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-6 animate-fadeIn">
                              <div className="flex items-center mb-6">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                  <FontAwesomeIcon icon={faBox} />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Service Details</h2>
                              </div>
                              
                              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Service Type & Size</h3>
                                </div>
                                <div className="p-6">
                                  <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FontAwesomeIcon icon={faTruck} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        Service Type <span className="text-red-500">*</span>
                                      </label>
                                      <Field as="select" 
                                        name="itemType" 
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      >
                                        <option value="">Select a service type</option>
                                        {itemTypes.map(type => (
                                          <option key={type} value={type}>{type}</option>
                                        ))}
                                      </Field>
                                      <ErrorMessage name="itemType" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
      
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        Item Size <span className="text-red-500">*</span>
                                      </label>
                                      <Field as="select" 
                                        name="itemSize" 
                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      >
                                        <option value="small">Small (Fits in a Car)</option>
                                        <option value="medium">Medium (Requires a Van)</option>
                                        <option value="large">Large (Requires a Truck)</option>
                                        <option value="xlarge">Extra Large (Multiple Vehicles)</option>
                                      </Field>
                                      <ErrorMessage name="itemSize" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                  </div>
                                  
                                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                          <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-blue-600 dark:text-blue-400" />
                                          Dimensions (Optional)
                                        </label>
                                        <Field
                                          name="itemDimensions"
                                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                          placeholder="L × W × H"
                                        />
                                      </div>
      
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                          Weight (Optional)
                                        </label>
                                        <Field
                                          name="itemWeight"
                                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                          placeholder="kg"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Special Requirements</h4>
                                      <div className="flex flex-wrap gap-x-6 gap-y-3">
                                        <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                          <Field 
                                            type="checkbox" 
                                            name="needsDisassembly" 
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600" 
                                          />
                                          <span className="ml-2">Needs Disassembly</span>
                                        </label>
                                        <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                          <Field 
                                            type="checkbox" 
                                            name="isFragile" 
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600" 
                                          />
                                          <span className="ml-2">Fragile Items</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                              {/* Pickup location */}
                                                                  {/* Additional pickup property details */}
                                                                  {['Residential Moving', 'Office Relocation'].includes(values.itemType) && (
                                                              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                                                  <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                                                    <span className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 mr-3 flex items-center justify-center text-white text-sm">A</span>
                                                                    Pickup 
                                                                  </h3>
                                                                </div>
                                                                <div className="p-6 space-y-6">
                                                                 
                                    
                                                                  
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        Please enter the details of the property you are moving to.
                                                                        <br />
                                                                        This information will help us provide you with a more accurate estimate.
                                                                      </p>
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
                                                              </div>
                                                                  )}
                                    
                                                              {/* Dropoff location */}
                                                                  {/* Additional dropoff property details */}
                                                                  {['Residential Moving', 'Office Relocation'].includes(values.itemType) && (
                                                              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                                                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                                                  <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                                                    <span className="h-8 w-8 rounded-full bg-green-600 dark:bg-green-500 mr-3 flex items-center justify-center text-white text-sm">B</span>
                                                                    Dropoff 
                                                                  </h3>
                                                                </div>
                                                                <div className="p-6 space-y-6">
                                                                  
                                    
                                                                
                                                                  
                                                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        Please enter the details of the property you are moving to.
                                                                        <br />
                                                                        This information will help us provide you with a more accurate estimate.
                                                                      </p>
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
                                                              </div>
                                                                  )}




                                                            </div>


                              {/* Enhanced Item Selection for Moving Services */}
                              {['Residential Moving', 'Office Relocation', 'Antique Moving', 'Furniture Assembly'].includes(values.itemType) && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
                                  <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                      <FontAwesomeIcon icon={faCouch} className="mr-2 text-blue-600 dark:text-blue-400" />
                                      Items Inventory
                                    </h3>
                                  </div>
                                  <div className="p-6">
                                    <div className="mb-4">
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Add specific items you need moved to help providers better understand your needs and prepare accordingly.
                                      </p>
                                    </div>
                                    {/*custom item selection*/}
                                    <FieldArray
                                      name="movingItems"
                                      render={arrayHelpers => (
                                        <div>
                                          {values.movingItems && values.movingItems.length > 0 ? (
                                            <div className="space-y-4 mb-6">
                                              {values.movingItems.map((item: MovingItem, index: number) => (
                                              <div 
                                                key={index} 
                                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-750"
                                              >
                                                <div className="flex justify-between mb-3">
                                                <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                                  <FontAwesomeIcon icon={getItemIcon(values.movingItems[index].category).icon} className="mr-2 text-blue-600 dark:text-blue-400" />
                                                  {values.movingItems[index].name || 'New Item'}
                                                </h4>
                                                <button
                                                  type="button"
                                                  onClick={() => arrayHelpers.remove(index)}
                                                  className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                                >
                                                  <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Item Name <span className="text-red-500">*</span>
                                                  </label>
                                                  <Field
                                                  name={`movingItems.${index}.name`}
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                  placeholder="e.g., Sofa, Dining Table, TV"
                                                  />
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Category
                                                  </label>
                                                  <Field 
                                                  as="select"
                                                  name={`movingItems.${index}.category`}
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                  >
                                                  <option value="">Select category</option>
                                                  <option value="furniture">Furniture</option>
                                                  <option value="electronics">Electronics</option>
                                                  <option value="appliances">Appliances</option>
                                                  <option value="boxes">Boxes</option>
                                                  <option value="fragile">Fragile Items</option>
                                                  <option value="exercise">Exercise Equipment</option>
                                                  <option value="garden">Garden/Outdoor</option>
                                                  <option value="other">Other</option>
                                                  </Field>
                                                </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Quantity
                                                  </label>
                                                  <Field
                                                  type="number"
                                                  name={`movingItems.${index}.quantity`}
                                                  min="1"
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                  />
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Weight (kg)
                                                  </label>
                                                  <Field
                                                  type="number"
                                                  name={`movingItems.${index}.weight`}
                                                  min="0"
                                                  step="0.1"
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                  />
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Dimensions
                                                  </label>
                                                  <Field
                                                  name={`movingItems.${index}.dimensions`}
                                                  placeholder="L × W × H cm"
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                  />
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Value (£)
                                                  </label>
                                                  <Field
                                                  type="number"
                                                  name={`movingItems.${index}.value`}
                                                  min="0"
                                                  step="0.01"
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                  />
                                                </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                  <div className="flex space-x-4">
                                                  <label className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                                                    <Field 
                                                    type="checkbox" 
                                                    name={`movingItems.${index}.fragile`} 
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 mr-1.5" 
                                                    />
                                                    Fragile
                                                  </label>
                                                  <label className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                                                    <Field 
                                                    type="checkbox" 
                                                    name={`movingItems.${index}.needsDisassembly`} 
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 mr-1.5" 
                                                    />
                                                    Needs Disassembly
                                                  </label>
                                                  </div>
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Notes
                                                  </label>
                                                  <Field
                                                  as="textarea"
                                                  rows="2"
                                                  name={`movingItems.${index}.notes`}
                                                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                  placeholder="Any special requirements?"
                                                  />
                                                </div>
                                                </div>
                                                
                                                <div className="mt-3">
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                  Photo
                                                </label>
                                                <div className="flex items-center">
                                                  {values.movingItems[index].photo ? (
                                                  <div className="relative group mr-3">
                                                    <img 
                                                    src={typeof values.movingItems[index].photo === 'string' ? values.movingItems[index].photo : URL.createObjectURL(values.movingItems[index].photo)}
                                                    alt={values.movingItems[index].name} 
                                                    className="h-16 w-16 object-cover rounded border border-gray-200 dark:border-gray-700" 
                                                    />
                                                    <button
                                                    type="button"
                                                    onClick={() => {
                                                      setFieldValue(`movingItems.${index}.photo`, null);
                                                    }}
                                                    className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                    <FontAwesomeIcon icon={faTimes} className="text-gray-600 dark:text-gray-300 h-3 w-3" />
                                                    </button>
                                                  </div>
                                                  ) : (
                                                  <label className="cursor-pointer flex items-center justify-center h-16 w-16 bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-650 mr-3">
                                                    <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                      if (e.target.files?.[0]) {
                                                      setFieldValue(`movingItems.${index}.photo`, e.target.files[0]);
                                                      }
                                                    }}
                                                    className="sr-only"
                                                    />
                                                    <FontAwesomeIcon icon={faCamera} className="text-gray-400 dark:text-gray-500" />
                                                  </label>
                                                  )}
                                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                                  Upload an image of this item (optional)
                                                  </span>
                                                </div>
                                                </div>
                                              </div>
                                              ))}
                                            </div>
                                          ) : null}
                                          
                                          <div className="flex flex-wrap gap-2">
                                            <button
                                              type="button"
                                              onClick={() => arrayHelpers.push({
                                                name: '',
                                                category: 'furniture',
                                                quantity: 1,
                                                weight: '',
                                                dimensions: '',
                                                value: '',
                                                fragile: false,
                                                needsDisassembly: false,
                                                notes: '',
                                                photo: null
                                              })}
                                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center text-sm"
                                            >
                                              <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                              Add Custom Item
                                            </button>
                                            
                                            <div className="relative group">
                                              <button
                                                type="button"
                                                onClick={() => setShowCommonItems(true)}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-300 rounded-md flex items-center text-sm"
                                              >
                                                <FontAwesomeIcon icon={faList} className="mr-2" />
                                                Quick Add Common Items
                                              </button>
                                              
                                              {/* Modal Dialog for Common Items */}
                                              {showCommonItems && ReactDOM.createPortal(
                                                <div 
                                                  className="fixed inset-0 z-[1050] overflow-y-auto"
                                                  aria-labelledby="common-items-modal"
                                                  role="dialog"
                                                  aria-modal="true"
                                                  onClick={() => setShowCommonItems(false)}
                                                >
                                                  {/* Backdrop overlay */}
                                                  <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
                                                  
                                                  {/* Modal container - centered */}
                                                  <div className="flex items-center justify-center min-h-screen p-4">
                                                    {/* Modal content */}
                                                    <div 
                                                      className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden transform transition-all"
                                                      onClick={(e) => e.stopPropagation()}
                                                    >
                                                      {/* Modal header */}
                                                      <div className="bg-gray-50 dark:bg-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                          Quick Add Common Items
                                                        </h3>
                                                        <button
                                                          type="button"
                                                          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                                          onClick={() => setShowCommonItems(false)}
                                                        >
                                                          <span className="sr-only">Close</span>
                                                          <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                      </div>
                                                      
                                                      {/* Modal body */}
                                                      <div className="p-6">
                                                        <div className="mb-4">
                                                          <div className="flex space-x-4 mb-6 overflow-x-scroll p-4">
                                                            {/* Category buttons */}
                                                            {
                                                              commonItems.map((category, idx) => (
                                                                <button
                                                                  key={idx}
                                                                  type="button"
                                                                  onClick={() => {
                                                                    scrollToPosition(`${category.name}-section`);
                                                                  }}
                                                                  className={`${getItemIcon(category.name).tabColor} px-4 py-2 rounded-md text-sm  flex items-center`}
                                                                  ><FontAwesomeIcon icon={getItemIcon(category.name).icon} className="mr-2" />{category.name}</button>))
                                                            }
                                                           
                                                          </div>
                                                        </div>
                                                        




                                                        <div className="max-h-[60vh] overflow-y-auto pr-2">
                                                         {commonItems?.map((category)=>{
                                                           return(
                                                             <>

                                                          <div id={`${category.name}-section`} className="mb-8">
                                                            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                                              <FontAwesomeIcon icon={getItemIcon(category.name).icon} className="mr-2 text-blue-600 dark:text-blue-400" />
                                                              {category.name}
                                                            </h4>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                              {category?.items?.map((item, idx) => (
                                                                <button
                                                                  key={idx}
                                                                  type="button"
                                                                  onClick={() => {
                                                                    arrayHelpers.push({
                                                                      name: item.name,
                                                                      category: 'furniture',
                                                                      quantity: 1,
                                                                      weight: item.weight || '',
                                                                      dimensions: item.dimensions || '',
                                                                      value: '',
                                                                      fragile: item.fragile || false,
                                                                      needsDisassembly: item.needsDisassembly || false,
                                                                      notes: '',
                                                                      photo: null
                                                                    });
                                                                    setShowCommonItems(false);
                                                                  }}
                                                                  className="flex items-center text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                >
                                                                  <div className={`w-8 h-8 rounded-full ${getItemIcon(category.name).color}  flex items-center justify-center mr-3 `}>
                                                                    <FontAwesomeIcon icon={getItemIcon(category.name).icon}  />
                                                                  </div>
                                                                  <div>
                                                                    <div className="font-medium text-gray-800 dark:text-gray-200">{item.name}</div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                      {item.dimensions} • {item.weight} kg
                                                                      {item.needsDisassembly && " • Needs disassembly"}
                                                                    </div>
                                                                  </div>
                                                                </button>
                                                              ))}
                                                            </div>
                                                          </div>



                                                             
                                                             </>
                                                           )
                                                         })}
                                                        </div>
                                                       
                                                      </div>
                                                      
                                                      {/* Modal footer */}
                                                      <div className="bg-gray-50 dark:bg-gray-750 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                                        <button
                                                          type="button"
                                                          className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-md text-sm"
                                                          onClick={() => setShowCommonItems(false)}
                                                        >
                                                          Close
                                                        </button>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>,
                                                document.body
                                              )}
                                            </div>
                                            
                                            {values.movingItems && values.movingItems.length > 0 && (
                                              <button
                                                type="button"
                                                onClick={() => setFieldValue('movingItems', [])}
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md text-sm"
                                              >
                                                Clear All Items
                                              </button>
                                            )}
                                          </div>
                                          
                                          {values.movingItems && values.movingItems.length > 0 && (
                                            <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start">
                                              <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 dark:text-blue-400 mt-0.5 mr-3" />
                                              <div>
                                                <span className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                                                  Item Summary
                                                </span>
                                                <span className="block text-sm text-blue-600 dark:text-blue-400">
                                                  {values.movingItems.reduce((sum: number, item: { quantity: string; }) => sum + (parseInt(item.quantity) || 0), 0)} items · 
                                                   {values.movingItems.reduce((sum: number, item: MovingItem) => sum + ((parseFloat(item.weight || '0') || 0) * (parseInt(item.quantity.toString()) || 0)), 0).toFixed(1)} kg ·
                                                    {values.movingItems.some((item: MovingItem) => item.fragile) && " Includes fragile items ·"}
                                                    {values.movingItems.some((item: MovingItem) => item.needsDisassembly) && " Some items need disassembly"}
                                                </span>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    />
                                  </div>
                                </div>
                              )}
      
                              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Documentation</h3>
                                </div>
                                <div className="p-6">
                                  <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        Inventory List (PDF)
                                      </label>
                                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors duration-200">
                                        <div className="space-y-1 text-center">
                                          <FontAwesomeIcon icon={faFileUpload} className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                            <label htmlFor="inventoryList" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                              <span>Upload a file</span>
                                              <input 
                                                id="inventoryList"
                                                name="inventoryList"
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => setFieldValue('inventoryList', e.target.files?.[0])}
                                                className="sr-only"
                                              />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                          </div>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PDF up to 10MB
                                          </p>
                                        </div>
                                      </div>
                                      {values.inventoryList && (
                                        <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                                          <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5" />
                                          {typeof values.inventoryList === 'string' ? values.inventoryList : values.inventoryList.name}
                                        </p>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FontAwesomeIcon icon={faImage} className="mr-2 text-blue-600 dark:text-blue-400" />
                                        Item Photos
                                      </label>
                                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors duration-200">
                                        <div className="space-y-1 text-center">
                                          <FontAwesomeIcon icon={faCamera} className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                            <label htmlFor="photos" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                              <span>Upload photos</span>
                                              <input 
                                                id="photos"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, setFieldValue)}
                                                className="sr-only"
                                              />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                          </div>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG, GIF up to 5MB each
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* {previewImages.length > 0 && (
                                    <div className="mt-6">
                                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {previewImages.map((img, index) => (
                                          <div key={index} className="relative group">
                                            <img 
                                              src={img} 
                                              alt={`Preview ${index + 1}`} 
                                              className="h-24 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700" 
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newImages = [...previewImages];
                                                newImages.splice(index, 1);
                                                setPreviewImages(newImages);
                                                
                                                // Also update the field value
                                                const newUrls = [...(values.photoURLs || [])];
                                                newUrls.splice(index, 1);
                                                setFieldValue('photoURLs', newUrls);
                                              }}
                                              className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <FontAwesomeIcon icon={faTimes} className="text-gray-600 dark:text-gray-300 h-3 w-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )} */}
                                </div>
                              </div>
      
                              
                            </div>

      <StepNavigation onNext={onNext} onBack={onBack} />
    </div>
  );
};

export default ServiceDetailsStep;