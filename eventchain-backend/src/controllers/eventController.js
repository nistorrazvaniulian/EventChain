const mongoose = require('mongoose');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      totalTickets,
      location,
      city,
      category,
      price
    } = req.body;

    // Verificare fișier imagine
    if (!req.file) {
      return res.status(400).json({ error: 'Imaginea evenimentului este obligatorie' });
    }

    // Salvăm doar numele fișierului (fără /uploads/)
    const imageFileName = req.file.filename;

    // Validare câmpuri text
    if (!title || !date || !totalTickets || !location || !city || !category || !price) {
      return res.status(400).json({
        error: 'Câmpurile title, date, totalTickets, location, city, category, price și imagine sunt obligatorii'
      });
    }

    // Validare preț pozitiv
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ error: 'Prețul trebuie să fie un număr pozitiv' });
    }

    // Creare eveniment
    const event = new Event({
      title,
      description,
      date,
      totalTickets,
      location,
      city,
      category,
      image: imageFileName, // salvăm doar numele fișierului
      price: numericPrice,
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

const getEventsByManager = async (req, res) => {
  try {
    const managerId = req.manager?.id || req.manager?._id;

    if (!managerId) {
      return res.status(401).json({ error: 'Manager neautorizat' });
    }

    const events = await Event.find({ organizerId: managerId }).sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error('Eroare la extragerea evenimentelor pentru manager:', error);
    res.status(500).json({ error: 'Eroare internă server' });
  }
};


const getEventTickets = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: 'ID eveniment invalid' });
    }

    const eventObjectId = new mongoose.Types.ObjectId(eventId);
    const tickets = await Ticket.find({ eventId: eventObjectId });

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Eroare la extragerea biletelor' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      title,
      description,
      date,
      totalTickets,
      location,
      city,
      category,
      price
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: 'ID eveniment invalid' });
    }

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

    if (totalTickets !== undefined && totalTickets < event.ticketsSold) {
      return res.status(400).json({ error: `Nu poți seta totalTickets mai mic decât biletele vândute (${event.ticketsSold})` });
    }

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({ error: 'Prețul trebuie să fie un număr pozitiv' });
      }
      event.price = numericPrice;
    }

    // ✅ Salvăm doar numele fișierului (fără /uploads)
    if (req.file) {
      event.image = req.file.filename;
    }

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (totalTickets !== undefined) event.totalTickets = totalTickets;
    if (location !== undefined) event.location = location;
    if (city !== undefined) event.city = city;
    if (category !== undefined) event.category = category;

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

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: 'ID eveniment invalid' });
    }

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

const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: 'ID eveniment invalid' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Evenimentul nu a fost găsit' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Eroare la preluarea evenimentului:', error);
    res.status(500).json({ error: 'Eroare internă server' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventTickets,
  deleteEvent,
  updateEvent,
  getEventsByManager,
  getEventById
};

