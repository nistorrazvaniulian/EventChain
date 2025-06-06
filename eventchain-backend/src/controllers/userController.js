const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const client = new OAuth2Client(keys.googleClientId);

const googleLogin = async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ error: 'ID token is missing' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: keys.googleClientId,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = new User({ email, name, googleId: sub });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email }, keys.jwtSecret, {
      expiresIn: '7d',
    });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Invalid Google ID token' });
  }
};

  module.exports = { 
    googleLogin
   };