const express = require('express');
const router = express.Router();
const connection = require('../config/connectionPRIMARY');

async function dropTableIfExists() {
    const dropTableQuery = "DROP TABLE PSE_CERTIFICATES_STATUS";
    try {
        await connection.exec(dropTableQuery);
        console.log("Dropped existing PSE_CERTIFICATES_STATUS table.");
    } catch (error) {
        console.error(`Error dropping table: ${error.message}`);
    }
}

async function createTable() {
    const createTableQuery = `
        CREATE TABLE PSE_CERTIFICATES_STATUS (
            pse_name NVARCHAR(255) NOT NULL,
            certificate_name NVARCHAR(255) NOT NULL,
            valid_from DATE NOT NULL,
            valid_until DATE NOT NULL,
            status NVARCHAR(50) NOT NULL,
            PRIMARY KEY (pse_name, certificate_name)
        )
    `;
    try {
        await connection.exec(createTableQuery);
        console.log("Created new PSE_CERTIFICATES_STATUS table.");
    } catch (error) {
        console.error(`Error creating table: ${error.message}`);
        throw error;
    }
}

async function fetchCertificateData() {
    const fetchQuery = `
        SELECT pse_name, certificate_name, valid_from, valid_until
        FROM PSE_CERTIFICATES WHERE PSE_NAME='HTTPS_GOOGLE_AWS'
    `;
    try {
        const results = await connection.exec(fetchQuery);
        console.log(`Fetched ${results.length} records from PSE_CERTIFICATES.`);
        return results;
    } catch (error) {
        console.error(`Error fetching data from PSE_CERTIFICATES: ${error.message}`);
        throw error;
    }
}

function validateCertificates(data) {
    const today = new Date();
    return data.map(record => {
        const validFrom = new Date(record.VALID_FROM);
        const validUntil = new Date(record.VALID_UNTIL);
        const status = validFrom <= today && today <= validUntil ? "Valid" : "Expired";
        return {
            pse_name: record.PSE_NAME,
            certificate_name: record.CERTIFICATE_NAME,
            valid_from: record.VALID_FROM,
            valid_until: record.VALID_UNTIL,
            status
        };
    });
}

async function insertStatusData(validatedData) {
    const insertQuery = `
        INSERT INTO PSE_CERTIFICATES_STATUS
        (pse_name, certificate_name, valid_from, valid_until, status)
        VALUES (?, ?, ?, ?, ?)
    `;
    try {
        for (let data of validatedData) {
            await connection.exec(insertQuery, [
                data.pse_name,
                data.certificate_name,
                data.valid_from,
                data.valid_until,
                data.status
            ]);
        }
        console.log(`Inserted ${validatedData.length} records into PSE_CERTIFICATES_STATUS.`);
    } catch (error) {
        console.error(`Error inserting data into PSE_CERTIFICATES_STATUS: ${error.message}`);
        throw error;
    }
}

async function fetchFinalResults() {
    const fetchQuery = "SELECT * FROM PSE_CERTIFICATES_STATUS";
    try {
        const results = await connection.exec(fetchQuery);
        return results;
    } catch (error) {
        console.error(`Error fetching final results: ${error.message}`);
        throw error;
    }
}

module.exports.checkPSE = async function (req, res) {
    try {
        // Drop the existing table if exists
        await dropTableIfExists();

        // Create the new table
        await createTable();

        // Fetch certificate data
        const certificateData = await fetchCertificateData();

        // Validate the certificates
        const validatedData = validateCertificates(certificateData);

        // Insert validated data into the status table
        await insertStatusData(validatedData);

        // Fetch and return the final results
        const finalResults = await fetchFinalResults();
        res.status(200).json({ results: finalResults });
    } catch (error) {
        console.error(`Error processing certificates: ${error.message}`);
        res.status(500).json({ message: "Error processing certificates", error: error.message });
    }
};
