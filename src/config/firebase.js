// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken,onMessage} from 'firebase/messaging';

//....


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi7nG1LT-iYa_Ybw3E4h4c1lc1RSoK44E",
  authDomain: "flavour-frame-notification.firebaseapp.com",
  projectId: "flavour-frame-notification",
  storageBucket: "flavour-frame-notification.appspot.com",
  messagingSenderId: "704164919691",
  appId: "1:704164919691:web:fb821f55495e604be0578e",
  measurementId: "G-4VMMK05BKL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const messaging = getMessaging(app);


  const getOrRegisterServiceWorker = () => {
    if ('serviceWorker' in navigator) {
     return window.navigator.serviceWorker
       .getRegistration('/firebase-cloud-messaging-push-scope')
       .then((serviceWorker) => {
         if (serviceWorker){
           return serviceWorker;
         } 
         return window.navigator.serviceWorker.register('/firebase-messaging-sw.js')
         .then((serviceWorker)=>{
               console.log("success registering SW");
         }).catch((err)=>{
           console.log("registering failed",err);
         });
       }
   )}
   throw new Error('The browser doesn`t support service worker.');
  };
  
  
  export const requestToken = async () => {
    let currentToken = "";
    try {
      const serviceWorkerRegistration = await getOrRegisterServiceWorker();
      currentToken = await getToken(messaging, {
        vapidKey: "BDBMdA4niFGPBIGZorc3N3kuEHdFCTaYFM4jQnj9UnfO-QsfFm6zQo7EWBeFu_UbdyVgNt_R7vCRkH_yHbpMfc4",
        serviceWorkerRegistration
      });
    } catch (error) {
      console.log("An error occurred while retrieving token. ", error);
    }
    console.log("Asdasds",currentToken);
    return currentToken;
  };
  export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });