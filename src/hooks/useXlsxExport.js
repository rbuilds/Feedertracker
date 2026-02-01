import { useState, useEffect, useCallback } from 'react';
import { STATUSES, BORESCOPE_STATUSES } from '../constants';
import { getLatestTimestamps } from '../utils';

/**
 * Hook to manage XLSX library loading and export functionality
 */
export const useXlsxExport = () => {
  const [xlsxLoaded, setXlsxLoaded] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Load XLSX library from CDN
  useEffect(() => {
    const xlsxScript = document.createElement('script');
    xlsxScript.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    xlsxScript.async = true;
    xlsxScript.onload = () => setXlsxLoaded(true);
    xlsxScript.onerror = () => {
      console.error("Failed to load the xlsx library.");
      setExportError('Failed to load export library. Please refresh the page.');
    };
    document.head.appendChild(xlsxScript);

    return () => {
      if (document.head.contains(xlsxScript)) {
        document.head.removeChild(xlsxScript);
      }
    };
  }, []);

  const handleExport = useCallback((cells, borescopeItems, history, graphData, faceData, quadrantData) => {
    if (!xlsxLoaded || typeof window.XLSX === 'undefined') {
      setExportError('Export library not loaded. Please wait and try again.');
      return false;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const latestTimestamps = getLatestTimestamps(history);
      const workbook = window.XLSX.utils.book_new();

      // Create Status Report Sheet
      const reportSheetData = [];
      reportSheetData.push(['Upper Feeder Removal Status Report']);
      reportSheetData.push([`Exported On: ${new Date().toLocaleString()}`]);
      reportSheetData.push([]);

      reportSheetData.push(['Overall Progress Summary']);
      reportSheetData.push(['Category', 'Earned Value', 'Total Items', 'Percent Complete']);

      Object.entries(faceData).forEach(([key, data]) => {
        reportSheetData.push([
          key,
          data.earned.toFixed(1),
          data.total,
          data.total > 0 ? `${((data.earned / data.total) * 100).toFixed(2)}%` : '0.00%'
        ]);
      });

      Object.entries(quadrantData).forEach(([key, data]) => {
        reportSheetData.push([
          key,
          data.earned.toFixed(1),
          data.total,
          data.total > 0 ? `${((data.earned / data.total) * 100).toFixed(2)}%` : '0.00%'
        ]);
      });

      reportSheetData.push([]);
      reportSheetData.push(['Progress Over Time Data']);

      Object.entries(graphData).forEach(([quad, data]) => {
        if (data.length > 0) {
          reportSheetData.push([]);
          reportSheetData.push([`${quad} Progress`]);
          reportSheetData.push(['Timestamp', 'Percent Complete']);
          data.forEach(point => {
            reportSheetData.push([point.time.toLocaleString(), `${point.percentComplete.toFixed(2)}%`]);
          });
        }
      });

      const reportSheet = window.XLSX.utils.aoa_to_sheet(reportSheetData);
      window.XLSX.utils.book_append_sheet(workbook, reportSheet, "Status Report");

      // Create Detailed Data Sheets
      ['NE', 'NW', 'SE', 'SW'].forEach(quad => {
        const quadCells = cells
          .filter(c => c.quadrant === quad)
          .sort((a, b) => a.bank - b.bank || a.id.localeCompare(b.id))
          .map(cell => ({
            'ID': cell.id,
            'Bank': cell.bank,
            'Status': STATUSES[cell.status]?.text || 'Not Started',
            'Last Status Change': latestTimestamps[cell.id] || 'N/A'
          }));

        if (quadCells.length > 0) {
          window.XLSX.utils.book_append_sheet(
            workbook,
            window.XLSX.utils.json_to_sheet(quadCells),
            `${quad} Map Data`
          );
        }

        const quadBorescope = borescopeItems
          .filter(c => c.quadrant === quad)
          .sort((a, b) => a.id.localeCompare(b.id))
          .map(item => ({
            'ID': item.id,
            'Status': BORESCOPE_STATUSES[item.status]?.text || 'Not Started',
            'Last Status Change': latestTimestamps[item.id] || 'N/A'
          }));

        if (quadBorescope.length > 0) {
          window.XLSX.utils.book_append_sheet(
            workbook,
            window.XLSX.utils.json_to_sheet(quadBorescope),
            `${quad} Borescope`
          );
        }
      });

      window.XLSX.writeFile(workbook, "UpperFeederRemovalTracker_Export.xlsx");
      return true;
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setExportError('Failed to export data. Please try again.');
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [xlsxLoaded]);

  const clearExportError = useCallback(() => setExportError(null), []);

  return {
    xlsxLoaded,
    handleExport,
    exportError,
    isExporting,
    clearExportError
  };
};
