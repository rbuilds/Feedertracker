import { initialCellsData } from '../data/initialData';
import { calculateStats } from './calculations';

/**
 * Process history data into graph data points for each quadrant
 * @param {Array} allHistory - Array of history entries with timestamps
 * @returns {Object} - Object with arrays of data points for each quadrant
 */
export const processHistoryForGraph = (allHistory) => {
  const quadrantDataPoints = { NE: [], NW: [], SE: [], SW: [] };
  const quadrantCellIds = { NE: [], NW: [], SE: [], SW: [] };

  // Group cell IDs by quadrant
  initialCellsData.forEach(c => {
    if (quadrantCellIds[c.quadrant]) {
      quadrantCellIds[c.quadrant].push(c.id);
    }
  });

  // Process history for each quadrant
  for (const quad of ['NE', 'NW', 'SE', 'SW']) {
    const quadHistory = allHistory.filter(change => {
      const cellInfo = initialCellsData.find(c => c.id === change.itemId);
      return cellInfo && cellInfo.quadrant === quad && change.itemType === 'cell';
    });

    if (quadHistory.length > 0) {
      const currentStatuses = {};
      quadrantCellIds[quad].forEach(id => currentStatuses[id] = 'NOT_STARTED');

      quadHistory.forEach(change => {
        currentStatuses[change.itemId] = change.status;
        const cellsForStats = Object.keys(currentStatuses).map(id => ({ status: currentStatuses[id] }));
        const stats = calculateStats(cellsForStats);

        quadrantDataPoints[quad].push({
          time: new Date(change.timestamp.seconds * 1000),
          percentComplete: stats.total > 0 ? (stats.earned / stats.total) * 100 : 0,
          itemId: change.itemId,
        });
      });
    }
  }

  return quadrantDataPoints;
};

/**
 * Get latest timestamps for each item from history
 * @param {Array} history - Array of history entries
 * @returns {Object} - Object mapping item IDs to formatted timestamp strings
 */
export const getLatestTimestamps = (history) => {
  const latestTimestamps = {};
  history.forEach(entry => {
    if (entry.timestamp) {
      latestTimestamps[entry.itemId] = entry.timestamp.toDate().toLocaleString();
    }
  });
  return latestTimestamps;
};
