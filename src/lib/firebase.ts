import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "serene-stream-8h2ws",
  appId: "1:527175836969:web:55c06d074db68ca9554338",
  storageBucket: "serene-stream-8h2ws.firebasestorage.app",
  apiKey: "AIzaSyD0idKKvHKD7xU256AVH6qZEhXfZdJ6Guw",
  authDomain: "serene-stream-8h2ws.firebaseapp.com",
  messagingSenderId: "527175836969"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
