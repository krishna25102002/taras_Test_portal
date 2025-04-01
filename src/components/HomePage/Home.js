import React, { useState } from "react";
import { Button, Container, Row, Col, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/service";
import { FaGoogle } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import "./Home.css";
import axios from "axios";
import { sendOTP, resetPassword, registerUser } from "../../api/authService";

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetOtpField, setShowResetOtpField] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [rememberMe, setRememberMe] = useState(false); // Added Remember Me state
  const navigate = useNavigate();

  const handleLoginShow = () => setShowLoginModal(true);
  const handleLoginClose = () => setShowLoginModal(false);
  const handleSignupShow = () => setShowSignupModal(true);
  const handleSignupClose = () => {
    setShowSignupModal(false);
    setShowOtpField(false);
    setOtp("");
    setIsOtpVerified(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  };
  const handleForgotPasswordShow = () => {
    handleLoginClose();
    setShowForgotPasswordModal(true);
  };
  const handleForgotPasswordClose = () => {
    setShowForgotPasswordModal(false);
    setShowResetOtpField(false);
    setResetEmail("");
    setResetOtp("");
    setNewPassword("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      
      // Store user data based on remember me preference
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("rememberMe", "true");
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("rememberMe");
      }

      if (user.email === "admin@gmail.com" && password === "Admin@123") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
      handleLoginClose();
    } catch (error) {
      alert(error.message || "Failed to login");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const newUser = { email, password };
      console.log("Registering user:", newUser);
      await registerUser(newUser);
      console.log("User registered successfully");

      console.log("Sending OTP to:", email);
      await sendOTP(email);
      setShowOtpField(true);
      alert("OTP sent to your email!");
    } catch (error) {
      alert(error.message || "Error during signup");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userData = {
          name: response.data.name,
          email: response.data.email,
          googleId: response.data.sub,
          imageUrl: response.data.picture,
        };

        setGoogleUserData(userData);
        setEmail(userData.email);
        setName(userData.name);
        handleLoginClose();
        handleSignupShow();
      } catch (error) {
        alert("Google login failed. Please try again.");
        console.error("Google login error:", error);
      }
    },
    onError: (errorResponse) => {
      alert("Google login failed. Please try again.");
      console.error("Google login error:", errorResponse);
    },
  });

  const handleVerifyOTP = async () => {
    try {
      await axios.post("http://localhost:4000/api/auth/verify-otp", { email, otp });
      setIsOtpVerified(true);
      setShowOtpField(false);
      alert("Email verified successfully!");
      localStorage.setItem("user", JSON.stringify({ email }));
      navigate("/");
      handleSignupClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to verify OTP");
    }
  };

  const handleSendResetOtp = async () => {
    try {
      await sendOTP(resetEmail);
      setShowResetOtpField(true);
      alert("Reset OTP sent to your email!");
    } catch (error) {
      alert(error.message || "Failed to send OTP");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail || !resetOtp || !newPassword) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      console.log("Calling resetPassword with:", { resetEmail, resetOtp, newPassword });
      await resetPassword(resetEmail, resetOtp, newPassword);
      alert("Password reset successfully!");
      handleForgotPasswordClose();
    } catch (error) {
      alert(error.message || "Failed to reset password");
    }
  };

  return (
    <Container className="container text-center mt-5">
      <img src="/taras-logo-full.png" alt="Company Icon" className="icon" />
      <h1 className="display-3 mb-4 header">Welcome to the Test Portal</h1>
      <p className="lead mb-4 subHeader">
        Please login or sign up to continue:
      </p>

      <Row className="justify-content-center mt-4">
        <Col xs="auto">
          <Button
            variant="light"
            className="m-2 buttonLogin"
            onClick={handleLoginShow}
          >
            Login
          </Button>
          <Button
            variant="light"
            className="m-2 buttonSignup"
            onClick={handleSignupShow}
          >
            Signup
          </Button>
        </Col>
      </Row>

      {/* Login Modal */}
      <Modal
        show={showLoginModal}
        onHide={handleLoginClose}
        centered
        size="md"
        className="auth-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            <h2 className="modal-main-title">Log In to Your Account</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <div className="social-login-buttons">
            <Button
              onClick={() => googleLogin()}
              className="social-btn google-btn"
            >
              <FaGoogle className="social-icon" /> Continue with Google
            </Button>
          </div>

          <div className="divider">
            <span className="divider-text">or</span>
          </div>

          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-4">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Check 
                type="checkbox"
                label="Remember Me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="remember-me-checkbox"
              />
            </Form.Group>

            <Button type="submit" className="auth-submit-btn">
              Login
            </Button>
          </Form>
          <div className="text-center mt-4">
            <p className="auth-switch">
              New to Test Portal?{" "}
              <span
                className="auth-link"
                onClick={() => {
                  handleLoginClose();
                  handleSignupShow();
                }}
              >
                Sign Up
              </span>
            </p>
            <p className="auth-switch">
              Forgot Password?{" "}
              <span
                className="auth-link"
                onClick={handleForgotPasswordShow}
              >
                Reset Password
              </span>
            </p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Signup Modal */}
      <Modal
        show={showSignupModal}
        onHide={handleSignupClose}
        centered
        size="md"
        className="auth-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            <h2 className="modal-main-title">Sign Up for Free</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <div className="social-login-buttons">
            <Button
              onClick={() => googleLogin()}
              className="social-btn google-btn"
            >
              <FaGoogle className="social-icon" /> Continue with Google
            </Button>
          </div>

          <div className="divider">
            <span className="divider-text">or</span>
          </div>

          <Form onSubmit={handleSignupSubmit}>
            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                required
              />
            </Form.Group>

            {showOtpField && (
              <Form.Group className="mb-4">
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="auth-input"
                  required
                />
                <Button
                  onClick={handleVerifyOTP}
                  className="mt-2 auth-submit-btn"
                  disabled={!otp}
                >
                  Verify OTP
                </Button>
              </Form.Group>
            )}

            {!showOtpField && (
              <Button type="submit" className="auth-submit-btn">
                Sign Up
              </Button>
            )}
          </Form>
          <div className="text-center mt-4">
            <p className="auth-switch">
              Already have an account?{" "}
              <span
                className="auth-link"
                onClick={() => {
                  handleSignupClose();
                  handleLoginShow();
                }}
              >
                Log In
              </span>
            </p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        show={showForgotPasswordModal}
        onHide={handleForgotPasswordClose}
        centered
        size="md"
        className="auth-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            <h2 className="modal-main-title">Forgot Password</h2>
            <p className="modal-subtitle">
              Enter your email to reset your password.
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <Form onSubmit={handleForgotPasswordSubmit}>
            <Form.Group className="mb-4">
              <Form.Control
                type="email"
                placeholder="Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="auth-input"
                required
              />
            </Form.Group>

            {!showResetOtpField && (
              <Button
                onClick={handleSendResetOtp}
                className="auth-submit-btn"
                disabled={!resetEmail}
              >
                Send Reset OTP
              </Button>
            )}

            {showResetOtpField && (
              <>
                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="auth-input"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="auth-input"
                    required
                  />
                </Form.Group>
                <Button type="submit" className="auth-submit-btn">
                  Reset Password
                </Button>
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Home;