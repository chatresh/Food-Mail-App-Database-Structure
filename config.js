import firebase from 'firebase';
require('@firebase/firestore')

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCdc1Xasp0_dzpaGEPZ5G91QHM7fEDBhoc",
  authDomain: "book-santa-users-and-work-flow.firebaseapp.com",
  databaseURL: "https://book-santa-users-and-work-flow.firebaseio.com",
  projectId: "book-santa-users-and-work-flow",
  storageBucket: "book-santa-users-and-work-flow.appspot.com",
  messagingSenderId: "498147718235",
  appId: "1:498147718235:web:e0d913def0a371b7067b7e",
  measurementId: "G-K2M21Z5D5M"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
