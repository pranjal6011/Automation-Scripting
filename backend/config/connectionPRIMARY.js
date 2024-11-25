'use strict';
var hana = require('@sap/hana-client');
require('dotenv').config();

var connOptions = {
    serverNode:process.env.PRIMARY_HOST,
    UID: process.env.UID,
    PWD: process.env.PWD,

    sslValidateCertificate: 'false',
};
var connection = hana.createConnection();

connection.connect(connOptions);
module.exports=connection;