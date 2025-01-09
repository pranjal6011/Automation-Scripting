'use strict';
const express = require('express');
const cors = require('cors');
const env= require('./config/environment');


const app = express();
const port = env.PORT || 5000;
// Enable CORS
const corsOptions = {
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

app.use(cors(corsOptions));
app.use(express.json());


// Functions for Primary Database Operations
const routes = require('./routes/index');
app.use('/', routes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
