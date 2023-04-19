importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);
// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBRN3gA-GG54wn4FOfwAERZpkYKmGrkGm4",
  authDomain: "myvinpearl.firebaseapp.com",
  databaseURL: "https://myvinpearl.firebaseio.com",
  projectId: "myvinpearl",
  storageBucket: "myvinpearl.appspot.com",
  messagingSenderId: "297571101596",
  appId: "1:297571101596:web:03c41e5920c7c69ee23659",
  measurementId: "G-G2X0LB6JD5"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  const channel = new BroadcastChannel('notification-channel');
  channel.postMessage(payload);

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// window.addEventListener('notificationclick', event => {
//   console.log(event)
//   return event;
// });