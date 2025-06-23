require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const connectDb = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const managerRoutes = require('./routes/managerRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const managerTicketRoutes = require('./routes/managerTicketRoutes');
const scanRoutes = require('./routes/scanRoutes');

const invalidateExpiredTicketsJob = require('./jobs/invalidateExpiredTickets');

const app = express();
invalidateExpiredTicketsJob();

// ✅ Middleware CORS configurat corect
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// 🖼️ Servim imaginile încărcate din folderul uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rute
app.use('/api/users', userRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/manager-tickets', managerTicketRoutes);
app.use('/api/scan', scanRoutes);

// Test ruta
app.get('/', (req, res) => {
  res.send('EventChain-backend is running');
});

// Conectare DB și pornire server
connectDb();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
