import React from 'react';
import type { ActivityItem } from '../types/dashboard.types';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="activity-card">
      <h3 className="activity-card-header">
        Recent Activity
        <button className="activity-see-all-btn">See All</button>
      </h3>
      <div className="activity-list">
        {activities.map((act) => (
          <div key={act.id} className="activity-item">
            <div className="activity-avatar-wrap">
              <img
                src={typeof act.avatar === 'string' ? act.avatar : (act.user as any)?.avatar}
                alt={typeof act.user === 'string' ? act.user : (act.user as any)?.name}
                className="activity-avatar"
              />
              <div className="activity-online-dot"></div>
            </div>
            <div className="activity-content">
              <p className="activity-text">
                <span className="activity-user">
                  {typeof act.user === 'string' ? act.user : (act.user as any)?.name}
                </span>
                <span className="mx-1">{act.action}</span>
                {act.badge && (
                  <span className="activity-badge">{act.badge}</span>
                )}
                <span className="activity-target">{act.target}</span>
              </p>
              <p className="activity-time">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
