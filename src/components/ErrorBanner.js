import React from 'react';
import { XCircle } from 'lucide-react';

/**
 * ErrorBanner - A dismissible error notification component
 * Displays user-friendly error messages with a close button
 */
const ErrorBanner = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <XCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 flex-shrink-0 inline-flex text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
            aria-label="Dismiss error"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * ErrorContainer - Displays multiple errors stacked
 */
export const ErrorContainer = ({ errors }) => {
  // errors is an array of { message, onDismiss } objects
  const activeErrors = errors.filter(e => e.message);

  if (activeErrors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-2">
      {activeErrors.map((error, index) => (
        <ErrorBanner
          key={index}
          message={error.message}
          onDismiss={error.onDismiss}
        />
      ))}
    </div>
  );
};

export default ErrorBanner;
