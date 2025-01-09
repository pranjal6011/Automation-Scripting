const connection = require('../config/connectionSECONDARY');
const { performance } = require('perf_hooks');
const env= require('../config/environment');

const schemaName = env.SECONDARY_SCHEMA;
const tableName = env.SECONDARY_TABLE;
const procedureName =env.PROCEDURE_NAME;  // Procedure name
// SQL Queries
const sqlCheckSchema = `SELECT SCHEMA_NAME FROM SYS.SCHEMAS WHERE SCHEMA_NAME = '${schemaName}';`;
const sqlCreateSchema = `CREATE SCHEMA ${schemaName};`;
const sqlCheckTable = `SELECT * FROM M_TABLES WHERE TABLE_NAME = '${tableName}' AND SCHEMA_NAME = '${schemaName}';`;
const sqlDropTable = `DROP TABLE ${schemaName}.${tableName};`;
const sqlCreateTable = `CREATE COLUMN TABLE ${schemaName}.${tableName} (
    ID INT PRIMARY KEY,                    
    FirstName NVARCHAR(100),                   
    LastName NVARCHAR(100),                   
    FullName AS (FirstName || ' ' || LastName),
    Description NCLOB,                    
    CreatedAt TIMESTAMP,                    
    UpdatedAt DATE,                        
    Price DECIMAL(15, 2),                   
    IsActive BOOLEAN,                       
    Rating DOUBLE,                         
    Attachment BLOB,                       
    JSONData NCLOB,                        
    EmailAddress NVARCHAR(255),           
    Quantity BIGINT,                       
    Percentage FLOAT,                    
    IPAddress NVARCHAR(45),               
    Coordinates ST_GEOMETRY,              
    UUID VARCHAR(36),                    
    Preferences NCLOB,                    
    ValidUntil TIME,                       
    TransactionID INT,  
    PriceWithTax AS (Price * 1.18),
    InternalNotes NCLOB HIDDEN,
    CreatedBy NVARCHAR(255) HIDDEN 
);`;
const sqlCheckProcedure = `SELECT * FROM SYS.PROCEDURES WHERE PROCEDURE_NAME = '${procedureName}' AND SCHEMA_NAME = '${schemaName}';`;
const sqlCreateProcedure = `CREATE OR REPLACE PROCEDURE ${schemaName}.${procedureName}() 
    LANGUAGE SQLSCRIPT AS
    BEGIN
        DECLARE i INT DEFAULT 1;
        WHILE i <= 100000 DO
            INSERT INTO ${schemaName}.${tableName} (ID, FirstName, LastName, Description, CreatedAt, UpdatedAt, Price, IsActive, Rating, 
            Attachment, JSONData, EmailAddress, Quantity, Percentage, IPAddress, Coordinates, UUID, Preferences, ValidUntil, TransactionID, InternalNotes, CreatedBy)
            VALUES (:i, 'FirstName ' || :i, 'LastName ' || :i, 'Description ' || :i, CURRENT_TIMESTAMP, CURRENT_DATE, ROUND(RAND() * 1000, 2), TRUE, ROUND(RAND() * 5, 1),
            CAST('{"file_content": "random_data_' || :i || '"}' AS BLOB), 
            CAST('{"id": ' || :i || ', "name": "Sample Name ' || :i || '", "description": "Sample Description ' || :i || '"}' AS NCLOB),
            'email' || :i || '@example.com', ROUND(RAND() * 1000, 0), ROUND(RAND() * 100, 2),
            '192.168.1.' || :i, NEW ST_POINT(ROUND(RAND() * 180 - 90, 6), ROUND(RAND() * 360 - 180, 6)),
            CAST(ROUND(RAND() * 1000000000, 0) AS VARCHAR(36)),
            CAST('{"preferences_key": "sample_value_' || :i || '"}' AS NCLOB), CURRENT_TIME, :i,
            'Internal notes for record ' || :i, 'CreatedByUser ' || :i);
            i := i + 1;
        END WHILE;
    END;
`;

// Function to execute SQL query and log result
async function execSQL(query, description) {
    console.log(`${description}...`);
    const result = await connection.exec(query);
    return result;
}

// Function to check if schema exists
async function checkSchemaExists() {
    const result = await execSQL(sqlCheckSchema, "Checking if schema exists");
    return result.length > 0;
}

// Function to create schema
async function createSchema() {
    await execSQL(sqlCreateSchema, "Creating schema.....");
    console.log("Schema created successfully.\n");
}

// Function to check if table exists
async function checkTableExists() {
    const result = await execSQL(sqlCheckTable, "Checking if table exists");
    return result.length > 0;
}

// Function to drop the table
async function dropTable() {
    await execSQL(sqlDropTable, "Dropping table.....");
    console.log("Table dropped successfully.\n");
}

// Function to create table
async function createTable() {
    await execSQL(sqlCreateTable, "Creating table.....");
    console.log("Table created successfully.\n");
}

// Function to check if procedure exists
async function checkProcedureExists() {
    const result = await execSQL(sqlCheckProcedure, "Checking if procedure exists");
    return result.length > 0;
}

// Function to create procedure
async function createProcedure() {
    await execSQL(sqlCreateProcedure, "Creating or replacing procedure...");
    console.log("Procedure created successfully.\n");
}

// Function to execute the data insertion procedure
async function executeProcedure() {
    await execSQL(`CALL ${schemaName}.${procedureName}();`, "Executing procedure...");
    console.log("Procedure executed successfully to insert data.\n");
}

// Function to get row count from table
async function getRowCount() {
    const sqlCheckData = `SELECT COUNT(*) FROM ${schemaName}.${tableName};`;
    const result = await execSQL(sqlCheckData, "Checking row count");
    return result[0]["COUNT(*)"];
}

// API Implementation
module.exports.sourceCreation = async function(req, res) {
    const t0 = performance.now();
    try {
        let response = [];

        // Step 1: Check schema existence and create it if necessary
        const schemaExists = await checkSchemaExists();
        if (!schemaExists) {
            response.push(`Schema with name '${schemaName}' does not exist. Creating schema...`);
            await createSchema();
        } else {
            response.push(`Schema with name '${schemaName}' exists.`);
        }

        // Step 2: Check table existence, drop it if necessary and create it
        const tableExists = await checkTableExists();
        if (tableExists) {
            response.push(`Table with name '${tableName}' exists. Dropping table...`);
            await dropTable();  // Drop table if it exists
        }
        response.push(`Creating table '${tableName}'...`);
        await createTable();  // Create table

        // Step 3: Check and drop procedure if it exists, then create or replace it
        const procedureExists = await checkProcedureExists();
        if (procedureExists) {
            response.push(`Procedure with name '${procedureName}' exists. Dropping existing procedure...`);
            await execSQL(`DROP PROCEDURE ${schemaName}.${procedureName};`, "Dropping existing procedure...");
        }
        response.push(`Creating procedure '${procedureName}'...`);
        await createProcedure();  // Create or replace procedure
        
        // Step 4: Execute procedure to insert data
        response.push(`Calling the procedure '${procedureName}'...`);
        await executeProcedure();

        // Step 5: Get row count
        const rowCount = await getRowCount();
        response.push(`Row count in table '${tableName}': ${rowCount}`);
        const t1 = performance.now();
        const executionTime= (t1 - t0).toFixed(2) + " ms";
        response.push(`Execution Time: ${executionTime}`);
        return res.status(200).json({
            message: "Schema, table, and procedure creation completed successfully in Secondary Tenant.",
            details: response,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error during operation', error: err });
    }
};
