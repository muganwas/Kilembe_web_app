//importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
import firebase from 'firebase/app';
import 'firebase/messaging';

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': process.env.MESSAGE_SENDER_ID
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();