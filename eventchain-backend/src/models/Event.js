const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  date: {
    type: Date,
    required: true
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
    required: true
  },
  totalTickets: {
    type: Number,
    required: true
  },
  ticketsSold: {
    type: Number,
    default: 0
  },
  isClosed: { 
    type: Boolean, 
    default: false }
});

module.exports = mongoose.model('Event', eventSchema);
