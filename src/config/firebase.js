import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD4ZPOmpN36xKbWmOzmD53ARJ7YrRucjqQ",
  authDomain: "proyecto-5d779.firebaseapp.com",
  projectId: "proyecto-5d779",
  storageBucket: "proyecto-5d779.firebasestorage.app",
  messagingSenderId: "728824922149",
  appId: "1:728824922149:web:db80819d34f8b65bbebfcc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);