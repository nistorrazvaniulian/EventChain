const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Ticket = require('../models/Ticket');
const createTicketFlow = require('../utils/createTicketFlow');

// Creare sesiune Stripe
const createCheckoutSession = async (req, res) => {
  const { eventId, title, price } = req.body;
  const userId = req.user.id;
  const userEmail = req.user.email;

  try {
    console.log('🔍 Verificare bilet existent pentru user:', userId, 'și event:', eventId);
    const existingTicket = await Ticket.findOne({ userId, eventId });
    if (existingTicket) {
      console.log('⚠️ Utilizatorul are deja un bilet!');
      return res.status(400).json({ error: 'Ai deja un bilet pentru acest eveniment.' });
    }

    console.log('🛒 Creare sesiune Stripe pentru:', title, 'cu prețul:', price);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'ron',
          product_data: {
            name: title,
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      }],
      metadata: {
        userId,
        eventId,
      },
      customer_email: userEmail,
      success_url: `${process.env.FRONTEND_URL}/payment-success?eventId=${eventId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?eventId=${eventId}`,
    });

    console.log('✅ Sesiune Stripe creată cu URL:', session.url);
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('❌ Eroare la crearea sesiunii de plată Stripe:', error);
    res.status(500).json({ error: 'Eroare la crearea sesiunii de plată' });
  }
};

// ✅ Webhook Stripe – finalizează doar dacă plata e completă
const handleStripeWebhook = async (req, res) => {
  console.log('📩 Webhook Stripe primit');
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('✅ Eveniment Stripe tip:', event.type);
  } catch (err) {
    console.error('❌ Webhook invalid:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('🎉 Sesiune completă Stripe:', session.id);

    const { userId, eventId } = session.metadata;
    const userEmail = session.customer_email;

    try {
      console.log('🎫 Creare bilet în urma plății pentru:', userId, eventId);
      const { status } = await createTicketFlow({
        userId,
        userEmail,
        eventId
      });

      if (status === 'exists') {
        console.log('⚠️ Bilet deja generat anterior pentru acest user/event');
        return res.status(200).send('Bilet deja generat.');
      }

      console.log('✅ Bilet creat cu succes în urma webhook-ului!');
      res.status(200).send('Bilet creat cu succes!');
    } catch (err) {
      console.error('❌ Eroare la crearea biletului în webhook:', err);
      res.status(500).send('Eroare la crearea biletului');
    }
  } else {
    console.log('ℹ️ Eveniment Stripe ignorat:', event.type);
    res.status(200).send('Eveniment Stripe ignorat.');
  }
};

module.exports = {
  createCheckoutSession,
  handleStripeWebhook
};
