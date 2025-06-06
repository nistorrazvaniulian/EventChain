const Event = require('../models/Event');

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
      organizerId: req.user.id
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

module.exports = {
  createEvent,
  getAllEvents
};

