const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { v4: uuidv4 } = require('uuid'); 

const buyTicket = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Evenimentul nu a fost găsit' });
    }

    if (event.ticketsSold >= event.totalTickets) {
      return res.status(400).json({ error: 'Nu mai sunt bilete disponibile' });
    }

    const qrCode = uuidv4(); 

    const ticket = new Ticket({
      eventId,
      userId,
      qrCode
    });

    await ticket.save();

    event.ticketsSold += 1;
    await event.save();

    res.status(201).json({
      message: 'Bilet cumpărat cu succes',
      ticket: {
        id: ticket._id,
        qrCode: ticket.qrCode,
        eventId: ticket.eventId,
        isValid: ticket.isValid
      }
    });
  } catch (error) {
    console.error('Eroare la cumpărare bilet:', error);
    res.status(500).json({ error: 'Eroare internă server' });
  }
};

module.exports = {
  buyTicket
};
