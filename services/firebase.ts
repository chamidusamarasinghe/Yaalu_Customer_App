import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase Web Configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCbDflGqNUfxZQUVhKIsOwXRbYn0p6o8qA",
  authDomain: "yaalu-app-1e119.firebaseapp.com",
  projectId: "yaalu-app-1e119",
  storageBucket: "yaalu-app-1e119.firebasestorage.app",
  messagingSenderId: "1063495888286",
  appId: "1:1063495888286:web:263fbf5de795f790e1fa8f"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);
