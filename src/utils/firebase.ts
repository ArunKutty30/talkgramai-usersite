import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyBLgx7nmYvOuRuvui0ZHjohDAL4QweeoO8",
//   authDomain: "talkgram-7d6fe.firebaseapp.com",
//   projectId: "talkgram-7d6fe",
//   storageBucket: "talkgram-7d6fe.appspot.com",
//   messagingSenderId: "566715889297",
//   appId: "1:566715889297:web:2042453834b6b1821fb130",
// };

const firebaseConfig = {
  apiKey: 'AIzaSyC7U8y1TxN8sgUyxn-2sBwW4uiHhGYxFwc',
  authDomain: 'simple-trade-43782.firebaseapp.com',
  projectId: 'simple-trade-43782',
  storageBucket: 'simple-trade-43782.appspot.com',
  messagingSenderId: '277119992059',
  appId: '1:277119992059:web:61721045a1d8ab3eb9b05e',
  measurementId: 'G-BNJH7YEKH4',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
