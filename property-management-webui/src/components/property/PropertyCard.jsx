import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBed, FaBath, FaRulerCombined, FaStar } from 'react-icons/fa';

const PropertyCard = ({ property, checkInDate, checkOutDate, guests }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const handleBookNow = () => {
    if (!isAuthenticated) {
      // If user is not logged in, show login prompt modal or redirect to login with return URL
      if (window.confirm('You need to login or register to book this property. Would you like to login now?')) {
        const returnUrl = `/book/${property.id}?checkInDate=${checkInDate || ''}&checkOutDate=${checkOutDate || ''}&guests=${guests || 1}`;
        navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      }
    } else {
      // If user is logged in, navigate to booking page
      navigate(`/book/${property.id}?checkInDate=${checkInDate || ''}&checkOutDate=${checkOutDate || ''}&guests=${guests || 1}`);
    }
  };

  return (
    <Card className="h-100 shadow-sm hover-shadow">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={property.imageUrls[0] || '/images/property-placeholder.jpg'} 
          alt={property.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <Badge 
          bg="primary" 
          className="position-absolute top-0 end-0 m-2"
        >
          {property.type}
        </Badge>
        {property.rating && (
          <div className="position-absolute bottom-0 start-0 m-2 bg-dark text-white px-2 py-1 rounded-pill">
            <FaStar className="text-warning me-1" />
            <span>{property.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="mb-1">{property.title}</Card.Title>
          <div className="ms-2 fs-5 fw-bold text-primary">£{property.price}</div>
        </div>
        <Card.Text className="text-muted small mb-2">
          {property.address.city}, {property.address.country}
        </Card.Text>
        
        <Row className="gx-2 mb-3 text-muted small">
          {property.bedrooms && (
            <Col>
              <FaBed className="me-1" />
              {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
            </Col>
          )}
          {property.bathrooms && (
            <Col>
              <FaBath className="me-1" />
              {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
            </Col>
          )}
          {property.area && (
            <Col>
              <FaRulerCombined className="me-1" />
              {property.area} m²
            </Col>
          )}
        </Row>
        
        <Card.Text className="mb-3 flex-grow-1">
          {property.description
            ? property.description.length > 100
              ? `${property.description.substring(0, 100)}...`
              : property.description
            : 'No description available.'
          }
        </Card.Text>
        
        <div className="d-flex mt-auto">
          <Button 
            as={Link} 
            to={`/properties/public/${property.id}`} 
            variant="outline-primary" 
            className="me-2 flex-grow-1"
          >
            View Details
          </Button>
          <Button 
            variant="primary" 
            className="flex-grow-1"
            onClick={handleBookNow}
            disabled={property.status !== 'Available'}
          >
            Book Now
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;