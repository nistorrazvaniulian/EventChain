require('dotenv').config();
const express = require('express');
const connectDb = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const managerRoutes = require('./routes/managerRoutes');

const app = express();

app.use(express.json());

const PORT = 3000;

app.use('/api/users', userRoutes);
app.use('/api/managers', managerRoutes);

app.get('/', (req, res) => {
    res.send('EventChain-backend is running');
});

connectDb();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});