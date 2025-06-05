const User = require('../models/User');

const createTestUser = async (req, res) => {
    try {
      const user = new User({
        email: 'test@example.com'
      });
  
      await user.save();
      res.status(201).json({ message: 'User salvat cu succes' });
    } catch (error) {
      console.error('Eroare la salvarea userului:', error);
      res.status(500).json({ error: 'Eroare internă' });
    }
  };

  const googleLogin = async(req, res) => {
    try {
        res.status(200).json({ message: "Google login test reusit" });
      } catch (error) {
        console.error('Eroare la login:', error);
        res.status(500).json({ error: 'Eroare internă server' });
      }
  }

  module.exports = { 
    createTestUser,
    googleLogin
   };