const mongoose = require('mongoose');
require('dotenv').config();

const url =process.env.MONGO_URI;

//Asynchronous function - returns Promise
mongoose.connect( url )
//Succesfully 
    .then((result) => {
        console.log('DB Connected');
//error    
    }).catch((err) => {
        console.log(err);     
    });

module.exports = mongoose