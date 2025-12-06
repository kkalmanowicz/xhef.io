import React from 'react';
import DashboardSection from './DashboardSection';

const PrepListSection = ({ prepItems }) => (
  <DashboardSection title="Today's Prep List" link="/dashboard/prep-list">
    <div className="space-y-4">
      {prepItems.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">All prep items are up to date.</p>
      ) : (
        prepItems.slice(0, 3).map((item) => (
          <div key={item.id} className={`p-4 rounded-lg border-l-4 ${item.status === 'urgent' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current: {item.current_stock} {item.yield_unit} / Par: {item.par_level} {item.yield_unit}</p>
              </div>
              <span className={`text-sm font-medium ${item.status === 'urgent' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{item.status === 'urgent' ? 'Urgent' : 'Needed'}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </DashboardSection>
);

export default PrepListSection;