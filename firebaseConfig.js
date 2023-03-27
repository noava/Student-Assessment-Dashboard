import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_gwq9yTxRs9LEpx6TdljXHJAOX71wxEU",
  authDomain: "student-assessment-dashb-753de.firebaseapp.com",
  databaseURL: "https://student-assessment-dashb-753de-default-rtdb.firebaseio.com/",
  projectId: "student-assessment-dashb-753de",
  storageBucket: "student-assessment-dashb-753de.appspot.com",
  messagingSenderId: "288113914347",
  appId: "1:288113914347:web:d086d55ebcd7c005f2a9ae",
  measurementId: "G-WW17WB4W4Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db}