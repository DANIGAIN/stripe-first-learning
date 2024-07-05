import {initializeApp} from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyArSXU7Dq3ueKlV6GooXd-ijRpssG3fZSI",
  authDomain: "stripesubscription-cf4be.firebaseapp.com",
  projectId: "stripesubscription-cf4be",
  storageBucket: "stripesubscription-cf4be.appspot.com",
  messagingSenderId: "994206998143",
  appId: "1:994206998143:web:92a316da19c3137901a94a",
  measurementId: "G-9E7E1JV5H8"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
