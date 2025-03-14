import axios from "axios";

export const sendOTP = async (email) => {
  try {
    const response = await axios.post("/api/auth/send-otp", { email });
    return response.data;
  } catch (error) {
    throw new Error("Failed to send OTP");
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await axios.post("/api/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    throw new Error("Invalid OTP");
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
