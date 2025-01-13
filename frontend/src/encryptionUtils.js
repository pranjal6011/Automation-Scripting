import CryptoJS from 'crypto-js';

const SECRET_KEY = 'hana-e2e-data-provisioning'; // Replace with a secure key fetched from the server or generated dynamically

// Encrypt data
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Decrypt data
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
