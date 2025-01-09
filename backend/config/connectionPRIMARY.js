'use strict';
var hana = require('@sap/hana-client');
const env= require('./environment');

var connOptions = {
    serverNode:env.PRIMARY_HOST,
    UID: env.UID,
    PWD: env.PWD,

    sslValidateCertificate: 'false',
};
var connection = hana.createConnection();

connection.connect(connOptions);
module.exports=connection;