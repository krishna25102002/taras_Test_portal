import axios from "axios";
const BASE_URL = "http://localhost:4000"; // Ensure this matches your backend

// Send OTP
export const sendOTP = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/send-otp`, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to send OTP");
  }
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Invalid OTP");
  }
};

// Reset Password
export const resetPassword = async (email, otp, newPassword) => {
  try {
    console.log("Reset Password Request:", { email, otp, newPassword }); // Add logging

    const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
      email,
      resetToken: otp, // Ensure this matches the backend's expected field name
      newPassword,
    });

    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to reset password");
  }
};
// export const resetPassword = async (email, otp, newPassword) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
//       email,
//       otp,
//       newPassword,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error resetting password:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || "Failed to reset password");
//   }
// };

// Initialize Google Auth
export const initializeGoogleAuth = () => {
  return new Promise((resolve) => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2
        .init({
          client_id:
            "448430774246-9bu60as3s9fcjapbabln7fsfs4nuc43k.apps.googleusercontent.com",
        })
        .then(resolve);
    });
  });
};