import axios from "axios";
const BASE_URL = "http://localhost:4000";

export const registerUser = async (user) => {
  try {
    console.log("Calling /register with:", user);
    const response = await axios.post(`${BASE_URL}/api/auth/register`, user);
    console.log("Register response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to register user");
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log("Calling /login with:", { email, password });
    const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to login");
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    console.log("Sending reset password request:", { email, otp, newPassword });
    const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
      email,
      otp,
      newPassword,
    });
    console.log("Reset password response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to reset password");
  }
};

export const sendOTP = async (email) => {
  try {
    console.log("Calling /send-otp with:", { email });
    const response = await axios.post(`${BASE_URL}/api/auth/send-otp`, { email });
    console.log("Send OTP response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to send OTP");
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    console.log("Calling /verify-otp with:", { email, otp });
    const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp });
    console.log("Verify OTP response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Invalid OTP");
  }
};

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