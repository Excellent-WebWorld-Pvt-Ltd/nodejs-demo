
/*const admin = require('firebase-admin');
const serviceAccount = require('../shoppinggate.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendPush = (token, title, body, data = {}) => {
  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
    data: data,
  };

  try {
    const response = admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

module.exports = { sendPush };*/
