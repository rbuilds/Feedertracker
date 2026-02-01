import React from 'react';
import { CheckCircle, XCircle, Clock, PauseCircle, PlayCircle } from 'lucide-react';

// Status configuration for main cells
export const STATUSES = {
  NOT_STARTED: {
    text: 'Not Started',
    color: 'bg-gray-200 text-gray-800',
    icon: <XCircle className="w-4 h-4 mr-2" />
  },
  ON_HOLD: {
    text: 'On Hold',
    color: 'bg-red-500 text-white',
    icon: <PauseCircle className="w-4 h-4 mr-2" />
  },
  PRECISION_CUT: {
    text: 'Precision Cut in Progress',
    color: 'bg-yellow-500 text-white',
    icon: <PlayCircle className="w-4 h-4 mr-2" />
  },
  ROUGH_CUT: {
    text: 'Rough Cut complete',
    color: 'bg-blue-500 text-white',
    icon: <Clock className="w-4 h-4 mr-2" />
  },
  COMPLETE: {
    text: 'Complete',
    color: 'bg-green-600 text-white',
    icon: <CheckCircle className="w-4 h-4 mr-2" />
  },
};

// Status configuration for borescope items
export const BORESCOPE_STATUSES = {
  NOT_STARTED: {
    text: 'Not Started',
    color: 'bg-gray-400 text-white',
    icon: <XCircle className="w-4 h-4 mr-2" />
  },
  IN_PROGRESS: {
    text: 'In Progress',
    color: 'bg-yellow-500 text-white',
    icon: <PlayCircle className="w-4 h-4 mr-2" />
  },
  COMPLETE: {
    text: 'Complete',
    color: 'bg-green-600 text-white',
    icon: <CheckCircle className="w-4 h-4 mr-2" />
  },
};
