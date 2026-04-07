import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCv75gmvw-zLXPVuyjbMNbdzTF52ZEUmVA",
  authDomain: "cardvault-fef81.firebaseapp.com",
  projectId: "cardvault-fef81",
  storageBucket: "cardvault-fef81.firebasestorage.app",
  messagingSenderId: "48158267558",
  appId: "1:48158267558:web:edbbcc1b490a3f45f27c67"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);