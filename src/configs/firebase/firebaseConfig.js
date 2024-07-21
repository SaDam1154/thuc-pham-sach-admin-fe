import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyB1sE2jRBp7HkyAWSEwXn4LPVVR0zWKwNE',
    authDomain: 'chatbox-2f009.firebaseapp.com',
    projectId: 'chatbox-2f009',
    storageBucket: 'chatbox-2f009.appspot.com',
    messagingSenderId: '589200821730',
    appId: '1:589200821730:web:7b1c118b77eddc99c43dbb',
    measurementId: 'G-8NWMD5JNHJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db }; // Export biến db
