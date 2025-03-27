import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Card, Badge, Tabs, Tab, Modal } from 'react-bootstrap';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyDetails } from '../redux/slices/propertySlice';
import { checkAvailability } from '../redux/slices/bookingSlice';
import PropertyReservationForm from '../components/booking/PropertyReservationForm';
import PropertyMap from '../components/property/PropertyMap';
import PropertyReviews from '../components/property/PropertyReviews';
import PropertyImageGallery from '../components/property/PropertyImageGallery';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaUserFriends } from 'react-icons/fa';
import LoginPromptModal from '../components/auth/LoginPromptModal';

const PropertyDetailsPage = () => {
  const { propertyId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { property, loading, error } = useSelector(state => state.properties.details);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Get dates from URL params if available
  const checkInDate = searchParams.get('checkInDate') 
    ? new Date(searchParams.get('checkInDate')) 
    : null;
  const checkOutDate = searchParams.get('checkOutDate') 
    ? new Date(searchParams.get('checkOutDate')) 
    : null;
  const guests = searchParams.get('guests') || 1;

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchPropertyDetails(propertyId));
    }
  }, [dispatch, propertyId]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate(`/book/${propertyId}?checkInDate=${searchParams.get('checkInDate') || ''}&checkOutDate=${searchParams.get('checkOutDate') || ''}&guests=${guests}`);
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          Property not found. It may have been removed or is no longer available.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container className="my-4">
        {/* Property Title Section */}
        <div className="mb-4">
          <h1 className="mb-2">{property.title}</h1>
          <div className="d-flex align-items-center mb-3">
            <FaMapMarkerAlt className="text-primary me-2" />
            <span>
              {property.address?.street}, {property.address?.city}, {property.address?.country}
            </span>
            
            {property.status === 'Available' ? (
              <Badge bg="success" className="ms-3">Available</Badge>
            ) : (
              <Badge bg="secondary" className="ms-3">{property.status}</Badge>
            )}
          </div>
        </div>
        
        <Row>
          {/* Property Images and Details */}
          <Col lg={8} className="mb-4">
            {/* Image Gallery */}
            <PropertyImageGallery 
              images={property.imageUrls || []} 
              title={property.title} 
            />
            
            {/* Property Features */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Row className="text-center">
                  {property.bedrooms && (
                    <Col xs={6} md={3} className="mb-3 mb-md-0">
                      <div className="d-flex flex-column align-items-center">
                        <FaBed className="text-primary mb-2" size={24} />
                        <div className="fw-bold">{property.bedrooms}</div>
                        <div className="text-muted small">{property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</div>
                      </div>
                    </Col>
                  )}
                  
                  {property.bathrooms && (
                    <Col xs={6} md={3} className="mb-3 mb-md-0">
                      <div className="d-flex flex-column align-items-center">
                        <FaBath className="text-primary mb-2" size={24} />
                        <div className="fw-bold">{property.bathrooms}</div>
                        <div className="text-muted small">{property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</div>
                      </div>
                    </Col>
                  )}
                  
                  {property.area && (
                    <Col xs={6} md={3}>
                      <div className="d-flex flex-column align-items-center">
                        <FaRulerCombined className="text-primary mb-2" size={24} />
                        <div className="fw-bold">{property.area}</div>
                        <div className="text-muted small">Square Meters</div>
                      </div>
                    </Col>
                  )}
                  
                  <Col xs={6} md={3}>
                    <div className="d-flex flex-column align-items-center">
                      <FaUserFriends className="text-primary mb-2" size={24} />
                      <div className="fw-bold">{property.maxGuests || 'N/A'}</div>
                      <div className="text-muted small">Max Guests</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            {/* Tabs for Details, Amenities, Location, Reviews */}
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              <Tab eventKey="description" title="Description">
                <div className="p-3">
                  <h4 className="mb-3">About this property</h4>
                  <p>{property.description}</p>
                </div>
              </Tab>
              
              <Tab eventKey="amenities" title="Amenities">
                <div className="p-3">
                  <h4 className="mb-3">What this place offers</h4>
                  {property.amenities && property.amenities.length > 0 ? (
                    <Row>
                      {property.amenities.map((amenity, index) => (
                        <Col key={index} xs={6} md={4} className="mb-2">
                          <div className="d-flex align-items-center">
                            <span className="me-2">✓</span>
                            <span>{amenity}</span>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p>No amenities specified for this property.</p>
                  )}
                </div>
              </Tab>
              
              <Tab eventKey="location" title="Location">
                <div className="p-3">
                  <h4 className="mb-3">Location</h4>
                  <p>
                    <strong>Address:</strong> {property.address?.street}, {property.address?.city}, 
                    {property.address?.state} {property.address?.postalCode}, {property.address?.country}
                  </p>
                  
                  {/* Map Component */}
                  {property.address?.latitude && property.address?.longitude && (
                    <div style={{ height: '400px', width: '100%' }}>
                      <PropertyMap 
                        latitude={property.address.latitude} 
                        longitude={property.address.longitude}
                        title={property.title}
                      />
                    </div>
                  )}
                </div>
              </Tab>
              
              <Tab eventKey="reviews" title="Reviews">
                <div className="p-3">
                  <PropertyReviews propertyId={propertyId} />
                </div>
              </Tab>
            </Tabs>
          </Col>
          
          {/* Booking Card */}
          <Col lg={4}>
            <Card className="shadow booking-card sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span className="fs-3 fw-bold">£{property.pricePerDay}</span>
                    <span className="text-muted"> / night</span>
                  </div>
                </div>
                
                {/* Reservation Form */}
                <PropertyReservationForm 
                  propertyId={propertyId}
                  initialCheckInDate={checkInDate}
                  initialCheckOutDate={checkOutDate}
                  initialGuests={guests}
                  price={property.pricePerDay}
                  maxGuests={property.maxGuests}
                  onBookNow={handleBookNow}
                  isAuthenticated={isAuthenticated}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Login Prompt Modal */}
      <LoginPromptModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)} 
        returnUrl={`/book/${propertyId}?checkInDate=${searchParams.get('checkInDate') || ''}&checkOutDate=${searchParams.get('checkOutDate') || ''}&guests=${guests}`}
      />
    </>
  );
};

export default PropertyDetailsPage;