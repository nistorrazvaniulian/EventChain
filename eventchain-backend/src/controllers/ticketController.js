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
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId || !userEmail) {
      return res.status(401).json({ error: 'Utilizator neautentificat' });
    }

    const { status, ticket } = await createTicketFlow({
      userId,
      userEmail,
      eventId
    });

    if (status === 'exists') {
      return res.status(409).json({ error: 'Ai deja un bilet pentru acest eveniment' });
    }

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
    console.error('Eroare la cumpărare bilet:', error.message);
    res.status(500).json({ error: 'Eroare internă server' });
  }
};

const getTicketFromBlockchain = async (req, res) => {
  try {
    const { ticketId } = req.params;
    if (!ticketId) {
      return res.status(400).json({ error: 'Lipsă ticketId în parametri' });
    }

    const { contract, gateway } = await connect();
    const result = await contract.evaluateTransaction('getTicket', ticketId);
    await gateway.disconnect();

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Biletul nu a fost găsit în blockchain' });
    }

    res.status(200).json(JSON.parse(result.toString()));
  } catch (error) {
    console.error('Eroare getTicketFromBlockchain:', error.message);
    res.status(500).json({ error: 'Eroare la extragerea biletului din blockchain' });
  }
};


const validateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    if (!ticketId) {
      return res.status(400).json({ error: 'Lipsă ticketId în parametri' });
    }

    const { contract, gateway } = await connect();
    const result = await contract.evaluateTransaction('isTicketValid', ticketId);
    await gateway.disconnect();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Biletul nu a fost găsit în blockchain' });
    }

    res.status(200).json({ isValid: result.toString() === 'true' });
  } catch (error) {
    console.error('Eroare validateTicket:', error.message);
    res.status(500).json({ error: 'Eroare la validarea biletului' });
  }
};

const checkOwnershipOnBlockchain = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user?.id;

    if (!ticketId) {
      return res.status(400).json({ error: 'Lipsă ticketId în parametri' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Utilizator neautentificat' });
    }

    const { contract, gateway } = await connect();
    const result = await contract.evaluateTransaction('isTicketOwnedByUser', ticketId, userId);
    await gateway.disconnect();

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Biletul nu a fost găsit în blockchain' });
    }

    res.status(200).json({ isOwner: result.toString() === 'true' });
  } catch (error) {
    console.error('Eroare checkOwnershipOnBlockchain:', error.message);
    res.status(500).json({ error: 'Eroare la verificarea deținerii biletului' });
  }
};


const invalidateTicketByManager = async (req, res) => {
  try {
    const { ticketId } = req.params;

    let ticketOnChain;
    try {
      ticketOnChain = await getTicket(ticketId);
    } catch (err) {
      if (err.message.includes('does not exist')) {
        return res.status(404).json({ message: 'Bilet inexistent' });
      }
      throw err;
    }

    const isValid = ticketOnChain.status === 'valid';
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
  invalidateTicketByManager
};
