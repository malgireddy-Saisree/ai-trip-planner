// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSGUA0lnMqk2Fx_pLQl5mMdb9yHVSZ-Yo",
  authDomain: "aitravel-f44e3.firebaseapp.com",
  projectId: "aitravel-f44e3",
  storageBucket: "aitravel-f44e3.firebasestorage.app",
  messagingSenderId: "993816610864",
  appId: "1:993816610864:web:875edf21e14c57158d85f5",
  measurementId: "G-MVREJ3Y2RR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);