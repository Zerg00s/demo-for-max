import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "AIzaSyCqZhbOjQKD_P9P1nqYPUzHn_oHPH5nJOU",
  authDomain: "zergtest-3788e.firebaseapp.com",
  databaseURL: "https://zergtest-3788e.firebaseio.com/",
  storageBucket: "zergtest-3788e.appspot.com",
  messagingSenderId: "160379549479"
};
var fire = firebase.initializeApp(config);
export default fire;