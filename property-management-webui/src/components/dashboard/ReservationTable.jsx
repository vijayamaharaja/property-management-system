import React, { useState } from 'react';
import { Table, Badge, Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateReservationStatus, cancelReservation } from '../../redux/slices/reservationSlice';
import { formatDate } from '../../utils/dateUtils';

const ReservationTable = ({ 
  reservations = [], 
  showPropertyInfo = true, 
  showActions = true,
  isPropertyOwner = false
}) => {
  const dispatch = useDispatch();
  
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  const handleStatusChange = (reservation) => {
    setSelectedReservation(reservation);
    setNewStatus(reservation.status);
    setShowStatusModal(true);
  };
  
  const handleCancelReservation = (reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };
  
  const confirmStatusChange = () => {
    if (selectedReservation && newStatus) {
      dispatch(updateReservationStatus({
        reservationId: selectedReservation.id,
        status: newStatus
      }));
      setShowStatusModal(false);
    }
  };
  
  const confirmCancellation = () => {
    if (selectedReservation) {
      dispatch(cancelReservation(selectedReservation.id));
      setShowCancelModal(false);
    }
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'danger';
      case 'COMPLETED': return 'info';
      default: return 'secondary';
    }
  };
  
  if (!reservations || reservations.length === 0) {
    return <p className="text-muted">No reservations found.</p>;
  }
  
  return (
    <>
      <Table responsive hover>
        <thead>
          <tr>
            <th>ID</th>
            {showPropertyInfo && <th>Property</th>}
            <th>Dates</th>
            <th>Guests</th>
            <th>Total</th>
            <th>Status</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              
              {showPropertyInfo && (
                <td>
                  <Link to={`/properties/${reservation.property.id}`}>
                    {reservation.property.title}
                  </Link>
                  <div className="small text-muted">
                    {reservation.property.address?.city}, {reservation.property.address?.country}
                  </div>
                </td>
              )}
              
              <td>
                <div>{formatDate(reservation.checkInDate)}</div>
                <div className="small text-muted">to {formatDate(reservation.checkOutDate)}</div>
              </td>
              
              <td>{reservation.guestCount}</td>
              
              <td>£{reservation.totalPrice}</td>
              
              <td>
                <Badge bg={getStatusBadgeVariant(reservation.status)}>
                  {reservation.status}
                </Badge>
              </td>
              
              {showActions && (
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      as={Link} 
                      to={`/reservations/${reservation.id}`}
                      variant="outline-primary" 
                      size="sm"
                    >
                      View
                    </Button>
                    
                    {isPropertyOwner && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleStatusChange(reservation)}
                      >
                        Change Status
                      </Button>
                    )}
                    
                    {['PENDING', 'CONFIRMED'].includes(reservation.status) && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleCancelReservation(reservation)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Status Change Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Reservation Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Change status to:</Form.Label>
              <Form.Control
                as="select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmStatusChange}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this reservation?</p>
          {selectedReservation && (
            <div>
              <p><strong>Property:</strong> {selectedReservation.property?.title}</p>
              <p><strong>Dates:</strong> {formatDate(selectedReservation.checkInDate)} to {formatDate(selectedReservation.checkOutDate)}</p>
              <p><strong>Total Amount:</strong> £{selectedReservation.totalPrice}</p>
            </div>
          )}
          <div className="alert alert-warning">
            <strong>Note:</strong> Cancellation policies may apply. You might not receive a full refund depending on how close the reservation is.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Go Back
          </Button>
          <Button variant="danger" onClick={confirmCancellation}>
            Confirm Cancellation
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReservationTable;