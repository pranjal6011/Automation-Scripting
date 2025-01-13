'use strict';
const express = require('express');
const router = express.Router();
const connectToHana = require('../config/connectionGeneral'); // Path to your Hana connection module

async function getAllRemoteSources(credentials) {
    let connection;
    try {
        // Establish connection to HANA database
        connection = await connectToHana(credentials);

        // Query remote sources from the database
        const result = await connection.exec("SELECT REMOTE_SOURCE_NAME FROM SYS.REMOTE_SOURCES");

        return { remoteSourceResults: result };
    } catch (err) {
        throw new Error('Error fetching remote sources: ' + err.message);
    } finally {
        // Close the connection when done
        if (connection) {
            connection.disconnect();
        }
    }
}

module.exports.getRemoteSources = async function (req, res) {
    try {
        const { credentials } = req.body;

        // Validate credentials
        if (!credentials || !credentials.host || !credentials.port || !credentials.userId || !credentials.password) {
            return res.status(400).json({ message: 'Missing required credentials' });
        }

        // Get remote sources using the provided credentials
        const remoteSourcesStatus = await getAllRemoteSources(credentials);
        return res.status(200).json(remoteSourcesStatus);
    } catch (err) {
        console.error('Error in getRemoteSources:', err);
        res.status(500).json({ message: 'Error while getting remote sources', error: err.message });
    }
};

// You can define the checkRemoteSources function similarly if needed
async function checkRemote(credentials, remoteSourcesToCheck) {
    let connection;
    let remoteSourceResults = [];
    let errorResults = [];

    try {
        // Establish connection to HANA database
        connection = await connectToHana(credentials);

        // Loop through the provided remote sources and check their status
        for (let source of remoteSourcesToCheck) {
            const sqlCheckRemoteSource = `CALL public.CHECK_REMOTE_SOURCE('${source}');`; // Adjust if necessary

            try {
                // Execute the SQL procedure or query to check the remote source
                await connection.exec(sqlCheckRemoteSource);
                remoteSourceResults.push({ "Remote Source": source, "Status": "Working" });
            } catch (error) {
                remoteSourceResults.push({ "Remote Source": source, "Status": "Not Working" });
                errorResults.push({ "Remote Source": source, "Error": error.message });
            }
        }

        return { remoteSourceResults, errorResults };
    } catch (err) {
        throw new Error('Error while checking remote sources: ' + err.message);
    } finally {
        if (connection) {
            connection.disconnect();
        }
    }
}

module.exports.checkRemoteSources = async function (req, res) {
    try {
        const { credentials, remote_sources } = req.body;

        // Validate credentials and remote_sources
        if (!credentials || !credentials.host || !credentials.port || !credentials.userId || !credentials.password) {
            return res.status(400).json({ message: 'Missing required credentials' });
        }

        if (!remote_sources || !Array.isArray(remote_sources) || remote_sources.length === 0) {
            return res.status(400).json({ message: 'No remote sources provided' });
        }

        // Check the status of the provided remote sources
        const remoteSourcesStatus = await checkRemote(credentials, remote_sources);

        // Log the status in the console to check the response
        console.log('Remote Sources Status:', remoteSourcesStatus);

        // Send the response back to the client
        return res.status(200).json(remoteSourcesStatus);
    } catch (err) {
        console.error('Error in checkRemote:', err);
        res.status(500).json({ message: 'Error while checking remote sources', error: err.message });
    }
};