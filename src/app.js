import React, { useState } from 'react';
import { FileDown } from 'lucide-react';

// Constants
import { STATUSES } from './constants';

// Data
import { neData } from './data/initialData';

// Hooks
import { useFirebaseAuth, useFirebaseData, useStatusUpdate } from './hooks/useFirebase';
import { useXlsxExport } from './hooks/useXlsxExport';

// Components
import {
  ErrorContainer,
  StatCard,
  LegendItem,
  Cell,
  BorescopeItem,
  SvgProgressGraph
} from './components';

// Utils
import { calculateQuadrantData, calculateFaceData, getQuadrantFullName } from './utils';

/**
 * Main App Component
 * Refactored for improved maintainability and error handling
 */
export default function App() {
  // State for active quadrant view
  const [activeQuadrant, setActiveQuadrant] = useState('NE');

  // Firebase authentication and connection
  const { db, isAuthReady, authError, clearAuthError } = useFirebaseAuth();

  // Real-time data subscriptions
  const {
    cells,
    borescopeItems,
    history,
    graphData,
    loading,
    dataError,
    clearDataError
  } = useFirebaseData(db, isAuthReady);

  // Status update handler with error handling
  const {
    handleUpdateStatus,
    updateError,
    clearUpdateError
  } = useStatusUpdate(db);

  // Excel export functionality
  const {
    xlsxLoaded,
    handleExport,
    exportError,
    clearExportError
  } = useXlsxExport();

  // Collect all errors for display
  const errors = [
    { message: authError, onDismiss: clearAuthError },
    { message: dataError, onDismiss: clearDataError },
    { message: updateError, onDismiss: clearUpdateError },
    { message: exportError, onDismiss: clearExportError }
  ];

  // Data computations for rendering
  const banks = Array.from({ length: 48 }, (_, i) => i + 1);
  const quadrantData = calculateQuadrantData(cells);
  const faceData = calculateFaceData(cells);
  const activeCells = cells.filter(c => c.quadrant === activeQuadrant);
  const activeBorescopeItems = borescopeItems.filter(i => i.quadrant === activeQuadrant);

  // Export handler wrapper
  const onExport = () => {
    handleExport(cells, borescopeItems, history, graphData, faceData, quadrantData);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700">Loading Tracker...</div>
          <div className="mt-2 text-sm text-gray-500">Connecting to database</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      {/* Error notifications */}
      <ErrorContainer errors={errors} />

      <div className="max-w-full mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <h1 className="text-3xl font-bold text-red-600 uppercase">
              Upper Feeder Removal Tracker
            </h1>
            <button
              onClick={onExport}
              disabled={!xlsxLoaded}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {xlsxLoaded ? (
                <>
                  <FileDown size={16} /> Export to Excel
                </>
              ) : (
                'Loading...'
              )}
            </button>
          </div>
        </header>

        {/* Summary Statistics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Face Earned Value */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow h-full">
              <h2 className="font-bold text-gray-700 mb-2">Face Earned Value</h2>
              <div className="space-y-3">
                {Object.entries(faceData).map(([key, data]) => (
                  <StatCard
                    key={key}
                    title={key}
                    value={`${data.earned.toFixed(1)}/${data.total}`}
                    percentage={
                      data.total > 0
                        ? `${((data.earned / data.total) * 100).toFixed(2)}%`
                        : '0.00%'
                    }
                    progressData={data.statusCounts}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quadrant Totals */}
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow h-full">
              <h2 className="font-bold text-gray-700 mb-2">Quadrant Totals</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(quadrantData).map(([key, data]) => (
                  <StatCard
                    key={key}
                    title={key}
                    value={`${data.earned.toFixed(1)}/${data.total}`}
                    percentage={
                      data.total > 0
                        ? `${((data.earned / data.total) * 100).toFixed(2)}%`
                        : '0.00%'
                    }
                    progressData={data.statusCounts}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Graph Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-bold text-gray-700 mb-3 text-center">Progress Over Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SvgProgressGraph data={graphData.NE} title="North East" />
            <SvgProgressGraph data={graphData.NW} title="North West" />
            <SvgProgressGraph data={graphData.SE} title="South East" />
            <SvgProgressGraph data={graphData.SW} title="South West" />
          </div>
        </div>

        {/* Borescope Tracker Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-bold text-gray-700 mb-3 text-center">
            {activeQuadrant} Header FME Borescope
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {activeBorescopeItems
              .sort((a, b) => a.id.localeCompare(b.id))
              .map(item => (
                <BorescopeItem
                  key={item.id}
                  item={item}
                  onUpdateStatus={(id, status) => handleUpdateStatus(id, status, 'borescope')}
                />
              ))}
          </div>
        </div>

        {/* Main Bank Map Tracker Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          {/* Quadrant Tabs */}
          <div className="flex justify-center space-x-2 border-b-2 pb-4">
            {['NE', 'NW', 'SE', 'SW'].map(quad => (
              <button
                key={quad}
                onClick={() => setActiveQuadrant(quad)}
                className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${
                  activeQuadrant === quad
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {quad}
              </button>
            ))}
          </div>

          {/* Bank Grid */}
          <main className="pt-4 overflow-x-auto">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
              {getQuadrantFullName(activeQuadrant)}
            </h2>
            <div className="flex space-x-1">
              {banks.map(bankNum => {
                const bankCells = activeCells
                  .filter(c => c.bank === bankNum)
                  .sort((a, b) => {
                    const indexA = neData.findIndex(item => item.id === a.id);
                    const indexB = neData.findIndex(item => item.id === b.id);
                    return indexA - indexB;
                  });

                if (bankCells.length === 0) return null;

                return (
                  <div
                    key={bankNum}
                    className="flex flex-col space-y-1"
                    style={{ minWidth: '70px' }}
                  >
                    <div className="bg-gray-800 text-white text-center text-sm font-bold py-1 px-2 rounded-t-md">
                      Bank {bankNum}
                    </div>
                    <div className="flex-grow grid grid-rows-[repeat(7,30px)] gap-1">
                      {bankCells.map(cell => (
                        <Cell
                          key={cell.id}
                          cell={cell}
                          onUpdateStatus={(id, status) => handleUpdateStatus(id, status, 'cell')}
                        />
                      ))}
                    </div>
                    <div className="bg-gray-800 text-white text-center text-sm font-bold py-1 px-2 rounded-b-md">
                      Bank {bankNum}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>

        {/* Footer with Legend */}
        <footer className="mt-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-3 text-center">Legend</h3>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {Object.values(STATUSES).map(status => (
                <LegendItem key={status.text} status={status} />
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
