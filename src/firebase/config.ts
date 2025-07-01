import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBQMEiD79vl2pccHeJ6UA3YBeEWP80u9yw",
  authDomain: "roomsync-2fe91.firebaseapp.com",
  projectId: "roomsync-2fe91",
  storageBucket: "roomsync-2fe91.firebasestorage.app",
  messagingSenderId: "559942508087",
  appId: "1:559942508087:web:83bdfb0efa5870ec51e9b2"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;