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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LocationDetailStep =()=>{
    return(
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

                        {/* Multi-stop Journey Planning - only shown for journey type */}
                        {values.requestType === 'journey' && (
                          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-6">
                              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                                <FontAwesomeIcon icon={faRoute} />
                              </div>
                              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Journey Planning</h2>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
                              <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                  <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2 text-green-600 dark:text-green-400" />
                                  Plan Your Route
                                </h3>
                              </div>
                              <div className="p-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                  Add all pickup, drop-off, and stop locations in your journey. Drag to reorder.
                                </p>
                                
                                <FieldArray
                                  name="journeyStops"
                                  render={arrayHelpers => (
                                    <div>
                                      {values.journeyStops && values.journeyStops.length > 0 ? (
                                        <>
                                          <DragDropContext
                                            onDragEnd={(result) => {
                                              if (!result.destination) return;
                                              
                                              const items = Array.from(values.journeyStops);
                                              const [reorderedItem] = items.splice(result.source.index, 1);
                                              items.splice(result.destination.index, 0, reorderedItem);
                                              
                                              setFieldValue('journeyStops', items);
                                            }}
                                          >
                                            <Droppable droppableId="journeyStops">
                                              {(provided) => (
                                                <div
                                                  {...provided.droppableProps}
                                                  ref={provided.innerRef}
                                                  className="space-y-4 mb-6"
                                                >
                                                  {values.journeyStops.map((stop, index) => (
                                                    <Draggable
                                                      key={stop.id}
                                                      draggableId={stop.id}
                                                      index={index}
                                                    >
                                                      {(provided) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          className={`
                                                            border rounded-lg p-4 
                                                            ${stop.type === 'pickup' ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' : ''}
                                                            ${stop.type === 'dropoff' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : ''}
                                                            ${stop.type === 'stop' ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20' : ''}
                                                          `}
                                                        >
                                                          <div className="flex items-start">
                                                            <div 
                                                              {...provided.dragHandleProps}
                                                              className="mr-3 cursor-grab flex-shrink-0 mt-2"
                                                            >
                                                              <FontAwesomeIcon icon={faGripLines} className="text-gray-400" />
                                                            </div>
                                                            
                                                            <div className={`
                                                              w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-2
                                                              ${stop.type === 'pickup' ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' : ''}
                                                              ${stop.type === 'dropoff' ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' : ''}
                                                              ${stop.type === 'stop' ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300' : ''}
                                                            `}>
                                                              {index + 1}
                                                            </div>
                                                            
                                                            <div className="flex-1">
                                                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div className="md:col-span-3">
                                                                  <div className="flex justify-between items-center mb-3">
                                                                    <Field
                                                                      as="select"
                                                                      name={`journeyStops.${index}.type`}
                                                                      className="border-none bg-transparent text-sm font-medium focus:ring-0 p-0"
                                                                    >
                                                                      <option value="pickup">Pickup Location</option>
                                                                      <option value="stop">Intermediate Stop</option>
                                                                      <option value="dropoff">Dropoff Location</option>
                                                                    </Field>
                                                                    
                                                                    <button
                                                                      type="button"
                                                                      onClick={() => arrayHelpers.remove(index)}
                                                                      className="p-1 text-gray-400 hover:text-red-500"
                                                                    >
                                                                      <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                  </div>
                                                                  
                                                                  <div className="relative mb-3">
                                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                                                    <Field 
                                                                      name={`journeyStops.${index}.location`}
                                                                      placeholder="Enter full address"
                                                                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 pl-10 pr-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                    />
                                                                  </div>
                                                                </div>
                                                                
                                                                <div>
                                                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                    Floor
                                                                  </label>
                                                                  <Field 
                                                                    name={`journeyStops.${index}.floor`} 
                                                                    type="number" 
                                                                    min="0"
                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                                                  />
                                                                </div>
                                                                
                                                                <div>
                                                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                    Unit/Apt #
                                                                  </label>
                                                                  <Field 
                                                                    name={`journeyStops.${index}.unitNumber`} 
                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                                                  />
                                                                </div>
                                                                
                                                                <div>
                                                                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                    <FontAwesomeIcon icon={faCar} className="mr-2 text-gray-500" />
                                                                    Parking Info
                                                                  </label>
                                                                  <Field 
                                                                    name={`journeyStops.${index}.parkingInfo`} 
                                                                    placeholder="e.g., Street parking"
                                                                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                                                  />
                                                                </div>
                                                              </div>
                                                              
                                                              <div className="mt-3">
                                                                <details className="text-sm">
                                                                  <summary className="text-blue-600 dark:text-blue-400 cursor-pointer">
                                                                    Additional details
                                                                  </summary>
                                                                  <div className="mt-3 pl-2 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
                                                                    <div>
                                                                      <label className="flex items-center text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                        <Field 
                                                                          type="checkbox" 
                                                                          name={`journeyStops.${index}.hasElevator`} 
                                                                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-1.5" 
                                                                        />
                                                                        <FontAwesomeIcon icon={faElevator} className="mr-1.5" />
                                                                        Elevator Access
                                                                      </label>
                                                                    </div>
                                                                    
                                                                    <div>
                                                                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                        Special Instructions
                                                                      </label>
                                                                      <Field
                                                                        as="textarea"
                                                                        rows="2"
                                                                        name={`journeyStops.${index}.instructions`}
                                                                        placeholder="Any specific details for this location"
                                                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                                      />
                                                                    </div>
                                                                    
                                                                    <div>
                                                                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                        <FontAwesomeIcon icon={faClock} className="mr-1.5" />
                                                                        Estimated Time at Location
                                                                      </label>
                                                                      <Field 
                                                                        name={`journeyStops.${index}.estimatedTime`}
                                                                        placeholder="e.g., 30 minutes"
                                                                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" 
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                </details>
                                                              </div>
                                                            </div>
                                                          </div>
                                                          
                                                          {/* Connection line between stops */}
                                                          {index < values.journeyStops.length - 1 && (
                                                            <div className="ml-11 pl-3 mt-4 border-l-2 border-dashed border-gray-300 dark:border-gray-600 pb-2">
                                                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                                <FontAwesomeIcon icon={faTruck} className="mr-2 opacity-70" />
                                                                <span>Next Stop</span>
                                                              </div>
                                                            </div>
                                                          )}
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  ))}
                                                  {provided.placeholder}
                                                </div>
                                              )}
                                            </Droppable>
                                          </DragDropContext>
                                          
                                          {/* Journey Map Visualization */}
                                          <div className="mt-8 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Journey Overview</h4>
                                            
                                            <div className="relative">
                                              {/* Vertical timeline line */}
                                              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                                              
                                              <div className="space-y-6">
                                                {values.journeyStops.map((stop, idx) => (
                                                  <div key={`map-${stop.id}`} className="relative flex items-start pl-8">
                                                    {/* Timeline node */}
                                                    <div className={`
                                                      absolute left-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center
                                                      border-2 border-white dark:border-gray-800
                                                      ${stop.type === 'pickup' ? 'bg-blue-500 dark:bg-blue-600' : ''}
                                                      ${stop.type === 'dropoff' ? 'bg-green-500 dark:bg-green-600' : ''}
                                                      ${stop.type === 'stop' ? 'bg-yellow-500 dark:bg-yellow-600' : ''}
                                                    `}>
                                                      <span className="text-white text-xs font-bold">{idx + 1}</span>
                                                    </div>
                                                    
                                                    {/* Location card */}
                                                    <div className="flex-1">
                                                      <div className="flex items-center mb-1">
                                                        <span className={`
                                                          text-xs font-semibold px-2 py-0.5 rounded-full mr-2
                                                          ${stop.type === 'pickup' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                                                          ${stop.type === 'dropoff' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                                                          ${stop.type === 'stop' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                                                        `}>
                                                          {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                          {stop.location || '(Address not entered)'}
                                                        </span>
                                                      </div>
                                                      
                                                      {(stop.unitNumber || stop.floor > 0) && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                          {stop.unitNumber && `Unit ${stop.unitNumber}, `}
                                                          {stop.floor > 0 && `Floor ${stop.floor}`}
                                                          {stop.hasElevator && ', Elevator available'}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <div className="text-center py-8">
                                          <p className="text-gray-500 dark:text-gray-400 mb-4">No journey stops added yet</p>
                                        </div>
                                      )}
                                      
                                      {/* Add location buttons */}
                                      <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                          type="button"
                                          onClick={() => addJourneyStop(values, setFieldValue, 'pickup')}
                                          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 
                                            shadow-sm text-sm rounded-md text-gray-700 dark:text-gray-300 
                                            bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                          <FontAwesomeIcon icon={faPlus} className="mr-2 text-blue-500 dark:text-blue-400" />
                                          Add Pickup
                                        </button>
                                        
                                        <button
                                          type="button"
                                          onClick={() => addJourneyStop(values, setFieldValue, 'stop')}
                                          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 
                                            shadow-sm text-sm rounded-md text-gray-700 dark:text-gray-300 
                                            bg-white dark:bg-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                                        >
                                          <FontAwesomeIcon icon={faPlus} className="mr-2 text-yellow-500 dark:text-yellow-400" />
                                          Add Stop
                                        </button>
                                        
                                        <button
                                          type="button"
                                          onClick={() => addJourneyStop(values, setFieldValue, 'dropoff')}
                                          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 
                                            shadow-sm text-sm rounded-md text-gray-700 dark:text-gray-300 
                                            bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                        >
                                          <FontAwesomeIcon icon={faPlus} className="mr-2 text-green-500 dark:text-green-400" />
                                          Add Dropoff
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="py-4 flex flex-col items-center">
                          <div className="flex items-center w-full max-w-md">
                            <div className="flex flex-col items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-sm">A</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pickup</div>
                            </div>
                            <div className="flex-1 mx-4 relative">
                              <div className="h-1 bg-gradient-to-r from-blue-500 to-green-500 dark:from-blue-400 dark:to-green-400 w-full"></div>
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded text-xs font-medium text-gray-600 dark:text-gray-300">
                                <FontAwesomeIcon icon={faTruck} className="mr-1.5" />
                                {values.pickupLocation && values.dropoffLocation ? 
                                  "~30 miles" : 
                                  "Enter addresses to see estimate"
                                }
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="h-8 w-8 rounded-full bg-green-600 dark:bg-green-500 text-white flex items-center justify-center text-sm">B</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dropoff</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <button 
                            type="button" 
                            onClick={moveToPreviousStep} 
                            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 flex items-center"
                          >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Previous: Contact
                          </button>
                          <button 
                            type="button" 
                            onClick={moveToNextStep} 
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white font-medium rounded-lg flex items-center transition-colors duration-200"
                          >
                            Next: Details
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                          </button>
                        </div>
                      </div>    )
}


export default LocationDetailStep;