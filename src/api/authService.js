// import axios from "axios";
// const BASE_URL = "http://localhost:4000"; // Ensure this matches your backend

// // Send OTP
// export const sendOTP = async (email) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/api/auth/send-otp`, { email });
//     return response.data;
//   } catch (error) {
//     console.error("Error sending OTP:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || "Failed to send OTP");
//   }
// };

// // Verify OTP
// export const verifyOTP = async (email, otp) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { email, otp });
//     return response.data;
//   } catch (error) {
//     console.error("Error verifying OTP:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || "Invalid OTP");
//   }
// }; 

// // Reset Password
// export const resetPassword = async (email, otp, newPassword) => {
//   try {
//     console.log("Reset Password Request:", { email, otp, newPassword }); // Add logging

//     const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
//       email,
//       resetToken: otp, // Ensure this matches the backend's expected field name
//       newPassword,
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error resetting password:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || "Failed to reset password");
//   }
// };

// export const registerUser = async (user) => {
//   try {
//     // Check if email already exists
//     const emailCheckResponse = await fetch(
//       `${BASE_URL}/users?email=${user.email}`
//     );
//     const existingUsers = await emailCheckResponse.json();

//     if (existingUsers.length > 0) {
//       throw new Error("Email already in use. Please choose a different email.");
//     }

//     // Encrypt the password before storing
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);

//     // Register the new user
//     const response = await fetch(`${BASE_URL}/users`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(user),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to register user");
//     }

//     return response.json();
//   } catch (error) {
//     console.error("Error registering user:", error);
//     throw error;
//   }
// };



import axios from "axios";
const BASE_URL = "http://localhost:4000"; // Backend URL

// Register User
export const registerUser = async (user) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, user);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to register user");
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to login");
  }
};

// Reset Password
export const resetPassword = async (email, resetToken, newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
      email,
      resetToken,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to reset password");
  }
};

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