import firebase from 'firebase/app';
import "firebase/auth";
import 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKT6xEYlROK4b9gLNwKMRh7zzhrVJ-mrg",
  authDomain: "react-final-project-7428a.firebaseapp.com",
  projectId: "react-final-project-7428a",
  storageBucket: "react-final-project-7428a.appspot.com",
  messagingSenderId: "957300847435",
  appId: "1:957300847435:web:9b906bd3b386d69aa12ece",
  measurementId: "G-D1C7FPGDKK"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
export const today = firebase.firestore.Timestamp.now();
export default firebase;