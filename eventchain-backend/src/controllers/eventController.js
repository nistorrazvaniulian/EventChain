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

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, date, totalTickets } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Evenimentul nu a fost găsit' });
    }

    if (event.organizerId.toString() !== req.manager.id) {
      return res.status(403).json({ error: 'Acces interzis – nu ești organizatorul acestui eveniment' });
    }

    const diffHours = (new Date() - new Date(event.date)) / (1000 * 60 * 60);
    if (diffHours >= 3) {
      return res.status(400).json({ error: 'Nu poți edita un eveniment care a trecut de 3h de la start' });
    }

    if (totalTickets < event.ticketsSold) {
      return res.status(400).json({ error: `Nu poți seta totalTickets mai mic decât biletele vândute (${event.ticketsSold})` });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.totalTickets = totalTickets || event.totalTickets;

    await event.save();
    res.status(200).json({ message: 'Eveniment actualizat cu succes', event });
  } catch (error) {
    console.error('Eroare la actualizarea evenimentului:', error);
    res.status(500).json({ error: 'Eroare internă server' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Evenimentul nu a fost găsit' });
    }

    if (event.organizerId.toString() !== req.manager.id) {
      return res.status(403).json({ error: 'Acces interzis – nu ești organizatorul acestui eveniment' });
    }

    const diffHours = (new Date() - new Date(event.date)) / (1000 * 60 * 60);
    if (diffHours >= 3) {
      return res.status(400).json({ error: 'Nu poți șterge un eveniment care a trecut de 3h de la start' });
    }

    await event.deleteOne();
    res.status(200).json({ message: 'Eveniment șters cu succes' });
  } catch (error) {
    console.error('Eroare la ștergerea evenimentului:', error);
    res.status(500).json({ error: 'Eroare internă server' });
  }
};


module.exports = {
  createEvent,
  getAllEvents,
  getEventTickets,
  deleteEvent,
  updateEvent
};

