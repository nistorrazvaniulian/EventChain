const mongoose = require('mongoose');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, totalTickets } = req.body;

    if (!title || !date || !totalTickets) {
      return res.status(400).json({ error: 'Title, date și totalTickets sunt obligatorii' });
    }

    const event = new Event({
      title,
      description,
      date,
      totalTickets,
      organizerId: req.manager.id
    });

    await event.save();

    res.status(201).json({ message: 'Eveniment creat cu succes', event });
  } catch (error) {
    console.error('Eroare la crearea evenimentului:', error);
    res.status(500).json({ error: 'Eroare internă server' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Eroare la listarea evenimentelor:', error);
    res.status(500).json({ error: 'Eroare internă server' });
  }
};

const getEventTickets = async (req, res) => {
  try {
    const eventObjectId = new mongoose.Types.ObjectId(req.params.eventId);
    const tickets = await Ticket.find({ eventId: eventObjectId });

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Eroare la extragerea biletelor' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventTickets
};

