const admin = require('firebase-admin');

// Ensure that you have a FIREBASE_SERVICE_ACCOUNT base64 encoded string or
// a separate service-account.json file path configured in your environment.
// For Render, copying the JSON into a single base64 string is usually easiest.
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('ascii'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // Fallback or local warning
    console.warn('Firebase Admin is not configured. Missing FIREBASE_SERVICE_ACCOUNT_BASE64.');
  }
} catch (error) {
  console.error('Error initializing Firebase admin:', error);
}

const sendNotification = async (deviceToken, title, body, data = {}) => {
  if (!admin.apps.length) {
    console.warn('Firebase Admin not initialized, skipping notification.');
    return;
  }

  const message = {
    notification: {
      title,
      body
    },
    data,
    token: deviceToken
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent Firebase notification:', response);
    return response;
  } catch (error) {
    console.error('Error sending Firebase notification:', error);
    throw error;
  }
};

module.exports = {
  sendNotification
};
