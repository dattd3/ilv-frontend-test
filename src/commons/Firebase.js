import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';
import { getRequestConfigurations } from './Utils';

const firebaseConfig = {
    apiKey: 'AIzaSyBMM56lyG-eU4gORGxcGzLUwPlvWUM4cxY',
    authDomain: 'myvinpearl-693c0.firebaseapp.com',
    databaseURL: 'https://myvinpearl-693c0.firebaseio.com',
    projectId: 'myvinpearl-693c0',
    storageBucket: 'myvinpearl-693c0.appspot.com',
    messagingSenderId: '325470433070',
    appId: '1:325470433070:web:25ac00e9e10da38fc8d4bf',
  },
  firebaseApp = initializeApp(firebaseConfig),
  messaging = getMessaging(firebaseApp);

export const FirebaseUpdateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey:
          'BFRO-mk2_TtRhn-hlwO_IUxzmL6JOHjkr72lCjOZXpWN5k62t4B7NqJiQoWsty1Iy0W8Q0q-gWq1F9jZRW12zik',
      });
      if (!!token) {
        console.log('FIREBASE TOKEN: ', token);
        localStorage.setItem('firebaseToken', token);
        await axios.post(
          `${process.env.REACT_APP_REQUEST_URL}device/updateToken`,
          {
            deviceToken: token,
            orgLv3: localStorage.getItem('organizationLv3'),
            orgLv4: localStorage.getItem('organizationLv4'),
            orgLv5: localStorage.getItem('organizationLv5'),
            companyCode: localStorage.getItem('companyCode'),
            platform: 'Web',
          },
          getRequestConfigurations()
        );
      }
    } else {
      toast.info(
        'Vui lòng thêm quyền đẩy thông báo theo hướng dẫn trong trình duyệt'
      );
    }
  } catch (err) {}
};

export const FirebaseMessageListener = () =>
  new Promise((resolve) => 
  onMessage(messaging, (payload) => {
    console.log('========================================');
    console.log('payload: ', payload);
    console.log('========================================');
    resolve(payload)
  }
  )
  // {
  //   return 0;
  // }
  );
