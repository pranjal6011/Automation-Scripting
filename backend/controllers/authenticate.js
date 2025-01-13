const hana = require('@sap/hana-client');

// Function to authenticate credentials
async function authenticateCredentials(credentials) {
    const { host, port, userId, password } = credentials;
    const serverNode = `${host}:${port}`;
    const connOptions = {
        serverNode: serverNode,
        UID: userId,
        PWD: password,
        sslValidateCertificate: 'false',
    };

    const connection = hana.createConnection();
    try {
        // Try to connect using the provided credentials
        await connection.connect(connOptions);
        connection.disconnect();
        return { success: true };  // Authentication success
    } catch (error) {
        console.error('Error during connection:', error.message);
        return { success: false, message: 'Invalid credentials or connection error' };  // Authentication failed
    }
}

// Create the validate function
module.exports.validate = async function (req, res) {
    const { host, port, userId, password } = req.body;

    // Validate if all credentials are provided
    if (!host || !port || !userId || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        // Authenticate the credentials
        const result = await authenticateCredentials({ host, port, userId, password });

        if (result.success) {
            res.status(200).json({ success: true });  // Send success response
        } else {
            res.status(401).json({ success: false, message: result.message });  // Send error response
        }
    } catch (error) {
        console.error('Error validating credentials:', error.message);
        res.status(500).json({ success: false, message: 'Failed to validate credentials. Please try again later.' });
    }
};
