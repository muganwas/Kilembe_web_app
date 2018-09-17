import Firebase from 'firebase';

const app = Firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "kilembe-school.firebaseapp.com",
    databaseURL: "https://kilembe-school.firebaseio.com",
    projectId: "kilembe-school",
    storageBucket: "kilembe-school.appspot.com",
    messagingSenderId: process.env.MESSAGE_SENDER_ID
});
export default app;