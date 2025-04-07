import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

interface JourneyOverviewProps {
  journeyStops: any[];
}

const JourneyOverview: React.FC<JourneyOverviewProps> = ({ journeyStops }) => {
  // Calculate estimated journey time based on number of stops
  const estimatedHours = Math.max(1, journeyStops.length * 0.5);
  
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-white mb-4">Journey Overview</h4>
      
      {/* Journey stats */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Estimated Journey</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {journeyStops.length} locations • 
              {journeyStops.length <= 2 ? ' Direct path' : ` ${journeyStops.length-1} stops`}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">~{estimatedHours} hrs</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Estimated time</p>
          </div>
        </div>
      </div>
      
      {/* Vertical timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
        
        <div className="space-y-6">
          {journeyStops.map((stop, idx) => (
            <div key={`map-${stop.id}`} className="relative flex items-start">
              {/* Timeline node */}
              <div className={`
                absolute left-0 mt-1.5 w-6 h-6 rounded-full flex items-center justify-center
                border-2 border-white dark:border-gray-800
                ${stop.type === 'pickup' ? 'bg-blue-500' : ''}
                ${stop.type === 'dropoff' ? 'bg-green-500' : ''}
                ${stop.type === 'stop' ? 'bg-yellow-500' : ''}
              `}>
                <span className="text-white text-xs font-bold">{idx + 1}</span>
              </div>
              
              {/* Location card */}
              <div className="ml-10 bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 flex-1">
                <div className="flex justify-between">
                  <div>
                    <span className={`
                      text-xs font-semibold px-2 py-1 rounded-full 
                      ${stop.type === 'pickup' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                      ${stop.type === 'dropoff' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                      ${stop.type === 'stop' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                    `}>
                      {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}
                    </span>
                    
                    <div className="mt-1.5 font-medium">
                      {stop.location || <span className="text-gray-400 dark:text-gray-500 italic">Address not entered</span>}
                    </div>
                    
                    {(stop.unitNumber || stop.floor > 0) && (
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {stop.unitNumber && <span>Unit {stop.unitNumber}</span>}
                        {stop.floor > 0 && <span className="ml-1">{stop.unitNumber ? ',' : ''} Floor {stop.floor}</span>}
                      </div>
                    )}
                    
                    {(stop.instructions || stop.estimatedTime) && (
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {stop.instructions && (
                          <div className="italic text-xs">{stop.instructions}</div>
                        )}
                        {stop.estimatedTime && (
                          <div className="text-xs mt-1">Time at location: {stop.estimatedTime}</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      // Scroll to the location's input field
                      document.getElementById(`location-${stop.id}`)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JourneyOverview;