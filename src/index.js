const express = require('express');
const connectDb = require('./config/db');
const userRoutes = require('./routes/userRoutes')
const app = express();

const PORT = 3000;

app.use(userRoutes);

app.get('/', (req, res) => {
    res.send('EventChain backend is running');
});

connectDb();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
  
app.get('/api/ping', (req, res) => {
    res.send('pong');
});



  