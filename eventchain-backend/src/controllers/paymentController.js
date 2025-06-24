const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Ticket = require('../models/Ticket');
const createTicketFlow = require('../utils/createTicketFlow');

// ✅ Creare sesiune Stripe
const createCheckoutSession = async (req, res) => {
  const { eventId, title, price } = req.body;
  const userId = req.user.id;
  const userEmail = req.user.email;

  try {
    // ✅ Verificare bilet existent
    const existingTicket = await Ticket.findOne({ userId, eventId });
    if (existingTicket) {
      return res.status(400).json({ error: 'Ai deja un bilet pentru acest eveniment.' });
    }

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
      customer_email: userEmail, // ✅ Setăm emailul pentru a fi disponibil în webhook
      success_url: `${process.env.FRONTEND_URL}/payment-success?eventId=${eventId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?eventId=${eventId}`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Eroare Stripe:', error);
    res.status(500).json({ error: 'Eroare la crearea sesiunii de plată' });
  }
};

// ✅ Webhook Stripe – finalizează doar dacă plata e completă
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook invalid:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, eventId } = session.metadata;
    const userEmail = session.customer_email;

    try {
      const { status } = await createTicketFlow({
        userId,
        userEmail,
        eventId
      });

      if (status === 'exists') {
        return res.status(200).send('Bilet deja generat.');
      }

      res.status(200).send('Bilet creat cu succes!');
    } catch (err) {
      console.error('Eroare în webhook:', err);
      res.status(500).send('Eroare la crearea biletului');
    }
  } else {
    res.status(200).send('Eveniment Stripe ignorat.');
  }
};

module.exports = {
  createCheckoutSession,
  handleStripeWebhook
};
