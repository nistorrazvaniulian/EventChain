require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const connectDb = require('./config/db');
const { handleStripeWebhook } = require('./controllers/paymentController'); // ✅ Import direct pt webhook

// 🧠 Rute
const userRoutes = require('./routes/userRoutes');
const managerRoutes = require('./routes/managerRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const managerTicketRoutes = require('./routes/managerTicketRoutes');
const scanRoutes = require('./routes/scanRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const invalidateExpiredTicketsJob = require('./jobs/invalidateExpiredTickets');

const app = express();
invalidateExpiredTicketsJob();

// ✅ Middleware CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ⚠️ Stripe webhook – PRIMA rută, cu body raw
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// ✅ Apoi putem folosi express.json()
app.use(express.json());

// 🖼️ Servire imagini din uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ Rute API
app.use('/api/users', userRoutes);
app.use('/api/manager', managerRoutes); 
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/manager-tickets', managerTicketRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/payments', paymentRoutes);

// 🧪 Test
app.get('/', (req, res) => {
  res.send('EventChain-backend is running');
});

// 🔌 Conectare DB și pornire server
connectDb();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
