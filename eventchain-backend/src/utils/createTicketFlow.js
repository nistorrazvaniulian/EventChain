const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { connect } = require('../services/blockchainService');
const generateQRCode = require('./generateQRCode');
const sendTicketEmail = require('./sendTicketEmail');

const createTicketFlow = async ({ userId, userEmail, eventId }) => {
  console.log('🎯 createTicketFlow pornit');

  // Verificăm dacă biletul există deja
  const existing = await Ticket.findOne({ userId, eventId });
  if (existing) return { status: 'exists', ticket: existing };

  const event = await Event.findById(eventId);
  if (!event) throw new Error('Evenimentul nu a fost găsit');

  if (event.ticketsSold >= event.totalTickets) {
    throw new Error('Nu mai sunt bilete disponibile');
  }

  const qrCode = uuidv4();
  const createdAt = new Date();
  const ticketId = new Ticket({ eventId, userId, qrCode, createdAt })._id.toString();

  // Formatăm data corect pentru blockchain
  const eventDateISO = new Date(event.date).toISOString();

  // Blockchain
  let contract, gateway;
  try {
    const blockchain = await connect();
    contract = blockchain.contract;
    gateway = blockchain.gateway;

    console.log('📦 Trimit la blockchain:', {
      ticketId,
      eventId: eventId.toString(),
      userId: userId.toString(),
      eventDate: eventDateISO,
      createdAt: createdAt.toISOString()
    });

    await contract.submitTransaction(
      'createTicket',
      ticketId,
      eventId.toString(),
      userId.toString(),
      eventDateISO,
      createdAt.toISOString()
    );

    await gateway.disconnect();
  } catch (err) {
    if (gateway) await gateway.disconnect();
    console.error('❌ Eroare blockchain:', err.message);
    throw new Error('Eroare blockchain');
  }

  // Salvare în MongoDB
  const ticket = new Ticket({
    _id: ticketId,
    eventId,
    userId,
    qrCode,
    createdAt
  });

  try {
    await ticket.save();
    console.log('🟢 Ticket salvat în MongoDB');
  } catch (err) {
    console.error('❌ Eroare salvare ticket:', err.message);
    throw new Error('Eroare la salvarea în MongoDB');
  }

  // Update număr bilete
  event.ticketsSold += 1;
  await event.save();

  // QR
  const qrPath = path.join(__dirname, '..', 'temp', `${ticketId}.png`);
  await generateQRCode(ticketId, qrPath);

  // Email
  try {
    await sendTicketEmail(userEmail || 'user@email.com', event.title, qrPath, ticketId);
    console.log('📧 Email trimis cu succes către:', userEmail);

    // Ștergem codul QR doar dacă emailul s-a trimis cu succes
    if (fs.existsSync(qrPath)) fs.unlinkSync(qrPath);
  } catch (e) {
    console.warn('❌ Eroare la trimiterea email-ului:', e.message);
  }

  return {
    status: 'created',
    ticket
  };
};

module.exports = createTicketFlow;
