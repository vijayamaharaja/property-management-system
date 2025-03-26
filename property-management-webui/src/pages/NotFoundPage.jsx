import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="display-1 fw-bold text-primary">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          
          <p className="lead mb-4">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Button as={Link} to="/" variant="primary" size="lg">
              Go to Homepage
            </Button>
            <Button as={Link} to="/properties" variant="outline-primary" size="lg">
              Browse Properties
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;

