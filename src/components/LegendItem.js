import React from 'react';

/**
 * LegendItem - A reusable component to display a single item in the status legend
 */
const LegendItem = ({ status }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-5 h-5 rounded-full ${status.color.split(' ')[0]}`} />
    <span className="text-sm text-gray-600">{status.text}</span>
  </div>
);

export default LegendItem;
