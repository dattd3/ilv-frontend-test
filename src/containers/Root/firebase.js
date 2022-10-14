import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

var firebaseConfig = {
  apiKey: "AIzaSyBMM56lyG-eU4gORGxcGzLUwPlvWUM4cxY",
  authDomain: "myvinpearl-693c0.firebaseapp.com",
  databaseURL: "https://myvinpearl-693c0.firebaseio.com",
  projectId: "myvinpearl-693c0",
  storageBucket: "myvinpearl-693c0.appspot.com",
  messagingSenderId: "325470433070",
  appId: "1:325470433070:web:25ac00e9e10da38fc8d4bf",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const fetchToken = (setTokenFound) => {
  return getToken(messaging, {vapidKey: 'BFRO-mk2_TtRhn-hlwO_IUxzmL6JOHjkr72lCjOZXpWN5k62t4B7NqJiQoWsty1Iy0W8Q0q-gWq1F9jZRW12zik'}).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});