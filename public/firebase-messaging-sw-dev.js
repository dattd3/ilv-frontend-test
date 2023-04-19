importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);
// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBMM56lyG-eU4gORGxcGzLUwPlvWUM4cxY",
  authDomain: "myvinpearl-693c0.firebaseapp.com",
  databaseURL: "https://myvinpearl-693c0.firebaseio.com",
  projectId: "myvinpearl-693c0",
  storageBucket: "myvinpearl-693c0.appspot.com",
  messagingSenderId: "325470433070",
  appId: "1:325470433070:web:25ac00e9e10da38fc8d4bf",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const channel = new BroadcastChannel('notification-channel');
  channel.postMessage({ payload });
});