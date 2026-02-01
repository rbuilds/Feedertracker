import React, { useState, useEffect, useRef } from 'react';
import { BORESCOPE_STATUSES } from '../constants';

/**
 * BorescopeItem - An interactive component for each item in the Borescope tracker
 */
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        itemRef.current &&
        !itemRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={itemRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${status.color} p-2 w-full rounded-md text-center text-sm font-semibold hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {item.id}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200"
        >
          <ul className="py-1">
            {Object.entries(BORESCOPE_STATUSES).map(([key, value]) => (
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

export default BorescopeItem;
