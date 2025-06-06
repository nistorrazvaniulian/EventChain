require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGODB_URI,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  jwtSecret: process.env.JWT_SECRET
};
