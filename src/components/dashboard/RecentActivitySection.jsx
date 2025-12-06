import React from 'react';
import DashboardSection from './DashboardSection';
import ActivityItem from './ActivityItem';

const RecentActivitySection = ({ recentActivity }) => (
  <DashboardSection title="Recent Activity" actionText="">
    <div className="space-y-4">
      {recentActivity.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No recent activity.</p>
      ) : (
        recentActivity.map((activity) => <ActivityItem key={activity.id} activity={activity} />)
      )}
    </div>
  </DashboardSection>
);

export default RecentActivitySection;