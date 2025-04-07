import React from 'react';
import StepNavigation from './stepNavigation';

import {
  faCalendarAlt,
  
  faCalendarCheck,
  faClock,
  faClipboardCheck,
  
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field } from 'formik';

const ScheduleStep = ({ values, isSubmitting, onBack, isEditing }: any) => {
  console.log("values in schedule step", values)
  return (
    <div className="space-y-6 animate-fadeIn">
     <div className="space-y-6 animate-fadeIn">
                             <div className="flex items-center mb-6">
                               <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                 <FontAwesomeIcon icon={faCalendarAlt} />
                               </div>
                               <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Scheduling & Instructions</h2>
                             </div>
                             
                             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                               <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                                 <h3 className="font-medium text-gray-800 dark:text-gray-200">Preferred Date & Time</h3>
                               </div>
                               <div className="p-6 space-y-6">
                                 <div className="grid gap-6 md:grid-cols-2">
                                   <div>
                                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                       <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-600 dark:text-blue-400" />
                                       Preferred Date <span className="text-red-500">*</span>
                                     </label>
                                     <Field 
                                       name="preferredDate" 
                                       type="date" 
                                       min={new Date().toISOString().split('T')[0]}
                                       className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                     />
                                     <ErrorMessage name="preferredDate" component="p" className="text-red-500 text-sm mt-1" />
                                   </div>
     
                                   <div>
                                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                       <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-600 dark:text-blue-400" />
                                       Preferred Time <span className="text-red-500">*</span>
                                     </label>
                                     <Field 
                                       as="select" 
                                       name="preferredTime" 
                                       className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                     >
                                       <option value="">Select a time slot</option>
                                       <option value="8:00 - 10:00">8:00 - 10:00</option>
                                       <option value="10:00 - 12:00">10:00 - 12:00</option>
                                       <option value="12:00 - 14:00">12:00 - 14:00</option>
                                       <option value="14:00 - 16:00">14:00 - 16:00</option>
                                       <option value="16:00 - 18:00">16:00 - 18:00</option>
                                       <option value="18:00 - 20:00">18:00 - 20:00</option>
                                     </Field>
                                     <ErrorMessage name="preferredTime" component="p" className="text-red-500 text-sm mt-1" />
                                   </div>
                                 </div>
                                 
                                 <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                   <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                     <Field 
                                       type="checkbox" 
                                       name="isFlexible" 
                                       className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600" 
                                     />
                                     <span className="ml-2 flex items-center font-medium">
                                       <FontAwesomeIcon icon={faCalendarCheck} className="mr-1.5 text-blue-600 dark:text-blue-400" />
                                       I'm flexible with scheduling
                                     </span>
                                   </label>
                                   <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                                     If selected, providers may suggest alternative times that could result in lower pricing
                                   </p>
                                 </div>
                                 
                                 <div className="pt-4">
                                   <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Scheduling Preferences</h4>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-150">
                                       <Field 
                                         type="radio" 
                                         name="serviceSpeed" 
                                         value="standard" 
                                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600" 
                                       />
                                       <span className="ml-3 text-gray-700 dark:text-gray-300">
                                         <span className="font-medium block text-gray-800 dark:text-white">Standard Service</span>
                                         <span className="text-xs text-gray-500 dark:text-gray-400">Regular scheduling and pricing</span>
                                       </span>
                                     </label>
                                     <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-150">
                                       <Field 
                                         type="radio" 
                                         name="serviceSpeed" 
                                         value="express" 
                                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600" 
                                       />
                                       <span className="ml-3 text-gray-700 dark:text-gray-300">
                                         <span className="font-medium block text-gray-800 dark:text-white">Express Service</span>
                                         <span className="text-xs text-gray-500 dark:text-gray-400">Premium rate for faster service</span>
                                       </span>
                                     </label>
                                   </div>
                                 </div>
                               </div>
                             </div>
                             
                             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                               <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                                 <h3 className="font-medium text-gray-800 dark:text-gray-200">Additional Instructions</h3>
                               </div>
                               <div className="p-6">
                                 <Field
                                   as="textarea"
                                   name="description"
                                   rows={4}
                                   className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                   placeholder="Please provide any special instructions, access details, or specific requirements for this job..."
                                 />
                                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                   Include details like access codes, special handling instructions, or any unique requirements.
                                 </p>
                               </div>
                             </div>
                             
                             {/* Review Summary */}
                             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                               <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-b border-gray-200 dark:border-gray-700">
                                 <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                   <FontAwesomeIcon icon={faClipboardCheck} className="mr-2 text-green-600 dark:text-green-400" />
                                   Review Your Request
                                 </h3>
                               </div>
                               <div className="p-6 space-y-4">
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                   <div>
                                     <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Details</h4>
                                     <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                       <li><span className="font-medium">Name:</span> {values.contactName}</li>
                                       <li><span className="font-medium">Phone:</span> {values.contactPhone}</li>
                                       <li><span className="font-medium">Email:</span> {values.contactEmail}</li>
                                     </ul>
                                   </div>
                                   <div>
                                     <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Service Details</h4>
                                     <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                       <li><span className="font-medium">Type:</span> {values.itemType}</li>
                                       <li><span className="font-medium">Size:</span> {values.itemSize}</li>
                                       <li><span className="font-medium">Pricing:</span> {values.requestType === 'fixed' ? 'Fixed Price' : values.requestType === 'bidding' ? 'Competitive Bidding' : 'Multi-Stop Journey'}</li>
                                     </ul>
                                   </div>
                                   <div>
                                     <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Scheduling</h4>
                                     <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                       <li><span className="font-medium">Date:</span> {values.preferredDate}</li>
                                       <li><span className="font-medium">Time:</span> {values.preferredTime}</li>
                                       <li><span className="font-medium">Flexible:</span> {values.isFlexible ? 'Yes' : 'No'}</li>
                                     </ul>
                                   </div>
                                 </div>
                                 
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                   <div>
                                     <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Pickup Location</h4>
                                     <p className="text-gray-600 dark:text-gray-400">{values.pickupLocation}</p>
                                     {(values.pickupUnitNumber || values.pickupFloor > 0) && (
                                       <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                         {values.pickupUnitNumber && `Unit ${values.pickupUnitNumber}, `}
                                         {values.pickupFloor > 0 && `Floor ${values.pickupFloor}`}
                                       </p>
                                     )}
                                   </div>
                                   <div>
                                     <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Dropoff Location</h4>
                                     <p className="text-gray-600 dark:text-gray-400">{values.dropoffLocation}</p>
                                     {(values.dropoffUnitNumber || values.dropoffFloor > 0) && (
                                       <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                         {values.dropoffUnitNumber && `Unit ${values.dropoffUnitNumber}, `}
                                         {values.dropoffFloor > 0 && `Floor ${values.dropoffFloor}`}
                                       </p>
                                     )}
                                   </div>
                                 </div>
     
                                 {values.requestType === 'journey' && values.journeyStops.length > 0 && (
                                   <div className="col-span-3 mt-4">
                                     <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Journey Stops ({values.journeyStops.length})</h4>
                                     <div className="bg-gray-50 dark:bg-gray-750 p-3 rounded-lg">
                                       {values.journeyStops.map((stop: { id: any; type: string; location: any; }, idx: number) => (
                                         <div key={`summary-${stop.id}`} className="flex items-center mb-2">
                                           <div className={`
                                             w-6 h-6 rounded-full flex items-center justify-center mr-2
                                             ${stop.type === 'pickup' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : ''}
                                             ${stop.type === 'dropoff' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : ''}
                                             ${stop.type === 'stop' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300' : ''}
                                           `}>
                                             {idx + 1}
                                           </div>
                                           <div>
                                             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                               {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}:
                                             </span>
                                             <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                                               {stop.location || '(Address not entered)'}
                                             </span>
                                           </div>
                                         </div>
                                       ))}
                                     </div>
                                   </div>
                                 )}
                                 
                                 <div className="text-center text-sm mt-4">
                                   <p className="text-gray-600 dark:text-gray-400">
                                     By submitting this request, you agree to our <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.
                                   </p>
                                 </div>
                               </div>
                             </div>
     
                             
                           </div>

      <StepNavigation 
        onBack={onBack} 
        nextLabel={isEditing ? "Update Request" : "Submit Request"} 
        isLastStep={true}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ScheduleStep;