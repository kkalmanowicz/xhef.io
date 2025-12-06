import React from 'react';

const ActivityItem = ({ activity }) => (
  <div className="flex items-center space-x-4">
    <div className="flex-1">
      <p className="text-sm">{activity.description}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {new Date(activity.created_at).toLocaleString()}
      </p>
    </div>
  </div>
);

export default ActivityItem;