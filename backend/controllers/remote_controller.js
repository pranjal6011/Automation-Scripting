const express = require('express');
const router = express.Router();
const connection = require('../config/connectionPRIMARY');

async function checkRemoteSources() {
    const remoteSourcesToCheck = [
        "FED_SDA_ATHENA", "FED_SDA_BIGQUERY", "FED_SDA_HC", "FED_SDA_CC_HANA",
        "FED_SDA_HCQRC", "FED_SDI_HANA", "FED_SDI_MSAzureSQL"
    ];
    
    let remoteSourceResults = [];
    let errorResults = [];
    
    for (let source of remoteSourcesToCheck) {
        const sqlCheckRemoteSource = `CALL public.CHECK_REMOTE_SOURCE('${source}');`;
        try {
            await connection.exec(sqlCheckRemoteSource);
            remoteSourceResults.push({ "Remote Source": source, "Status": "Working" });
        } catch (error) {
            remoteSourceResults.push({ "Remote Source": source, "Status": "Not Working" });
            errorResults.push({ "Remote Source": source, "Error": error.message });
        }
    }
    
    return { remoteSourceResults, errorResults };
}
module.exports.checkRemote= async function(req,res){
    try {
        const remoteSourcesStatus = await checkRemoteSources();
        return res.status(200).json(remoteSourcesStatus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error checking remote sources', error: err.message });
    }
};
