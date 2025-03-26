import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaPoundSign } from 'react-icons/fa';
import { cancelReservation } from '../../redux/slices/reservationSlice';

const ReservationCard = ({ reservation }) => {
  const dispatch = useDispatch();
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const checkInDate = new Date(reservation.checkInDate);
  const checkOutDate = new Date(reservation.checkOutDate);
  
  // Determine if the reservation is cancellable (only PENDING or CONFIRMED status)
  const isCancellable = ['PENDING', 'CONFIRMED'].includes(reservation.status);
  
  // Determine status color
  const getStatusBadgeVariant = () => {
    switch (reservation.status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'danger';
      case 'COMPLETED': return 'info';
      default: return 'secondary';
    }
  };
  
  const handleCancelReservation = () => {
    dispatch(cancelReservation(reservation.id))
      .unwrap()
      .then(() => {
        alert('Reservation cancelled successfully');
        setShowCancelModal(false);
      })
      .catch(error => {
        alert(`Failed to cancel reservation: ${error.message || 'Unknown error'}`);
      });
  };

  return (
    <>
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Row>
            {/* Property Image */}
            <Col md={3} className="mb-3 mb-md-0">
              <img
                src={reservation.property.imageUrl || '/images/property-placeholder.jpg'}
                alt={reservation.property.title}
                className="img-fluid rounded w-100"
                style={{ height: '150px', objectFit: 'cover' }}
              />
            </Col>
            
            {/* Reservation Details */}
            <Col md={6}>
              <h5 className="mb-2">
                <Link to={`/properties/${reservation.property.id}`} className="text-decoration-none">
                  {reservation.property.title}
                </Link>
              </h5>
              
              <div className="mb-2 text-muted small">
                <FaMapMarkerAlt className="me-1" />
                {reservation.property.address.city}, {reservation.property.address.country}
              </div>
              
              <div className="mb-2 d-flex align-items-center">
                <FaCalendarAlt className="me-2 text-primary" />
                <div>
                  <div>{format(checkInDate, 'EEE, MMM d, yyyy')} (Check-in)</div>
                  <div>{format(checkOutDate, 'EEE, MMM d, yyyy')} (Check-out)</div>
                </div>
              </div>
              
              <div className="d-flex mb-2">
                <div className="me-3">
                  <FaUsers className="me-1 text-primary" />
                  {reservation.guestCount} {reservation.guestCount === 1 ? 'Guest' : 'Guests'}
                </div>
                
                <div>
                  <FaPoundSign className="me-1 text-primary" />
                  {reservation.totalPrice} Total
                </div>
              </div>
              
              {reservation.specialRequests && (
                <div className="mt-2 small text-muted">
                  <strong>Special Requests:</strong> {reservation.specialRequests}
                </div>
              )}
            </Col>
            
            {/* Status and Actions */}
            <Col md={3} className="d-flex flex-column justify-content-between">
              <div className="text-end">
                <Badge bg={getStatusBadgeVariant()}>
                  {reservation.status}
                </Badge>
                
                <div className="mt-2 small text-muted">
                  Booked on {format(new Date(reservation.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
              
              <div className="mt-3 d-grid gap-2">
                <Button
                  as={Link}
                  to={`/reservations/${reservation.id}`}
                  variant="outline-primary"
                  size="sm"
                >
                  View Details
                </Button>
                
                {isCancellable && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Reservation
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Cancel Reservation Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel your reservation at <strong>{reservation.property.title}</strong>?</p>
          
          <div className="alert alert-warning">
            <strong>Please note:</strong> Cancellation policies may apply. Depending on how close your stay is, you may not receive a full refund.
          </div>
          
          <p className="mb-0">
            Check-in: {format(checkInDate, 'MMM d, yyyy')}
            <br />
            Check-out: {format(checkOutDate, 'MMM d, yyyy')}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Go Back
          </Button>
          <Button variant="danger" onClick={handleCancelReservation}>
            Yes, Cancel Reservation
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReservationCard;