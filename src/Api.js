// src/api.js

/**
 * Simulates an API call to change the password.
 * @param {string} currentPassword - The user's current password.
 * @param {string} newPassword - The desired new password.
 * @returns {Promise<object>} A promise that resolves on success or rejects on failure.
 */
export const changePasswordAPI = ({ currentPassword, newPassword }) => {
  console.log("API Call Started:", { currentPassword, newPassword });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate checking the current password. In a real app, the server does this.
      if (currentPassword === 'password123') {
        console.log("API Call Success: Password matches.");
        resolve({ success: true, message: 'Password updated successfully!' });
      } else {
        console.log("API Call Failed: Incorrect current password.");
        reject({ message: 'The current password you entered is incorrect.' });
      }
    }, 1500); // Simulate 1.5 seconds of network delay
  });
};