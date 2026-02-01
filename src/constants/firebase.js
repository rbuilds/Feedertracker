// Firebase Configuration
// Note: For production, consider using environment variables:
// apiKey: process.env.REACT_APP_FIREBASE_API_KEY, etc.
export const firebaseConfig = {
  apiKey: "AIzaSyAOIjutNNgCfezxcUrbAf45d49EMvmuMQw",
  authDomain: "feeder-tracker-d036b.firebaseapp.com",
  projectId: "feeder-tracker-d036b",
  storageBucket: "feeder-tracker-d036b.appspot.com",
  messagingSenderId: "582594266927",
  appId: "1:582594266927:web:ee0f4dcb1d4c1817f8c3da"
};

// App identifier for Firestore path
export const appId = 'feeder-tracker-d036b';

// Firestore collection path
export const getCollectionPath = () => `artifacts/${appId}/public/data`;
