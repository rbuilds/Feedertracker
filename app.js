import React, { useState, useEffect, useCallback, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, writeBatch, updateDoc, onSnapshot, serverTimestamp, addDoc, query, orderBy } from 'firebase/firestore';
import { ChevronDown, CheckCircle, XCircle, Clock, PauseCircle, PlayCircle, FileDown } from 'lucide-react';

// --- Firebase Configuration ---
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOIjutNNgCfezxcUrbAf45d49EMvmuMQw",
  authDomain: "feeder-tracker-d036b.firebaseapp.com",
  projectId: "feeder-tracker-d036b",
  storageBucket: "feeder-tracker-d036b.appspot.com",
  messagingSenderId: "582594266927",
  appId: "1:582594266927:web:ee0f4dcb1d4c1817f8c3da"
};

// Initialize Firebase (No need to assign to 'app' if it's not used elsewhere)
initializeApp(firebaseConfig);

// --- App ID ---
// A unique identifier for this application.
const appId = 'feeder-tracker-d036b';


// --- Initial Data for the Tracker ---
const neData = [
    { id: 'P12E', bank: 1, quadrant: 'NE' }, { id: 'F13E', bank: 1, quadrant: 'NE' }, { id: 'B13E', bank: 1, quadrant: 'NE' },
    { id: 'Q12E', bank: 2, quadrant: 'NE' }, { id: 'M12E', bank: 2, quadrant: 'NE' }, { id: 'C13E', bank: 2, quadrant: 'NE' },
    { id: 'L12E', bank: 3, quadrant: 'NE' }, { id: 'J12E', bank: 3, quadrant: 'NE' }, { id: 'G12E', bank: 3, quadrant: 'NE' }, { id: 'E12E', bank: 3, quadrant: 'NE' }, { id: 'A12E', bank: 3, quadrant: 'NE' }, { id: 'C12E', bank: 3, quadrant: 'NE' },
    { id: 'K12E', bank: 4, quadrant: 'NE' }, { id: 'H12E', bank: 4, quadrant: 'NE' }, { id: 'F12E', bank: 4, quadrant: 'NE' }, { id: 'D12E', bank: 4, quadrant: 'NE' }, { id: 'B12E', bank: 4, quadrant: 'NE' },
    { id: 'K11E', bank: 5, quadrant: 'NE' }, { id: 'H11E', bank: 5, quadrant: 'NE' }, { id: 'F11E', bank: 5, quadrant: 'NE' }, { id: 'D11E', bank: 5, quadrant: 'NE' }, { id: 'B11E', bank: 5, quadrant: 'NE' },
    { id: 'L11E', bank: 6, quadrant: 'NE' }, { id: 'J11E', bank: 6, quadrant: 'NE' }, { id: 'G11E', bank: 6, quadrant: 'NE' }, { id: 'E11E', bank: 6, quadrant: 'NE' }, { id: 'A11E', bank: 6, quadrant: 'NE' }, { id: 'C11E', bank: 6, quadrant: 'NE' },
    { id: 'L10E', bank: 7, quadrant: 'NE' }, { id: 'J10E', bank: 7, quadrant: 'NE' }, { id: 'G10E', bank: 7, quadrant: 'NE' }, { id: 'E10E', bank: 7, quadrant: 'NE' }, { id: 'A10E', bank: 7, quadrant: 'NE' }, { id: 'C10E', bank: 7, quadrant: 'NE' },
    { id: 'K10E', bank: 8, quadrant: 'NE' }, { id: 'H10E', bank: 8, quadrant: 'NE' }, { id: 'F10E', bank: 8, quadrant: 'NE' }, { id: 'D10E', bank: 8, quadrant: 'NE' }, { id: 'B10E', bank: 8, quadrant: 'NE' },
    { id: 'K09E', bank: 9, quadrant: 'NE' }, { id: 'H09E', bank: 9, quadrant: 'NE' }, { id: 'F09E', bank: 9, quadrant: 'NE' }, { id: 'D09E', bank: 9, quadrant: 'NE' }, { id: 'B09E', bank: 9, quadrant: 'NE' },
    { id: 'J09E', bank: 10, quadrant: 'NE' }, { id: 'L09E', bank: 10, quadrant: 'NE' }, { id: 'G09E', bank: 10, quadrant: 'NE' }, { id: 'E09E', bank: 10, quadrant: 'NE' }, { id: 'A09E', bank: 10, quadrant: 'NE' }, { id: 'C09E', bank: 10, quadrant: 'NE' },
    { id: 'L08E', bank: 11, quadrant: 'NE' }, { id: 'J08E', bank: 11, quadrant: 'NE' }, { id: 'G08E', bank: 11, quadrant: 'NE' }, { id: 'E08E', bank: 11, quadrant: 'NE' }, { id: 'A08E', bank: 11, quadrant: 'NE' }, { id: 'C08E', bank: 11, quadrant: 'NE' },
    { id: 'K08E', bank: 12, quadrant: 'NE' }, { id: 'H08E', bank: 12, quadrant: 'NE' }, { id: 'F08E', bank: 12, quadrant: 'NE' }, { id: 'D08E', bank: 12, quadrant: 'NE' }, { id: 'B08E', bank: 12, quadrant: 'NE' },
    { id: 'K07E', bank: 13, quadrant: 'NE' }, { id: 'H07E', bank: 13, quadrant: 'NE' }, { id: 'F07E', bank: 13, quadrant: 'NE' }, { id: 'D07E', bank: 13, quadrant: 'NE' }, { id: 'B07E', bank: 13, quadrant: 'NE' },
    { id: 'L07E', bank: 14, quadrant: 'NE' }, { id: 'J07E', bank: 14, quadrant: 'NE' }, { id: 'G07E', bank: 14, quadrant: 'NE' }, { id: 'E07E', bank: 14, quadrant: 'NE' }, { id: 'C07E', bank: 14, quadrant: 'NE' },
    { id: 'L06E', bank: 15, quadrant: 'NE' }, { id: 'J06E', bank: 15, quadrant: 'NE' }, { id: 'G06E', bank: 15, quadrant: 'NE' }, { id: 'E06E', bank: 15, quadrant: 'NE' }, { id: 'C06E', bank: 15, quadrant: 'NE' },
    { id: 'K06E', bank: 16, quadrant: 'NE' }, { id: 'H06E', bank: 16, quadrant: 'NE' }, { id: 'F06E', bank: 16, quadrant: 'NE' }, { id: 'D06E', bank: 16, quadrant: 'NE' }, { id: 'B06E', bank: 16, quadrant: 'NE' },
    { id: 'K05E', bank: 17, quadrant: 'NE' }, { id: 'H05E', bank: 17, quadrant: 'NE' }, { id: 'F05E', bank: 17, quadrant: 'NE' }, { id: 'D05E', bank: 17, quadrant: 'NE' },
    { id: 'L05E', bank: 18, quadrant: 'NE' }, { id: 'J05E', bank: 18, quadrant: 'NE' }, { id: 'G05E', bank: 18, quadrant: 'NE' }, { id: 'E05E', bank: 18, quadrant: 'NE' }, { id: 'C05E', bank: 18, quadrant: 'NE' },
    { id: 'L04E', bank: 19, quadrant: 'NE' }, { id: 'J04E', bank: 19, quadrant: 'NE' }, { id: 'G04E', bank: 19, quadrant: 'NE' }, { id: 'E04E', bank: 19, quadrant: 'NE' },
    { id: 'K04E', bank: 20, quadrant: 'NE' }, { id: 'H04E', bank: 20, quadrant: 'NE' }, { id: 'F04E', bank: 20, quadrant: 'NE' }, { id: 'D04E', bank: 20, quadrant: 'NE' },
    { id: 'K03E', bank: 21, quadrant: 'NE' }, { id: 'H03E', bank: 21, quadrant: 'NE' }, { id: 'F03E', bank: 21, quadrant: 'NE' },
    { id: 'L03E', bank: 22, quadrant: 'NE' }, { id: 'J03E', bank: 22, quadrant: 'NE' }, { id: 'G03E', bank: 22, quadrant: 'NE' }, { id: 'E03E', bank: 22, quadrant: 'NE' },
    { id: 'K01E', bank: 23, quadrant: 'NE' }, { id: 'L02E', bank: 23, quadrant: 'NE' }, { id: 'J02E', bank: 23, quadrant: 'NE' }, { id: 'G02E', bank: 23, quadrant: 'NE' },
    { id: 'L01E', bank: 24, quadrant: 'NE' }, { id: 'J01E', bank: 24, quadrant: 'NE' }, { id: 'K02E', bank: 24, quadrant: 'NE' }, { id: 'H02E', bank: 24, quadrant: 'NE' }, { id: 'F02E', bank: 24, quadrant: 'NE' },
    { id: 'M11E', bank: 25, quadrant: 'NE' }, { id: 'M09E', bank: 25, quadrant: 'NE' }, { id: 'M07E', bank: 25, quadrant: 'NE' }, { id: 'M05E', bank: 25, quadrant: 'NE' }, { id: 'M01E', bank: 25, quadrant: 'NE' }, { id: 'M03E', bank: 25, quadrant: 'NE' },
    { id: 'M10E', bank: 26, quadrant: 'NE' }, { id: 'M08E', bank: 26, quadrant: 'NE' }, { id: 'M06E', bank: 26, quadrant: 'NE' }, { id: 'M04E', bank: 26, quadrant: 'NE' }, { id: 'M02E', bank: 26, quadrant: 'NE' },
    { id: 'N10E', bank: 27, quadrant: 'NE' }, { id: 'N08E', bank: 27, quadrant: 'NE' }, { id: 'N06E', bank: 27, quadrant: 'NE' }, { id: 'N04E', bank: 27, quadrant: 'NE' }, { id: 'N02E', bank: 27, quadrant: 'NE' },
    { id: 'N09E', bank: 28, quadrant: 'NE' }, { id: 'N11E', bank: 28, quadrant: 'NE' }, { id: 'N07E', bank: 28, quadrant: 'NE' }, { id: 'N05E', bank: 28, quadrant: 'NE' }, { id: 'N01E', bank: 28, quadrant: 'NE' }, { id: 'N03E', bank: 28, quadrant: 'NE' },
    { id: 'O11E', bank: 29, quadrant: 'NE' }, { id: 'O09E', bank: 29, quadrant: 'NE' }, { id: 'O07E', bank: 29, quadrant: 'NE' }, { id: 'O05E', bank: 29, quadrant: 'NE' }, { id: 'O01E', bank: 29, quadrant: 'NE' }, { id: 'O03E', bank: 29, quadrant: 'NE' },
    { id: 'O10E', bank: 30, quadrant: 'NE' }, { id: 'O08E', bank: 30, quadrant: 'NE' }, { id: 'O06E', bank: 30, quadrant: 'NE' }, { id: 'O04E', bank: 30, quadrant: 'NE' }, { id: 'O02E', bank: 30, quadrant: 'NE' },
    { id: 'P10E', bank: 31, quadrant: 'NE' }, { id: 'P08E', bank: 31, quadrant: 'NE' }, { id: 'P06E', bank: 31, quadrant: 'NE' }, { id: 'P04E', bank: 31, quadrant: 'NE' }, { id: 'P02E', bank: 31, quadrant: 'NE' },
    { id: 'P09E', bank: 32, quadrant: 'NE' }, { id: 'P11E', bank: 32, quadrant: 'NE' }, { id: 'P07E', bank: 32, quadrant: 'NE' }, { id: 'P05E', bank: 32, quadrant: 'NE' }, { id: 'P01E', bank: 32, quadrant: 'NE' }, { id: 'P03E', bank: 32, quadrant: 'NE' },
    { id: 'Q11E', bank: 33, quadrant: 'NE' }, { id: 'Q09E', bank: 33, quadrant: 'NE' }, { id: 'Q07E', bank: 33, quadrant: 'NE' }, { id: 'Q05E', bank: 33, quadrant: 'NE' }, { id: 'Q01E', bank: 33, quadrant: 'NE' }, { id: 'Q03E', bank: 33, quadrant: 'NE' },
    { id: 'Q10E', bank: 34, quadrant: 'NE' }, { id: 'Q08E', bank: 34, quadrant: 'NE' }, { id: 'Q06E', bank: 34, quadrant: 'NE' }, { id: 'Q04E', bank: 34, quadrant: 'NE' }, { id: 'Q02E', bank: 34, quadrant: 'NE' },
    { id: 'R10E', bank: 35, quadrant: 'NE' }, { id: 'R12E', bank: 35, quadrant: 'NE' }, { id: 'R08E', bank: 35, quadrant: 'NE' }, { id: 'R06E', bank: 35, quadrant: 'NE' }, { id: 'R04E', bank: 35, quadrant: 'NE' }, { id: 'R02E', bank: 35, quadrant: 'NE' },
    { id: 'R11E', bank: 36, quadrant: 'NE' }, { id: 'R09E', bank: 36, quadrant: 'NE' }, { id: 'R07E', bank: 36, quadrant: 'NE' }, { id: 'R03E', bank: 36, quadrant: 'NE' }, { id: 'R05E', bank: 36, quadrant: 'NE' },
    { id: 'S11E', bank: 37, quadrant: 'NE' }, { id: 'S09E', bank: 37, quadrant: 'NE' }, { id: 'S07E', bank: 37, quadrant: 'NE' }, { id: 'S05E', bank: 37, quadrant: 'NE' }, { id: 'S03E', bank: 37, quadrant: 'NE' },
    { id: 'S12E', bank: 38, quadrant: 'NE' }, { id: 'S10E', bank: 38, quadrant: 'NE' }, { id: 'S08E', bank: 38, quadrant: 'NE' }, { id: 'S06E', bank: 38, quadrant: 'NE' }, { id: 'S02E', bank: 38, quadrant: 'NE' }, { id: 'S04E', bank: 38, quadrant: 'NE' },
    { id: 'T12E', bank: 39, quadrant: 'NE' }, { id: 'T10E', bank: 39, quadrant: 'NE' }, { id: 'T08E', bank: 39, quadrant: 'NE' }, { id: 'T06E', bank: 39, quadrant: 'NE' }, { id: 'T02E', bank: 39, quadrant: 'NE' }, { id: 'T04E', bank: 39, quadrant: 'NE' },
    { id: 'T11E', bank: 40, quadrant: 'NE' }, { id: 'T09E', bank: 40, quadrant: 'NE' }, { id: 'T07E', bank: 40, quadrant: 'NE' }, { id: 'T05E', bank: 40, quadrant: 'NE' }, { id: 'T03E', bank: 40, quadrant: 'NE' },
    { id: 'U11E', bank: 41, quadrant: 'NE' }, { id: 'U09E', bank: 41, quadrant: 'NE' }, { id: 'U07E', bank: 41, quadrant: 'NE' }, { id: 'U05E', bank: 41, quadrant: 'NE' }, { id: 'U03E', bank: 41, quadrant: 'NE' },
    { id: 'U12E', bank: 42, quadrant: 'NE' }, { id: 'U10E', bank: 42, quadrant: 'NE' }, { id: 'U08E', bank: 42, quadrant: 'NE' }, { id: 'U06E', bank: 42, quadrant: 'NE' }, { id: 'U04E', bank: 42, quadrant: 'NE' },
    { id: 'V12E', bank: 43, quadrant: 'NE' }, { id: 'V10E', bank: 43, quadrant: 'NE' }, { id: 'V08E', bank: 43, quadrant: 'NE' }, { id: 'V06E', bank: 43, quadrant: 'NE' }, { id: 'V04E', bank: 43, quadrant: 'NE' },
    { id: 'V11E', bank: 44, quadrant: 'NE' }, { id: 'V09E', bank: 44, quadrant: 'NE' }, { id: 'V07E', bank: 44, quadrant: 'NE' }, { id: 'V05E', bank: 44, quadrant: 'NE' },
    { id: 'W09E', bank: 45, quadrant: 'NE' }, { id: 'W11E', bank: 45, quadrant: 'NE' }, { id: 'W07E', bank: 45, quadrant: 'NE' }, { id: 'W05E', bank: 45, quadrant: 'NE' }, { id: 'X06E', bank: 45, quadrant: 'NE' },
    { id: 'W12E', bank: 46, quadrant: 'NE' }, { id: 'W10E', bank: 46, quadrant: 'NE' }, { id: 'W08E', bank: 46, quadrant: 'NE' }, { id: 'W06E', bank: 46, quadrant: 'NE' }, { id: 'X07E', bank: 46, quadrant: 'NE' },
    { id: 'Y09E', bank: 47, quadrant: 'NE' }, { id: 'Y11E', bank: 47, quadrant: 'NE' }, { id: 'X08E', bank: 47, quadrant: 'NE' }, { id: 'X12E', bank: 47, quadrant: 'NE' }, { id: 'X10E', bank: 47, quadrant: 'NE' },
    { id: 'Y08E', bank: 48, quadrant: 'NE' }, { id: 'Y10E', bank: 48, quadrant: 'NE' }, { id: 'Y12E', bank: 48, quadrant: 'NE' }, { id: 'X09E', bank: 48, quadrant: 'NE' }, { id: 'X11E', bank: 48, quadrant: 'NE' },
];

const createQuadrantData = (quadrant, suffix) => {
    return neData.map(cell => ({
        ...cell,
        id: cell.id.replace('E', suffix), 
        quadrant: quadrant,
    }));
};
const initialCellsData = [ ...neData, ...createQuadrantData('NW', 'W'), ...createQuadrantData('SE', 'S'), ...createQuadrantData('SW', 'X') ];

const initialBorescopeData = [
    { id: '3E HD 2', quadrant: 'NE' }, { id: '3E HD 4', quadrant: 'NE' }, { id: '3E HD 6', quadrant: 'NE' }, { id: '4E HD 2', quadrant: 'NE' }, { id: '4E HD 4', quadrant: 'NE' }, { id: '4E HD 6', quadrant: 'NE' },
    { id: '1W FR 10', quadrant: 'NW' }, { id: '1W FR 12', quadrant: 'NW' }, { id: '1W FR 14', quadrant: 'NW' }, { id: '2W FR 21', quadrant: 'NW' }, { id: '2W FR 23', quadrant: 'NW' }, { id: '2W FR 25', quadrant: 'NW' },
    { id: '5S FR 30', quadrant: 'SE' }, { id: '5S FR 32', quadrant: 'SE' }, { id: '5S FR 34', quadrant: 'SE' }, { id: '6S FR 41', quadrant: 'SE' }, { id: '6S FR 43', quadrant: 'SE' }, { id: '6S FR 45', quadrant: 'SE' },
    { id: '7X FR 50', quadrant: 'SW' }, { id: '7X FR 52', quadrant: 'SW' }, { id: '7X FR 54', quadrant: 'SW' }, { id: '8X FR 61', quadrant: 'SW' }, { id: '8X FR 63', quadrant: 'SW' }, { id: '8X FR 65', quadrant: 'SW' },
];

// --- Status Configuration Objects ---
const STATUSES = {
    NOT_STARTED: { text: 'Not Started', color: 'bg-gray-200 text-gray-800', icon: <XCircle className="w-4 h-4 mr-2" /> },
    ON_HOLD: { text: 'On Hold', color: 'bg-red-500 text-white', icon: <PauseCircle className="w-4 h-4 mr-2" /> },
    PRECISION_CUT: { text: 'Precision Cut in Progress', color: 'bg-yellow-500 text-white', icon: <PlayCircle className="w-4 h-4 mr-2" /> },
    ROUGH_CUT: { text: 'Rough Cut complete', color: 'bg-blue-500 text-white', icon: <Clock className="w-4 h-4 mr-2" /> },
    COMPLETE: { text: 'Complete', color: 'bg-green-600 text-white', icon: <CheckCircle className="w-4 h-4 mr-2" /> },
};

const BORESCOPE_STATUSES = {
    NOT_STARTED: { text: 'Not Started', color: 'bg-gray-400 text-white', icon: <XCircle className="w-4 h-4 mr-2" /> },
    IN_PROGRESS: { text: 'In Progress', color: 'bg-yellow-500 text-white', icon: <PlayCircle className="w-4 h-4 mr-2" /> },
    COMPLETE: { text: 'Complete', color: 'bg-green-600 text-white', icon: <CheckCircle className="w-4 h-4 mr-2" /> },
};

// --- Helper Functions and Components ---

// A general helper function to calculate statistics for a given array of cells.
// Earned Value Calculation: 'COMPLETE' counts as 1, 'ROUGH_CUT' counts as 0.5.
const calculateStats = (filteredCells) => {
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
    
    Object.keys(STATUSES).forEach(statusKey => {
        if (!statusCounts[statusKey]) statusCounts[statusKey] = 0;
    });

    return { earned, total, statusCounts };
};


// StatCard: A reusable component to display summary statistics with an optional progress bar.
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
                            ></div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};


// LegendItem: A reusable component to display a single item in the status legend.
const LegendItem = ({ status }) => (
    <div className="flex items-center space-x-2">
        <div className={`w-5 h-5 rounded-full ${status.color.split(' ')[0]}`}></div>
        <span className="text-sm text-gray-600">{status.text}</span>
    </div>
);

// Cell: An interactive component for each item in the main bank map.
const Cell = ({ cell, onUpdateStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const cellRef = useRef(null);
    const status = STATUSES[cell.status] || STATUSES.NOT_STARTED;

    const handleSelect = (newStatus) => {
        onUpdateStatus(cell.id, newStatus);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && cellRef.current && !cellRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative h-full" ref={cellRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-full flex items-center justify-center text-xs font-bold rounded-md transition-all duration-200 hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${status.color}`}
            >
                {cell.id}
            </button>
            {isOpen && (
                <div ref={dropdownRef} className="absolute z-10 top-full mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200">
                    <ul className="py-1">
                        {Object.entries(STATUSES).map(([key, value]) => (
                            <li key={key}>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleSelect(key); }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" > {value.icon} {value.text} </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// BorescopeItem: An interactive component for each item in the Borescope tracker.
const BorescopeItem = ({ item, onUpdateStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const itemRef = useRef(null);
    const status = BORESCOPE_STATUSES[item.status] || BORESCOPE_STATUSES.NOT_STARTED;
    
    const handleSelect = (newStatus) => {
        onUpdateStatus(item.id, newStatus);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && itemRef.current && !itemRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
         <div className="relative" ref={itemRef}>
            <button onClick={() => setIsOpen(!isOpen)} className={`${status.color} p-2 w-full rounded-md text-center text-sm font-semibold hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
               {item.id}
           </button>
            {isOpen && (
                <div ref={dropdownRef} className="absolute z-10 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                    <ul className="py-1">
                        {Object.entries(BORESCOPE_STATUSES).map(([key, value]) => (
                            <li key={key}>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleSelect(key); }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" > {value.icon} {value.text} </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// SvgProgressGraph: A custom, self-contained SVG line chart component.
const SvgProgressGraph = ({ data, title }) => {
    if (!data || data.length < 2) {
        return (
            <div>
                <h3 className="text-center font-semibold text-gray-700">{title}</h3>
                <div className="text-center text-gray-500 p-8 h-[300px] flex items-center justify-center">Not enough data to display graph.</div>
            </div>
        );
    }

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const minTime = data[0].time.getTime();
    const maxTime = data[data.length - 1].time.getTime();
    const timeRange = maxTime - minTime;
    
    // Y-axis is 0-100%
    const yScale = (value) => yMax - (value / 100) * yMax;
    
    // X-axis is based on time
    const xScale = (time) => timeRange > 0 ? ((time.getTime() - minTime) / timeRange) * xMax : 0;

    const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.time)} ${yScale(d.percentComplete)}`).join(' ');

    // Generate X-axis ticks every 20 minutes
    const ticks = [];
    if (timeRange > 0) {
        const twentyMinutes = 20 * 60 * 1000;
        let tickTime = Math.floor(minTime / twentyMinutes) * twentyMinutes;
        while (tickTime <= maxTime + twentyMinutes) {
            if (tickTime >= minTime) {
                 ticks.push(new Date(tickTime));
            }
            tickTime += twentyMinutes;
        }
    }

    return (
        <div>
            <h3 className="text-center font-semibold text-gray-700">{title}</h3>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* Grid lines and axes */}
                    <line x1="0" y1="0" x2="0" y2={yMax} stroke="#ccc" />
                    <line x1="0" y1={yMax} x2={xMax} y2={yMax} stroke="#ccc" />

                    {/* Y-axis labels and grid lines */}
                    {[0, 25, 50, 75, 100].map(val => (
                        <g key={val}>
                            <line x1={0} x2={xMax} y1={yScale(val)} y2={yScale(val)} stroke="#e0e0e0" strokeDasharray="3 3"/>
                            <text x="-10" y={yScale(val) + 4} textAnchor="end" fontSize="10">{val}%</text>
                        </g>
                    ))}

                    {/* X-axis labels (ticks) */}
                    {ticks.map((tick, i) => (
                         <g key={i} transform={`translate(${xScale(tick)}, 0)`}>
                            <line y1={yMax} y2={yMax + 5} stroke="#333" />
                            <text y={yMax + 20} textAnchor="middle" fontSize="10">
                                {tick.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </text>
                        </g>
                    ))}
                    <text x={xMax / 2} y={yMax + 40} textAnchor="middle" fontSize="12" fontWeight="bold">Time</text>


                    {/* Data line and points */}
                    <path d={path} fill="none" stroke="#8884d8" strokeWidth="2" />
                    {data.map((d, i) => (
                        <circle key={i} cx={xScale(d.time)} cy={yScale(d.percentComplete)} r="4" fill="#8884d8">
                           <title>{`Item: ${d.itemId}\nTime: ${d.time.toLocaleTimeString()}\nComplete: ${d.percentComplete.toFixed(1)}%`}</title>
                        </circle>
                    ))}
                </g>
            </svg>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    // State variables
    const [db, setDb] = useState(null);
    const [cells, setCells] = useState([]);
    const [borescopeItems, setBorescopeItems] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [xlsxLoaded, setXlsxLoaded] = useState(false);
    const [activeQuadrant, setActiveQuadrant] = useState('NE');
    const [graphData, setGraphData] = useState({ NE: [], NW: [], SE: [], SW: [] });

    const collectionPath = `artifacts/${appId}/public/data`;

    // Effect to dynamically load external libraries from CDNs.
    useEffect(() => {
        // Load XLSX for Excel export
        const xlsxScript = document.createElement('script');
        xlsxScript.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        xlsxScript.async = true;
        xlsxScript.onload = () => { setXlsxLoaded(true); };
        xlsxScript.onerror = () => console.error("Failed to load the xlsx library.");
        document.head.appendChild(xlsxScript);
        return () => {
            document.head.removeChild(xlsxScript);
        };
    }, []);

    // Function to initialize Firestore data on first load.
    const initializeData = useCallback(async (database) => {
        setLoading(true);
        try {
            const historyCollectionRef = collection(database, `${collectionPath}/history`);
            const historySnapshot = await getDocs(historyCollectionRef);
            
            if (historySnapshot.empty) {
                console.log('Initializing data and history...');
                const batch = writeBatch(database);
                const timestamp = serverTimestamp();
                
                const cellsCollectionRef = collection(database, `${collectionPath}/cells`);
                initialCellsData.forEach(cell => {
                    const cellRef = doc(cellsCollectionRef, cell.id);
                    batch.set(cellRef, { ...cell, status: 'NOT_STARTED' });
                    batch.set(doc(historyCollectionRef), { itemId: cell.id, itemType: 'cell', status: 'NOT_STARTED', timestamp });
                });
                
                const borescopeCollectionRef = collection(database, `${collectionPath}/borescope`);
                initialBorescopeData.forEach(item => {
                    const itemRef = doc(borescopeCollectionRef, item.id);
                    batch.set(itemRef, { ...item, status: 'NOT_STARTED'});
                    batch.set(doc(historyCollectionRef), { itemId: item.id, itemType: 'borescope', status: 'NOT_STARTED', timestamp });
                });
                
                await batch.commit();
            }
        } catch (error) {
            console.error("Error initializing data:", error);
        } finally {
            setLoading(false);
        }
    }, [collectionPath]);
    
    // Effect for Firebase setup and authentication.
    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const firestoreDb = getFirestore(app);
        setDb(firestoreDb);

        const authenticate = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { 
                    await signInWithCustomToken(auth, __initial_auth_token); 
                } else { 
                    await signInAnonymously(auth); 
                }
            } catch (err) { console.error("Authentication error:", err); }
        };
        authenticate();
        
        const unsubscribe = onAuthStateChanged(auth, (user) => { if (user) setIsAuthReady(true); });
        return () => unsubscribe();
    }, []);

    // Effect to set up real-time data listeners from Firestore.
    useEffect(() => {
        if (!isAuthReady || !db) return;
        
        const cellsQuery = collection(db, `${collectionPath}/cells`);
        const unsubCells = onSnapshot(cellsQuery, (snapshot) => {
            setCells(snapshot.docs.map(doc => doc.data()));
            setLoading(false);
        }, (error) => { console.error("Error fetching cells:", error); setLoading(false); });

        const borescopeQuery = collection(db, `${collectionPath}/borescope`);
        const unsubBorescope = onSnapshot(borescopeQuery, (snapshot) => {
            setBorescopeItems(snapshot.docs.map(doc => doc.data()));
        }, (error) => console.error("Error fetching borescope items:", error));

        const historyQuery = query(collection(db, `${collectionPath}/history`), orderBy('timestamp'));
        const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
            const allHistory = snapshot.docs.map(doc => doc.data()).filter(d => d.timestamp); // Filter out entries without a timestamp
            setHistory(allHistory); // Save raw history for export

            const quadrantDataPoints = { NE: [], NW: [], SE: [], SW: [] };
            const quadrantCellIds = { NE: [], NW: [], SE: [], SW: [] };
            initialCellsData.forEach(c => {
                if (quadrantCellIds[c.quadrant]) {
                    quadrantCellIds[c.quadrant].push(c.id);
                }
            });

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
            setGraphData(quadrantDataPoints);
        }, (error) => {
             console.error("Error fetching history:", error);
        });

        initializeData(db); 
        
        return () => {
            unsubCells();
            unsubBorescope();
            unsubHistory();
        };
    }, [isAuthReady, db, initializeData, collectionPath]);

    // --- Event Handlers ---

    const handleUpdateStatus = async (itemId, newStatus, type = 'cell') => {
        if (!db) return;
        const collectionName = type === 'cell' ? 'cells' : 'borescope';
        try {
            const itemRef = doc(db, `${collectionPath}/${collectionName}`, itemId);
            const historyCollectionRef = collection(db, `${collectionPath}/history`);
            
            await addDoc(historyCollectionRef, { 
                itemId: itemId, 
                itemType: type,
                status: newStatus, 
                timestamp: serverTimestamp() 
            });
            await updateDoc(itemRef, { status: newStatus });
            
        } catch (error) { console.error(`Error updating ${type} status:`, error); }
    };

    const handleExport = () => {
        if (!xlsxLoaded || typeof XLSX === 'undefined') return;

        const latestTimestamps = {};
        history.forEach(entry => {
            if (entry.timestamp) {
                latestTimestamps[entry.itemId] = entry.timestamp.toDate().toLocaleString();
            }
        });
        
        const workbook = XLSX.utils.book_new();

        // --- Create Status Report Sheet ---
        const reportSheetData = [];
        reportSheetData.push(['Upper Feeder Removal Status Report']);
        reportSheetData.push([`Exported On: ${new Date().toLocaleString()}`]);
        reportSheetData.push([]); // Spacer

        reportSheetData.push(['Overall Progress Summary']);
        reportSheetData.push(['Category', 'Earned Value', 'Total Items', 'Percent Complete']);
        Object.entries(faceData).forEach(([key, data]) => {
            reportSheetData.push([key, data.earned.toFixed(1), data.total, data.total > 0 ? `${((data.earned / data.total) * 100).toFixed(2)}%` : '0.00%']);
        });
        Object.entries(quadrantData).forEach(([key, data]) => {
            reportSheetData.push([key, data.earned.toFixed(1), data.total, data.total > 0 ? `${((data.earned / data.total) * 100).toFixed(2)}%` : '0.00%']);
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
        
        const reportSheet = XLSX.utils.aoa_to_sheet(reportSheetData);
        XLSX.utils.book_append_sheet(workbook, reportSheet, "Status Report");


        // --- Create Detailed Data Sheets ---
        ['NE', 'NW', 'SE', 'SW'].forEach(quad => {
             const quadCells = cells.filter(c => c.quadrant === quad).sort((a, b) => a.bank - b.bank || a.id.localeCompare(b.id))
                .map(cell => ({ 
                    'ID': cell.id, 
                    'Bank': cell.bank, 
                    'Status': STATUSES[cell.status]?.text || 'Not Started',
                    'Last Status Change': latestTimestamps[cell.id] || 'N/A' 
                }));
            if(quadCells.length > 0) {
                XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(quadCells), `${quad} Map Data`);
            }
             const quadBorescope = borescopeItems.filter(c => c.quadrant === quad).sort((a, b) => a.id.localeCompare(b.id))
                .map(item => ({ 
                    'ID': item.id, 
                    'Status': BORESCOPE_STATUSES[item.status]?.text || 'Not Started',
                    'Last Status Change': latestTimestamps[item.id] || 'N/A'
                }));
            if(quadBorescope.length > 0) {
                 XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(quadBorescope), `${quad} Borescope`);
            }
        });
        try { XLSX.writeFile(workbook, "UpperFeederRemovalTracker_Export.xlsx"); } 
        catch (error) { console.error("Error exporting to Excel:", error); }
    };

    // --- Data Computations for Rendering ---
    const banks = Array.from({ length: 48 }, (_, i) => i + 1);

    const quadrantData = {
        NE: calculateStats(cells.filter(c => c.quadrant === 'NE')),
        NW: calculateStats(cells.filter(c => c.quadrant === 'NW')),
        SE: calculateStats(cells.filter(c => c.quadrant === 'SE')),
        SW: calculateStats(cells.filter(c => c.quadrant === 'SW')),
    };

    const faceData = {
        West: calculateStats(cells.filter(c => ['NW', 'SW'].includes(c.quadrant))),
        East: calculateStats(cells.filter(c => ['NE', 'SE'].includes(c.quadrant))),
    };

    const activeCells = cells.filter(c => c.quadrant === activeQuadrant);
    const activeBorescopeItems = borescopeItems.filter(i => i.quadrant === activeQuadrant);

    // --- Render Logic ---
    if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-100"><div className="text-xl font-semibold">Loading Tracker...</div></div>;

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-full mx-auto">
                <header className="text-center mb-6">
                     <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <h1 className="text-3xl font-bold text-red-600 uppercase">Upper Feeder Removal Tracker</h1>
                        <button onClick={handleExport} disabled={!xlsxLoaded} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200" >
                            {xlsxLoaded ? <><FileDown size={16} /> Export to Excel</> : 'Loading...'}
                        </button>
                    </div>
                </header>

                {/* Section for displaying summary statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-1">
                         <div className="bg-white p-4 rounded-lg shadow h-full">
                             <h2 className="font-bold text-gray-700 mb-2">Face Earned Value</h2>
                             <div className="space-y-3">
                                 {Object.entries(faceData).map(([key, data]) => (
                                     <StatCard
                                        key={key}
                                        title={key}
                                        value={`${data.earned.toFixed(1)}/${data.total}`}
                                        percentage={data.total > 0 ? `${((data.earned / data.total) * 100).toFixed(2)}%` : '0.00%'}
                                        progressData={data.statusCounts}
                                     />
                                 ))}
                             </div>
                         </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white p-4 rounded-lg shadow h-full">
                             <h2 className="font-bold text-gray-700 mb-2">Quadrant Totals</h2>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {Object.entries(quadrantData).map(([key, data]) => (
                                    <StatCard
                                        key={key}
                                        title={key}
                                        value={`${data.earned.toFixed(1)}/${data.total}`}
                                        percentage={data.total > 0 ? `${((data.earned / data.total) * 100).toFixed(2)}%` : '0.00%'}
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
                    <h2 className="font-bold text-gray-700 mb-3 text-center">{activeQuadrant} Header FME Borescope</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {activeBorescopeItems.sort((a,b) => a.id.localeCompare(b.id)).map(item => (
                            <BorescopeItem key={item.id} item={item} onUpdateStatus={(id, status) => handleUpdateStatus(id, status, 'borescope')} />
                        ))}
                    </div>
                </div>

                {/* Main Bank Map Tracker Section */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="flex justify-center space-x-2 border-b-2 pb-4">
                        {['NE', 'NW', 'SE', 'SW'].map(quad => (
                            <button key={quad} onClick={() => setActiveQuadrant(quad)} className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${activeQuadrant === quad ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} >
                                {quad}
                            </button>
                        ))}
                    </div>
                     <main className="pt-4 overflow-x-auto">
                        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">{activeQuadrant.replace('NE', 'NORTH EAST').replace('NW', 'NORTH WEST').replace('SE', 'SOUTH EAST').replace('SW', 'SOUTH WEST')}</h2>
                        <div className="flex space-x-1">
                            {banks.map(bankNum => {
                                const bankCells = activeCells.filter(c => c.bank === bankNum).sort((a, b) => {
                                    const indexA = neData.findIndex(item => item.id === a.id);
                                    const indexB = neData.findIndex(item => item.id === b.id);
                                    return indexA - indexB;
                                });
                                if (bankCells.length === 0) return null;
                                return (
                                    <div key={bankNum} className="flex flex-col space-y-1" style={{minWidth: '70px'}}>
                                        <div className="bg-gray-800 text-white text-center text-sm font-bold py-1 px-2 rounded-t-md">Bank {bankNum}</div>
                                        <div className="flex-grow grid grid-rows-[repeat(7,30px)] gap-1">
                                            {bankCells.map(cell => ( <Cell key={cell.id} cell={cell} onUpdateStatus={(id, status) => handleUpdateStatus(id, status, 'cell')} /> ))}
                                        </div>
                                        <div className="bg-gray-800 text-white text-center text-sm font-bold py-1 px-2 rounded-b-md">Bank {bankNum}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </main>
                </div>
                
                {/* Footer section with the status legend */}
                <footer className="mt-8">
                    <div className="bg-white p-4 rounded-lg shadow">
                         <h3 className="font-bold text-gray-700 mb-3 text-center">Legend</h3>
                         <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                             {Object.values(STATUSES).map(status => ( <LegendItem key={status.text} status={status} /> ))}
                         </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

