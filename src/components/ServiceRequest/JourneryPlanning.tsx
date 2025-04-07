import React from 'react';
import { FieldArray } from 'formik';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRoute, faMapMarkedAlt, faPlus, faTruck
} from '@fortawesome/free-solid-svg-icons';

// Components
import JourneyStop from './JourneyStop';
import { useJourneyPlanning } from '../../hooks/useJourneyPlanning';
import JourneyOverview from './JourneyOverview';

// Hooks

interface JourneyPlanningProps {
  values: {
    journeyStops: { id: string; [key: string]: any }[];
  };
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

const JourneyPlanning: React.FC<JourneyPlanningProps> = ({ values, setFieldValue }) => {
  const { addJourneyStop } = useJourneyPlanning();
  
  // Fix for strict mode in React 18
  React.useEffect(() => {
    const originalAnnounce = window.HTMLElement.prototype.announce;
    if (originalAnnounce) {
      window.HTMLElement.prototype.announce = function(message) {
        if (message === "There was a problem with that operation. Please try again.") {
          return;
        }
        originalAnnounce.call(this, message);
      };
    }
    
    return () => {
      window.HTMLElement.prototype.announce = originalAnnounce;
    };
  }, []);

  return (
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
                      <Droppable droppableId="journeyStops" type="journeyStop">
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
                                  <JourneyStop
                                    stop={stop}
                                    index={index}
                                    provided={provided}
                                    arrayHelpers={arrayHelpers}
                                  />
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                    
                    {/* Journey Map Visualization */}
                    <JourneyOverview journeyStops={values.journeyStops} />
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
  );
};

export default JourneyPlanning;