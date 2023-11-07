import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyAGeaBo4weISrt5bzV_DQRdKDMEM61Wy28',
  authDomain: 'special-notes-44bcf.firebaseapp.com',
  projectId: 'special-notes-44bcf',
  storageBucket: 'special-notes-44bcf.appspot.com',
  messagingSenderId: '895970515485',
  appId: '1:895970515485:web:e47a8865d5f8b8363604f4',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const collectNotes = collection(db, 'notes');
