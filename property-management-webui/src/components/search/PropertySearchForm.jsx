import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PropertySearchForm = ({ isHeroForm = false }) => {
  const navigate = useNavigate();
  
  const [location, setLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [bedrooms, setBedrooms] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (location) params.append('city', location);
    if (checkInDate) params.append('checkInDate', checkInDate.toISOString().split('T')[0]);
    if (checkOutDate) params.append('checkOutDate', checkOutDate.toISOString().split('T')[0]);
    if (guests > 1) params.append('guests', guests);
    if (bedrooms) params.append('bedrooms', bedrooms);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (propertyType) params.append('type', propertyType);
    
    // Navigate to search results page with query params
    navigate(`/properties?${params.toString()}`);
  };

  // Simple form for hero section
  if (isHeroForm) {
    return (
      <Card className="shadow">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Where</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City or location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Check-in</Form.Label>
                  <DatePicker
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    selectsStart
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Check-out</Form.Label>
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    selectsEnd
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    minDate={checkInDate || new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Guests</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg">
                    Search Properties
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  // Advanced form for search page
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6} lg={3}>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City or location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} lg={2}>
              <Form.Group>
                <Form.Label>Check-in</Form.Label>
                <DatePicker
                  selected={checkInDate}
                  onChange={(date) => setCheckInDate(date)}
                  selectsStart
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select date"
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6} lg={2}>
              <Form.Group>
                <Form.Label>Check-out</Form.Label>
                <DatePicker
                  selected={checkOutDate}
                  onChange={(date) => setCheckOutDate(date)}
                  selectsEnd
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  minDate={checkInDate || new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select date"
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6} lg={1}>
              <Form.Group>
                <Form.Label>Guests</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                />
              </Form.Group>
            </Col>
            <Col md={6} lg={1}>
              <Form.Group>
                <Form.Label>Bedrooms</Form.Label>
                <Form.Control
                  as="select"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6} lg={3}>
              <Row>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>Min Price</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="10"
                      placeholder="Min £"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>Max Price</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="10"
                      placeholder="Max £"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md={6} lg={3}>
              <Form.Group>
                <Form.Label>Property Type</Form.Label>
                <Form.Control
                  as="select"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">Any Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Cottage">Cottage</option>
                  <option value="Condo">Condo</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col xs={12} lg={2}>
              <Form.Label className="d-lg-block d-none">&nbsp;</Form.Label>
              <div className="d-grid">
                <Button type="submit" variant="primary">
                  Search
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PropertySearchForm;