import { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  writeBatch,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  addDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { firebaseConfig, getCollectionPath } from '../constants';
import { initialCellsData, initialBorescopeData } from '../data/initialData';
import { processHistoryForGraph } from '../utils';

// Error message mappings for user-friendly messages
const getErrorMessage = (error, context) => {
  const code = error.code || '';

  // Firebase Auth errors
  if (code.includes('auth/')) {
    switch (code) {
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many authentication attempts. Please wait a moment and try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      default:
        return 'Authentication failed. Please refresh the page to try again.';
    }
  }

  // Firestore errors
  if (code.includes('permission-denied') || code.includes('PERMISSION_DENIED')) {
    return 'Permission denied. You may not have access to this data.';
  }

  if (code.includes('unavailable') || code.includes('UNAVAILABLE')) {
    return 'Service temporarily unavailable. Please try again in a moment.';
  }

  if (code.includes('not-found') || code.includes('NOT_FOUND')) {
    return 'The requested data could not be found.';
  }

  // Network errors
  if (error.message?.includes('network') || error.message?.includes('Network')) {
    return 'Network error. Please check your internet connection.';
  }

  // Context-specific fallback messages
  const contextMessages = {
    'auth': 'Failed to authenticate. Please refresh the page.',
    'fetch-cells': 'Failed to load cell data. Please refresh to try again.',
    'fetch-borescope': 'Failed to load borescope data. Please refresh to try again.',
    'fetch-history': 'Failed to load history data.',
    'update-status': 'Failed to save changes. Please try again.',
    'initialize': 'Failed to initialize data. Please refresh the page.',
    'export': 'Failed to export data. Please try again.'
  };

  return contextMessages[context] || 'An unexpected error occurred. Please try again.';
};

/**
 * Hook to manage Firebase authentication and database connection
 */
export const useFirebaseAuth = () => {
  const [db, setDb] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};

    const initializeFirebase = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const firestoreDb = getFirestore(app);
        setDb(firestoreDb);

        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error("Authentication error:", err);
          setAuthError(getErrorMessage(err, 'auth'));
        }

        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setIsAuthReady(true);
            setAuthError(null);
          }
        });
      } catch (err) {
        console.error("Firebase initialization error:", err);
        setAuthError('Failed to connect to the database. Please refresh the page.');
      }
    };

    initializeFirebase();

    return () => unsubscribe();
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return { db, isAuthReady, authError, clearAuthError };
};

/**
 * Hook to manage real-time data subscriptions
 */
export const useFirebaseData = (db, isAuthReady) => {
  const [cells, setCells] = useState([]);
  const [borescopeItems, setBorescopeItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [graphData, setGraphData] = useState({ NE: [], NW: [], SE: [], SW: [] });
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const collectionPath = getCollectionPath();

  // Initialize Firestore data on first load
  const initializeData = useCallback(async (database) => {
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
          batch.set(itemRef, { ...item, status: 'NOT_STARTED' });
          batch.set(doc(historyCollectionRef), { itemId: item.id, itemType: 'borescope', status: 'NOT_STARTED', timestamp });
        });

        await batch.commit();
      }
    } catch (error) {
      console.error("Error initializing data:", error);
      setDataError(getErrorMessage(error, 'initialize'));
    }
  }, [collectionPath]);

  // Set up real-time listeners
  useEffect(() => {
    if (!isAuthReady || !db) return;

    setLoading(true);
    let unsubCells = () => {};
    let unsubBorescope = () => {};
    let unsubHistory = () => {};

    const setupListeners = async () => {
      // Initialize data first
      await initializeData(db);

      // Cells listener
      const cellsQuery = collection(db, `${collectionPath}/cells`);
      unsubCells = onSnapshot(
        cellsQuery,
        (snapshot) => {
          setCells(snapshot.docs.map(doc => doc.data()));
          setLoading(false);
          // Clear any previous data errors on successful fetch
          setDataError(prev => prev?.includes('cell') ? null : prev);
        },
        (error) => {
          console.error("Error fetching cells:", error);
          setDataError(getErrorMessage(error, 'fetch-cells'));
          setLoading(false);
        }
      );

      // Borescope listener
      const borescopeQuery = collection(db, `${collectionPath}/borescope`);
      unsubBorescope = onSnapshot(
        borescopeQuery,
        (snapshot) => {
          setBorescopeItems(snapshot.docs.map(doc => doc.data()));
        },
        (error) => {
          console.error("Error fetching borescope items:", error);
          setDataError(getErrorMessage(error, 'fetch-borescope'));
        }
      );

      // History listener
      const historyQuery = query(collection(db, `${collectionPath}/history`), orderBy('timestamp'));
      unsubHistory = onSnapshot(
        historyQuery,
        (snapshot) => {
          const allHistory = snapshot.docs
            .map(doc => doc.data())
            .filter(d => d.timestamp);
          setHistory(allHistory);
          setGraphData(processHistoryForGraph(allHistory));
        },
        (error) => {
          console.error("Error fetching history:", error);
          setDataError(getErrorMessage(error, 'fetch-history'));
        }
      );
    };

    setupListeners();

    return () => {
      unsubCells();
      unsubBorescope();
      unsubHistory();
    };
  }, [isAuthReady, db, initializeData, collectionPath]);

  const clearDataError = useCallback(() => setDataError(null), []);

  return {
    cells,
    borescopeItems,
    history,
    graphData,
    loading,
    dataError,
    clearDataError
  };
};

/**
 * Hook to handle status updates with error handling
 */
export const useStatusUpdate = (db) => {
  const [updateError, setUpdateError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const collectionPath = getCollectionPath();

  const handleUpdateStatus = useCallback(async (itemId, newStatus, type = 'cell') => {
    if (!db) {
      setUpdateError('Database not connected. Please refresh the page.');
      return false;
    }

    setIsUpdating(true);
    setUpdateError(null);

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

      return true;
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
      setUpdateError(getErrorMessage(error, 'update-status'));
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [db, collectionPath]);

  const clearUpdateError = useCallback(() => setUpdateError(null), []);

  return {
    handleUpdateStatus,
    updateError,
    isUpdating,
    clearUpdateError
  };
};
