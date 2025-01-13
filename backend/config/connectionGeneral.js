'use strict';
const hana = require('@sap/hana-client');

const connectToHana = async (credentials) => {
    const { host, port, userId, password } = credentials;

    if (!host || !port || !userId || !password) {
        throw new Error('Missing required connection parameters.');
    }

    const serverNode = `${host}:${port}`;
    const connOptions = {
        serverNode,
        UID: userId,
        PWD: password,
        sslValidateCertificate: 'false',
    };

    const connection = hana.createConnection();

    return new Promise((resolve, reject) => {
        connection.connect(connOptions, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
};

module.exports = connectToHana;
