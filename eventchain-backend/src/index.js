require('dotenv').config();
const express = require('express');
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

app.use(express.json());

const PORT = 3000;

app.use('/api/users', userRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/manager-tickets', managerTicketRoutes);
app.use('/api/scan', scanRoutes);

app.get('/', (req, res) => {
    res.send('EventChain-backend is running');
});

connectDb();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});