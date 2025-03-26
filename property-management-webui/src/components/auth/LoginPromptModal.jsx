import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginPromptModal = ({ show, onHide, returnUrl }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigate to login page with return URL
    navigate(`/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`);
    onHide();
  };

  const handleRegister = () => {
    // Navigate to register page with return URL
    navigate(`/register${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You need to be logged in to perform this action.</p>
        <p>Please login or create an account to continue.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="outline-primary" onClick={handleRegister}>
          Register
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginPromptModal;