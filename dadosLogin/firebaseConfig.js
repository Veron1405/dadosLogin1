// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQh4sDEqZWIkzA6hseBgMVoRfYEsRsO8M",
    authDomain: "telacadastro1.firebaseapp.com",
    projectId: "telacadastro1",
    storageBucket: "telacadastro1.appspot.com",
    messagingSenderId: "547318666436",
    appId: "1:547318666436:web:68d1266347bdd51bf56591"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);


export { auth, firestore };