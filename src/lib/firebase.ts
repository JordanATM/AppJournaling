import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "serene-stream-8h2ws",
  appId: "1:527175836969:web:55c06d074db68ca9554338",
  storageBucket: "serene-stream-8h2ws.appspot.com",
  apiKey: "AIzaSyD0idKKvHKD7xU256AVH6qZEhXfZdJ6Guw",
  authDomain: "serene-stream-8h2ws.firebaseapp.com",
  messagingSenderId: "527175836969"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const storage = getStorage(app);
