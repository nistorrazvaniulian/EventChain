const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.post('/api/users/test', async (req, res) => {
    try {
      const user = new User({
        email: 'test@example.com',
        password_hash: '123456',
      });
  
      await user.save();
      res.send('User salvat cu succes!');
    } catch (error) {
      console.error('Eroare la salvarea userului:', error);
      res.status(500).send('A apărut o eroare.');
    }
});
  
module.exports = router;