import Firebase from 'firebase';

const app = Firebase.initializeApp({
    apiKey: "AIzaSyA4zij7rbvF6xgubGTYtFYoQcgOALqwQ8s",
    authDomain: "kilembe-school.firebaseapp.com",
    databaseURL: "https://kilembe-school.firebaseio.com",
    projectId: "kilembe-school",
    storageBucket: "kilembe-school.appspot.com",
    messagingSenderId: "576509237424"
});
export default app;