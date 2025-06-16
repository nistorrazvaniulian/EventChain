const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { connect } = require('../services/blockchainService');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const generateQRCode = require('../utils/generateQRCode');
const sendTicketEmail = require('../utils/sendTicketEmail');
const { getTicket } = require('../services/blockchainService');

const buyTicket = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const userEmail = req.user.email;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Evenimentul nu a fost găsit' });

    if (event.ticketsSold >= event.totalTickets) {
      return res.status(400).json({ error: 'Nu mai sunt bilete disponibile' });
    }

    const qrCode = uuidv4();
    const createdAt = new Date();

    const ticketId = new Ticket({
      eventId,
      userId,
      qrCode,
      createdAt
    })._id.toString();

    const { contract, gateway } = await connect();
    await contract.submitTransaction(
      'createTicket',
      ticketId,
      eventId.toString(),
      userId.toString(),
      event.date.toISOString(),
      createdAt.toISOString()
    );
    await gateway.disconnect();

    const ticket = new Ticket({
      _id: ticketId,
      eventId,
      userId,
      qrCode,
      createdAt
    });
    await ticket.save();

    event.ticketsSold += 1;
    await event.save();

    const qrPath = path.join(__dirname, '..', 'temp', `${ticketId}.png`);
    await generateQRCode(ticketId, qrPath);
    await sendTicketEmail(userEmail, event.title, qrPath, ticketId);
    fs.unlinkSync(qrPath); // șterge codul QR temporar după trimitere

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

const getTicketFromBlockchain = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { contract, gateway } = await connect();

    const result = await contract.evaluateTransaction('getTicket', ticketId);
    await gateway.disconnect();

    res.status(200).json(JSON.parse(result.toString()));
  } catch (error) {
    console.error('Eroare getTicket:', error.message);
    res.status(500).json({ error: 'Eroare la extragerea biletului din blockchain' });
  }
};

const validateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { contract, gateway } = await connect();

    const result = await contract.evaluateTransaction('isTicketValid', ticketId);
    await gateway.disconnect();

    res.status(200).json({ isValid: result.toString() === 'true' });
  } catch (error) {
    console.error('Eroare isTicketValid:', error.message);
    res.status(500).json({ error: 'Eroare la validarea biletului' });
  }
};

const checkOwnershipOnBlockchain = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;
    const { contract, gateway } = await connect();

    const result = await contract.evaluateTransaction('isTicketOwnedByUser', ticketId, userId);
    await gateway.disconnect();

    res.status(200).json({ isOwner: result.toString() === 'true' });
  } catch (error) {
    console.error('Eroare isTicketOwnedByUser:', error.message);
    res.status(500).json({ error: 'Eroare la verificarea deținerii biletului' });
  }
};

// const invalidateTicket = async (req, res) => {
//   try {
//     const { ticketId } = req.params;
//     const { contract, gateway } = await connect();

//     const result = await contract.submitTransaction('invalidateTicket', ticketId);
//     await gateway.disconnect();

//     res.status(200).json({ message: 'Bilet invalidat', ticket: JSON.parse(result.toString()) });
//   } catch (error) {
//     console.error('Eroare invalidateTicket:', error.message);
//     res.status(500).json({ error: 'Eroare la invalidarea biletului' });
//   }
// };

const invalidateTicketByManager = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticketOnChain = await getTicket(ticketId);
    if (!ticketOnChain) {
      return res.status(404).json({ message: 'Bilet inexistent' });
    }

    const isValid = ticketOnChain.isValid === true || ticketOnChain.isValid === 'true';
    if (!isValid) {
      return res.status(400).json({ message: 'Biletul este deja invalidat' });
    }

    const { contract, gateway } = await connect();
    const result = await contract.submitTransaction('invalidateTicket', ticketId);
    await gateway.disconnect();

    await Ticket.findByIdAndUpdate(ticketId, { isValid: false });

    return res.status(200).json({
      message: 'Bilet invalidat cu succes',
      ticket: JSON.parse(result.toString())
    });
  } catch (error) {
    const message = error.message || '';

    if (message.includes('already invalid')) {
      return res.status(400).json({ message: 'Biletul este deja invalidat' });
    }

    console.error('Eroare invalidateTicketByManager:', message);
    return res.status(500).json({ message: 'Eroare la invalidarea biletului' });
  }
};


module.exports = {
  buyTicket,
  getTicketFromBlockchain,
  validateTicket,
  checkOwnershipOnBlockchain,
  //invalidateTicket,
  invalidateTicketByManager
};
