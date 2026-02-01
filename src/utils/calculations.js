import { STATUSES } from '../constants';

/**
 * Calculate statistics for a given array of cells.
 * Earned Value Calculation: 'COMPLETE' counts as 1, 'ROUGH_CUT' counts as 0.5.
 *
 * @param {Array} filteredCells - Array of cell objects with status property
 * @returns {Object} - Object containing earned value, total count, and status counts
 */
export const calculateStats = (filteredCells) => {
  const total = filteredCells.length;
  if (total === 0) return { earned: 0, total: 0, statusCounts: {} };

  const earned = filteredCells.reduce((acc, cell) => {
    if (cell.status === 'COMPLETE') return acc + 1;
    if (cell.status === 'ROUGH_CUT') return acc + 0.5;
    return acc;
  }, 0);

  const statusCounts = filteredCells.reduce((acc, cell) => {
    const status = cell.status || 'NOT_STARTED';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Ensure all status keys exist with at least 0 count
  Object.keys(STATUSES).forEach(statusKey => {
    if (!statusCounts[statusKey]) statusCounts[statusKey] = 0;
  });

  return { earned, total, statusCounts };
};

/**
 * Calculate quadrant data from cells
 * @param {Array} cells - Array of all cells
 * @returns {Object} - Object with quadrant statistics
 */
export const calculateQuadrantData = (cells) => ({
  NE: calculateStats(cells.filter(c => c.quadrant === 'NE')),
  NW: calculateStats(cells.filter(c => c.quadrant === 'NW')),
  SE: calculateStats(cells.filter(c => c.quadrant === 'SE')),
  SW: calculateStats(cells.filter(c => c.quadrant === 'SW')),
});

/**
 * Calculate face data (East/West) from cells
 * @param {Array} cells - Array of all cells
 * @returns {Object} - Object with face statistics
 */
export const calculateFaceData = (cells) => ({
  West: calculateStats(cells.filter(c => ['NW', 'SW'].includes(c.quadrant))),
  East: calculateStats(cells.filter(c => ['NE', 'SE'].includes(c.quadrant))),
});

/**
 * Format quadrant name to full display name
 * @param {string} quadrant - Short quadrant code (NE, NW, SE, SW)
 * @returns {string} - Full quadrant name
 */
export const getQuadrantFullName = (quadrant) => {
  const names = {
    'NE': 'NORTH EAST',
    'NW': 'NORTH WEST',
    'SE': 'SOUTH EAST',
    'SW': 'SOUTH WEST'
  };
  return names[quadrant] || quadrant;
};
