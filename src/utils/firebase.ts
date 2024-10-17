import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBLgx7nmYvOuRuvui0ZHjohDAL4QweeoO8",
  authDomain: "talkgram-7d6fe.firebaseapp.com",
  projectId: "talkgram-7d6fe",
  storageBucket: "talkgram-7d6fe.appspot.com",
  messagingSenderId: "566715889297",
  appId: "1:566715889297:web:2042453834b6b1821fb130",
  databaseURL: "https://talkgram-7d6fe-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const rtdb = getDatabase(app);

export { auth, db, storage, rtdb };