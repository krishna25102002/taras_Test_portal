import React, { useState } from 'react';
import { Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../api/service';
import './Home.css';  // Import the external CSS file

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      localStorage.setItem('user', JSON.stringify(user));

      if (user.email === 'admin@gmail.com' && password === 'Admin@123') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (error) {
      alert(error.message);
    }
    handleLoginClose();
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const newUser = { name, email, password };
      await registerUser(newUser);

      // Save user details to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));

      alert('User registered successfully!');
      handleSignupClose();
    } catch (error) {
      alert('Error registering user');
    }
  };

  return (
    <Container className="container text-center mt-5">
      <img src="/taras-logo-full.png" alt="Company Icon" className="icon" />
      <h1 className="display-3 mb-4 header">Welcome to the Test Portal</h1>
      <p className="lead mb-4 subHeader">Please login or sign up to continue:</p>

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
      <Modal show={showLoginModal} onHide={handleLoginClose} centered className="modal">
        <Modal.Header closeButton className="modalHeader">
          <Modal.Title className="modalTitle">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group controlId="formLoginEmail">
              <Form.Label className="formLabel">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="formControl"
              />
            </Form.Group>
            <Form.Group controlId="formLoginPassword" className="mt-3">
              <Form.Label className="formLabel">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="formControl"
              />
            </Form.Group>
            <Button variant="warning" type="submit" className="mt-3 submitButton">
              Login
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={handleSignupClose} centered className="modal">
        <Modal.Header closeButton className="modalHeader">
          <Modal.Title className="modalTitle">Signup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSignupSubmit}>
            <Form.Group controlId="formSignupName">
              <Form.Label className="formLabel">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="formControl"
              />
            </Form.Group>
            <Form.Group controlId="formSignupEmail" className="mt-3">
              <Form.Label className="formLabel">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="formControl"
              />
            </Form.Group>
            <Form.Group controlId="formSignupPassword" className="mt-3">
              <Form.Label className="formLabel">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="formControl"
              />
            </Form.Group>
            <Form.Group controlId="formSignupConfirmPassword" className="mt-3">
              <Form.Label className="formLabel">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="formControl"
              />
            </Form.Group>
            <Button variant="warning" type="submit" className="mt-3 submitButton">
              Signup
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Home;
