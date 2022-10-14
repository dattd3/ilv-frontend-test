importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBMM56lyG-eU4gORGxcGzLUwPlvWUM4cxY",
  authDomain: "myvinpearl-693c0.firebaseapp.com",
  databaseURL: "https://myvinpearl-693c0.firebaseio.com",
  projectId: "myvinpearl-693c0",
  storageBucket: "myvinpearl-693c0.appspot.com",
  messagingSenderId: "325470433070",
  appId: "1:325470433070:web:25ac00e9e10da38fc8d4bf"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Đã nhận thông báo dưới background ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
