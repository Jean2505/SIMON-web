// functions/firebase-admin-config.js
const admin = require('firebase-admin');
const serviceAccount = require('../firebase/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Se necessário, adicione outras configurações, como databaseURL, etc.
});

module.exports = admin;