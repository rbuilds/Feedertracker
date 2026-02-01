import React from 'react';
import { STATUSES } from '../constants';

/**
 * StatCard - A reusable component to display summary statistics with an optional progress bar
 */
const StatCard = ({ title, value, percentage, bgColor = 'bg-white', progressData = null }) => {
  const total = progressData ? Object.values(progressData).reduce((sum, count) => sum + count, 0) : 0;

  return (
    <div className={`p-3 rounded-lg shadow ${bgColor}`}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <span className="text-sm font-semibold text-green-600">{percentage}</span>
      </div>
      <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
      {progressData && total > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2 flex overflow-hidden border border-gray-300">
          {Object.keys(STATUSES).map((statusKey) => {
            const count = progressData[statusKey] || 0;
            if (count === 0) return null;
            const statusInfo = STATUSES[statusKey];
            const widthPercentage = (count / total) * 100;
            return (
              <div
                key={statusKey}
                className={`${statusInfo.color.split(' ')[0]}`}
                style={{ width: `${widthPercentage}%` }}
                title={`${statusInfo.text}: ${count}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatCard;
