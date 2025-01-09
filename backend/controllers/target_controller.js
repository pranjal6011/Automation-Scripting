const { exec } = require('child_process');
const connection = require('../config/connectionPRIMARY');
const { performance } = require('perf_hooks');
const env= require('../config/environment');

const SOURCEschemaName = env.SECONDARY_SCHEMA;
const TARGETschemaName = env.PRIMARY_SCHEMA;
const SOURCEtableName = env.SECONDARY_TABLE;
const TARGETtableName = env.PRIMARY_TABLE;
const remoteSource = env.REMOTE_SOURCE_NAME; // Remote SOURCE name

// Function to check if a schema exists
async function checkSchemaExists(schemaName) {
    const sqlCheckSchema = `SELECT SCHEMA_NAME FROM SYS.SCHEMAS WHERE SCHEMA_NAME = '${schemaName}';`;
    const schemaResult = await connection.exec(sqlCheckSchema);
    return schemaResult.length > 0;
}

// Function to create a schema
async function createSchema(schemaName) {
    const sqlCreateSchema = `CREATE SCHEMA "${schemaName}";`;
    await connection.exec(sqlCreateSchema);
    console.log(`Schema ${schemaName} created successfully.`);
}

// Function to drop a virtual table
async function dropVirtualTable(schemaName, tableName) {
    const sqlDropVirtualTable = `DROP TABLE "${schemaName}"."${tableName}";`;
    try {
        await connection.exec(sqlDropVirtualTable);
        console.log(`Virtual table ${schemaName}.${tableName} dropped successfully.`);
    } catch (error) {
        if (error.code === 259) { // Error code for "table not found"
            console.log(`Virtual table ${schemaName}.${tableName} does not exist.`);
        } else {
            throw error; // Re-throw unexpected errors
        }
    }
}

// Function to create a virtual table
async function createVirtualTable(schemaName, tableName, remoteSource, sourceSchema, sourceTable) {
    const sqlCreateVirtualTable = `CREATE VIRTUAL TABLE "${schemaName}"."${tableName}"
        AT "${remoteSource}"."<NULL>"."${sourceSchema}"."${sourceTable}";`;
    await connection.exec(sqlCreateVirtualTable);
    console.log(`Virtual table ${schemaName}.${tableName} created successfully.`);
}

// Function to get the row count of a virtual table
async function fetchRowCount(schemaName, tableName) {
    const sqlCountRows = `SELECT COUNT(*) FROM "${schemaName}"."${tableName}";`;
    const countResult = await connection.exec(sqlCountRows);
    return countResult[0]['COUNT(*)'];
}

// API Implementation
module.exports.virtualTableCreation = async function(req, res) {
    const t0 = performance.now();
    let response = [];

    try {
        // Step 1: Check if the target schema exists
        console.log("\nChecking if schema exists...");
        const schemaExists = await checkSchemaExists(TARGETschemaName);
        if (!schemaExists) {
            console.log(`Schema ${TARGETschemaName} does not exist. Creating schema...`);
            await createSchema(TARGETschemaName);
            response.push(`Schema ${TARGETschemaName} created successfully.`);
        } else {
            console.log(`Schema ${TARGETschemaName} already exists.`);
            response.push(`Schema ${TARGETschemaName} already exists.`);
        }

        // Step 2: Drop the virtual table if it exists
        console.log("\nDropping virtual table (if it exists)...");
        await dropVirtualTable(TARGETschemaName, TARGETtableName);
        response.push("Existing virtual table dropped (If Exists).");

        // Step 3: Create the virtual table
        console.log("\nCreating virtual table...");
        await createVirtualTable(TARGETschemaName, TARGETtableName, remoteSource, SOURCEschemaName, SOURCEtableName);
        response.push(`Virtual table '${TARGETtableName}' created successfully.`);

        // Step 4: Fetch row count from the virtual table
        console.log("\nFetching row count from the virtual table...");
        const rowCount = await fetchRowCount(TARGETschemaName, TARGETtableName);
        console.log(`Total row count in the virtual table: ${rowCount}`);
        response.push(`Row count in virtual table '${TARGETtableName}': ${rowCount}`);

        const t1 = performance.now();
        console.log("\nTotal time taken: " + (t1 - t0).toFixed(2) + " ms\n");

        const executionTime= (t1 - t0).toFixed(2) + " ms";
        response.push(`Execution Time: ${executionTime}`);
        // Return the response to the client
        return res.status(200).json({
            message: "Virtual table created successfully in Primary Tenant.",
            details: response
        });
    } catch (err) {
        console.error("Error during execution:", err);
        res.status(500).json({ message: 'Error during virtual table operations', error: err.message });
    }
};
