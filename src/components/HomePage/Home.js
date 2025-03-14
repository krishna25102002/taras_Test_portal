import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../../api/service";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import "./Home.css";
import axios from "axios"; // Import axios

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleLoginShow = () => setShowLoginModal(true);
  const handleLoginClose = () => setShowLoginModal(false);

  const handleSignupShow = () => setShowSignupModal(true);
  const handleSignupClose = () => setShowSignupModal(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);

      // Save user details to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      if (user.email === "admin@gmail.com" && password === "Admin@123") {
        navigate("/admin");
      } else {
        navigate("/signup");
      }
    } catch (error) {
      alert(error.message);
    }
    handleLoginClose();
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      alert("Please verify your email first!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const newUser = { name, email, password };
      await registerUser(newUser);

      // Save user details to localStorage
      localStorage.setItem("user", JSON.stringify(newUser));

      alert("User registered successfully!");
      handleSignupClose();
    } catch (error) {
      alert("Error registering user");
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

        const user = {
          name: response.data.name,
          email: response.data.email,
          googleId: response.data.sub,
          imageUrl: response.data.picture,
        };

        localStorage.setItem("user", JSON.stringify(user));

        if (user.email === "admin@gmail.com") {
          navigate("/admin");
        } else {
          navigate("/student");
        }
        handleLoginClose();
        handleSignupClose();
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

  const handleFacebookLogin = () => {
    // Implement your Facebook login logic here
    console.log("Facebook login clicked");
  };

  const handleSendOTP = async () => {
    try {
      await sendOTP(email);
      setShowOtpField(true);
      alert("OTP sent to your email!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(email, otp);
      setIsOtpVerified(true);
      alert("Email verified successfully!");
    } catch (error) {
      alert(error.message);
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
            <p className="modal-subtitle">
              Learn on your own time from top universities and businesses.
            </p>
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
            <Button
              onClick={handleFacebookLogin}
              className="social-btn facebook-btn"
            >
              <FaFacebook className="social-icon" /> Continue with Facebook
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
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
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
            <p className="modal-subtitle">Join our learning community today!</p>
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
            <Button
              onClick={handleFacebookLogin}
              className="social-btn facebook-btn"
            >
              <FaFacebook className="social-icon" /> Continue with Facebook
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
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
              {!showOtpField && (
                <Button
                  onClick={handleSendOTP}
                  className="mt-2 verify-btn"
                  disabled={!email}
                >
                  Send OTP
                </Button>
              )}
            </Form.Group>

            {showOtpField && (
              <Form.Group className="mb-4">
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="auth-input"
                />
                <Button
                  onClick={handleVerifyOTP}
                  className="mt-2 verify-btn"
                  disabled={!otp}
                >
                  Verify OTP
                </Button>
              </Form.Group>
            )}

            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
              />
            </Form.Group>
            <Button type="submit" className="auth-submit-btn">
              Sign Up
            </Button>
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
    </Container>
  );
};

export default Home;
