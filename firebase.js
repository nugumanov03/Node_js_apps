// const { initializeApp, cert } = require('firebase-admin/app')
// const { getFirestore } = require('firebase-admin/firestore')

// const serviceAccount = require('./creds.json')

// initializeApp({
//     credential: cert(serviceAccount)
// })

// const db = getFirestore()

// module.exports = { db }

const { initializeApp } = require('firebase-admin/app')
// import { initializeApp } from 'firebase-admin/app';
const { getDatabase, ref , onValue} = require('firebase-admin/database')
// import { getDatabase }  from 'firebase-admin/database';

const firebaseConfig = {
    apiKey: "AIzaSyA5lpwu7SjYosrOYRyRS7cLHPDEmCY3Buw",
    authDomain: "tg-bot-kiperlot.firebaseapp.com",
    databaseURL: "https://tg-bot-kiperlot-default-rtdb.firebaseio.com",
    projectId: "tg-bot-kiperlot",
    storageBucket: "tg-bot-kiperlot.appspot.com",
    messagingSenderId: "200722192344",
    appId: "1:200722192344:web:58ecfe6f9acca8252444ad",
    measurementId: "G-LR4Q3LTVRH"
};
// const serviceAccount = require('./creds.json')

// initializeApp({
//     credential: cert(serviceAccount)
// })
const app = initializeApp(firebaseConfig)
const db = getDatabase()

module.exports = { db }


//     "firebase": "^5.4.1",
// "node-telegram-bot-api": "^0.30.0"