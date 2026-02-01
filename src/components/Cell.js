import React, { useState, useEffect, useRef } from 'react';
import { STATUSES } from '../constants';

/**
 * Cell - An interactive component for each item in the main bank map
 */
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        cellRef.current &&
        !cellRef.current.contains(event.target)
      ) {
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
        <div
          ref={dropdownRef}
          className="absolute z-10 top-full mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200"
        >
          <ul className="py-1">
            {Object.entries(STATUSES).map(([key, value]) => (
              <li key={key}>
                <button
                  onClick={() => handleSelect(key)}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {value.icon} {value.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Cell;
