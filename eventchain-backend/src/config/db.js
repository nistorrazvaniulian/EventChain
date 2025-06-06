require('dotenv').config();
const mongoose = require('mongoose');
const keys = require('./keys');

async function connectDb() {
    try{
        await mongoose.connect(keys.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          console.log('MongoDB connected successfully');
    } catch (error){
        console.error('MongoDB connection error:', error);
    }
}

module.exports = connectDb;