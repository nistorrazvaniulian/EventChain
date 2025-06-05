const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password_hash: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Manager', managerSchema);