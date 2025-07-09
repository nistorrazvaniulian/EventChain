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
    default: false 
  },
  location: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  category: {
    type: String,
    enum: [
      'Concert',
      'Teatru',
      'Stand-up Comedy',
      'Sport',
      'Festival',
      'Conferință',
      'Workshop',
      'Târg & Expo',
      'Petrecere',
      'Altele'
    ],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Event', eventSchema);
