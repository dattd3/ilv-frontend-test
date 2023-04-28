import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getRequestConfigurations } from "./Utils";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  },
  firebaseApp = initializeApp(firebaseConfig),
  messaging = getMessaging(firebaseApp);
export const FirebaseUpdateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (
      (!localStorage.getItem("firebaseToken") ||
        !localStorage.getItem("userFirebaseToken") ||
        localStorage.getItem("userFirebaseToken") !==
          localStorage.getItem("email")) &&
      permission === "granted"
    ) {
      let serviceWorkerRegistration = null;
      if (process.env.REACT_APP_ENVIRONMENT === 'PRODUCTION') {
        serviceWorkerRegistration = await navigator.serviceWorker.register(
          `${window.location.href}firebase-messaging-sw.js`
        );
      } else {
        serviceWorkerRegistration = await navigator.serviceWorker.register(
          `${window.location.href}firebase-messaging-sw-dev.js`
        );
      }
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration,
      });
      if (!!token) {
        localStorage.setItem("firebaseToken", token);
        localStorage.setItem(
          "userFirebaseToken",
          localStorage.getItem("email")
        );
        await axios.post(
          `${process.env.REACT_APP_REQUEST_URL}device/updateToken`,
          {
            deviceToken: token,
            orgLv3: localStorage.getItem("organizationLv3"),
            orgLv4: localStorage.getItem("organizationLv4"),
            orgLv5: localStorage.getItem("organizationLv5"),
            companyCode: localStorage.getItem("companyCode"),
            platform: "Web",
          },
          getRequestConfigurations()
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const FirebaseMessageListener = () =>
  new Promise((resolve) =>
    onMessage(messaging, (payload) => {
      resolve(payload);
    })
  );
