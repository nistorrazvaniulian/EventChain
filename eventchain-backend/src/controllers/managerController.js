const Manager = require('../models/Manager');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const bcrypt = require('bcrypt');

const createTestManager = async (req, res) => {
  try {
    const existing = await Manager.findOne({ username: 'testManager' });
    if (existing) {
      return res.status(400).json({ error: 'Managerul de test există deja' });
    }

    const hashedPassword = await bcrypt.hash('654321', 10);

    const manager = new Manager({
      username: 'testManager',
      password_hash: hashedPassword
    });

    await manager.save();
    res.status(201).json({ message: 'Manager salvat cu succes', managerId: manager._id });
  } catch (error) {
    console.error('Eroare la salvarea managerului:', error);
    res.status(500).json({ error: 'Eroare internă' });
  }
};

  const loginManager = async (req, res) => {
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

    const token = jwt.sign(
      { id: manager._id, role: 'manager' },
      keys.jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      manager: {
        id: manager._id,
        username: manager.username
      }
    });
  } catch (error) {
    console.error('Eroare la login:', error);
    res.status(500).json({ error: 'Eroare internă server' });
  }
};

module.exports = {
    createTestManager,
    loginManager
}