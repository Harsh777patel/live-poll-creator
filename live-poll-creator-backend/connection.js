const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URI;

if (!url) {
    console.error('❌ FATAL ERROR: MONGO_URI environment variable is not defined.');
    console.error('   Please set MONGO_URI in your .env file or Render environment settings.');
    process.exit(1);
}

// Asynchronous function - returns Promise
mongoose.connect(url)
    .then(() => {
        console.log('✅ DB Connected successfully');
    }).catch((err) => {
        console.error('❌ DB Connection failed:', err.message);
        process.exit(1);
    });

module.exports = mongoose;