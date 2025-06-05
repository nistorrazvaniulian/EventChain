const Manager = require('../models/Manager');

const bcrypt = require('bcrypt');

const createTestManager = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash('654321', 10);
    
        const manager = new Manager({
          username: 'testManager',
          password_hash: hashedPassword
        });
    
        await manager.save();
        res.status(201).json({ message: 'Manager salvat cu succes' });
      } catch (error) {
        console.error('Eroare la salvarea managerului:', error);
        res.status(500).json({ error: 'Eroare internă' });
      }
  };

const loginManager = async(req, res) => {
    try {
        const { username, password } = req.body;
    
        const manager = await Manager.findOne({ username });
        if (!manager) {
          return res.status(401).json({ error: 'Username sau parolă incorectă' });
        }
    
        const parolaValida = await bcrypt.compare(password, manager.password_hash);
        if (!parolaValida) {
          return res.status(401).json({ error: 'Username sau parolă incorectă' });
        }
    
        res.status(200).json({ message: 'Autentificare reușită' });
      } catch (error) {
        console.error('Eroare la login:', error);
        res.status(500).json({ error: 'Eroare internă server' });
      }
  }

module.exports = {
    createTestManager,
    loginManager
}