import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/slices/authSlice';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [validated, setValidated] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  
  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Clear previous errors when component mounts
    dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'confirmPassword' || name === 'password') {
      const otherField = name === 'password' ? 'confirmPassword' : 'password';
      setPasswordsMatch(value === formData[otherField] || value === '');
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false || !passwordsMatch) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registrationData } = formData;
    dispatch(register(registrationData));
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2>Create an Account</h2>
                <p className="text-muted">Join Property Management today</p>
              </div>
              
              {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
                  {error}
                </Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please choose a username
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        isInvalid={!passwordsMatch && validated}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        Passwords do not match
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="firstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="lastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4" controlId="phoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Creating Account...
                      </>
                    ) : "Register"}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account? <Link to="/login">Sign In</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
