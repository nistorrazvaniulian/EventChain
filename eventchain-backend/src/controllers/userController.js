const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const keys = require('../config/keys');

const client = new OAuth2Client(keys.googleClientId);

const googleOAuthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing code in query' });
  }

  try {
    // 1. Cerem tokenurile de la Google
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: keys.googleClientId,
        client_secret: keys.googleClientSecret,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
    });

    const { id_token } = tokenRes.data;

    // 2. Verificăm id_token-ul
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: keys.googleClientId,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    if (!sub || !email || !name) {
      return res.status(401).json({ error: 'Invalid Google ID token' });
    }

    // 3. Creăm userul dacă nu există
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = new User({ email, name, googleId: sub });
      await user.save();
    }

    // 4. Semnăm JWT-ul propriu
    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'user' },
      keys.jwtSecret,
      { expiresIn: '1h' }
    );

    // 5. Redirecționăm spre pagina intermediară
    return res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${token}`);
  } catch (error) {
    console.error('Google OAuth error:', error.response?.data || error.message);
    return res.status(500).send('Authentication failed');
  }
};

const getMyTickets = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Acces neautorizat' });
    }

    const tickets = await Ticket.find({ userId }).populate('eventId');

    res.status(200).json(Array.isArray(tickets) ? tickets : []);
  } catch (err) {
    console.error('Eroare la extragerea biletelor userului:', err);
    res.status(500).json({ error: 'Eroare la extragerea biletelor' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email');

    if (!user) {
      return res.status(404).json({ error: 'Utilizatorul nu a fost găsit' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Eroare la getCurrentUser:', error);
    res.status(500).json({ error: 'Eroare server' });
  }
};

  module.exports = { 
    googleOAuthCallback,
    getMyTickets,
    getCurrentUser
   };