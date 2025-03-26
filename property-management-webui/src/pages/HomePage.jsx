import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PropertySearchForm from '../components/search/PropertySearchForm';
import FeaturedProperties from '../components/property/FeaturedProperties';
import TestimonialSlider from '../components/home/TestimonialSlider';

const HomePage = () => {
  return (
    <>
      {/* Hero Section with Search */}
      <div className="hero-section py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">Find Your Perfect Property</h1>
              <p className="lead mb-4">
                Browse our selection of premium properties across the UK. Whether you're looking for 
                a holiday home, a city apartment, or a countryside retreat, we've got you covered.
              </p>
              <PropertySearchForm isHeroForm={true} />
            </Col>
            <Col lg={6}>
              <img 
                src="/images/hero-image.jpg" 
                alt="Beautiful property" 
                className="img-fluid rounded shadow-lg" 
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Properties Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Featured Properties</h2>
        <FeaturedProperties />
      </Container>

      {/* How It Works Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-search fs-4"></i>
                  </div>
                  <Card.Title>Search</Card.Title>
                  <Card.Text>
                    Browse our extensive catalog of properties and use filters to find your perfect match.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-calendar-check fs-4"></i>
                  </div>
                  <Card.Title>Book</Card.Title>
                  <Card.Text>
                    Select your dates, check availability, and make a reservation in just a few clicks.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-house-door fs-4"></i>
                  </div>
                  <Card.Title>Enjoy</Card.Title>
                  <Card.Text>
                    Arrive at your destination and enjoy a comfortable stay in your chosen property.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Testimonials Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">What Our Customers Say</h2>
        <TestimonialSlider />
      </Container>
    </>
  );
};

export default HomePage;
