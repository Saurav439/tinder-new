import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAK5z4sABrfQepOTQwpevpunZ58vBE4i28',
  authDomain: 'tinder-2-tin.firebaseapp.com',
  projectId: 'tinder-2-tin',
  storageBucket: 'tinder-2-tin.appspot.com',
  messagingSenderId: '249053540077',
  appId: '1:249053540077:web:ab3ab6530cef7879dca6e4',
  measurementId: 'G-S9KWFRXTQR',
};
// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();

export {auth, db, firebase};
