import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { checkAvailability, resetBookingState } from '../../redux/slices/bookingSlice';
import { formatDate } from '../../utils/dateUtils';

const PropertyReservationForm = ({ 
  propertyId, 
  initialCheckInDate, 
  initialCheckOutDate, 
  initialGuests, 
  price, 
  maxGuests = 10,
  onBookNow,
  isAuthenticated 
}) => {
  const dispatch = useDispatch();
  const { availability } = useSelector(state => state.booking);
  
  // Form state
  const [checkInDate, setCheckInDate] = useState(initialCheckInDate || null);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate || null);
  const [guestCount, setGuestCount] = useState(initialGuests || 1);
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Calculation state
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Validation state
  const [validated, setValidated] = useState(false);
  
  // Reset availability check when dates change
  useEffect(() => {
    if (availability.isAvailable) {
      dispatch(resetBookingState());
    }
  }, [dispatch, checkInDate, checkOutDate]);
  
  // Calculate total nights and price when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const diffDays = Math.round(Math.abs((checkOutDate - checkInDate) / oneDay));
      
      if (diffDays > 0) {
        setTotalNights(diffDays);
        setTotalPrice(diffDays * price);
      } else {
        setTotalNights(0);
        setTotalPrice(0);
      }
    } else {
      setTotalNights(0);
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, price]);
  
  const handleCheckAvailability = (e) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate) {
      setValidated(true);
      return;
    }
    
    dispatch(checkAvailability({
      propertyId,
      checkInDate: formatDate(checkInDate),
      checkOutDate: formatDate(checkOutDate)
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false || !checkInDate || !checkOutDate) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    if (!availability.isAvailable) {
      alert('Please check availability before booking.');
      return;
    }
    
    if (typeof onBookNow === 'function') {
      onBookNow({
        propertyId,
        checkInDate: formatDate(checkInDate),
        checkOutDate: formatDate(checkOutDate),
        guestCount,
        specialRequests,
        totalPrice
      });
    }
  };
  
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Check-in Date</Form.Label>
        <DatePicker
          selected={checkInDate}
          onChange={date => setCheckInDate(date)}
          selectsStart
          startDate={checkInDate}
          endDate={checkOutDate}
          minDate={new Date()}
          dateFormat="MM/dd/yyyy"
          className="form-control"
          required
        />
        <Form.Control.Feedback type="invalid">
          Please select a check-in date.
        </Form.Control.Feedback>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Check-out Date</Form.Label>
        <DatePicker
          selected={checkOutDate}
          onChange={date => setCheckOutDate(date)}
          selectsEnd
          startDate={checkInDate}
          endDate={checkOutDate}
          minDate={checkInDate || new Date()}
          dateFormat="MM/dd/yyyy"
          className="form-control"
          required
        />
        <Form.Control.Feedback type="invalid">
          Please select a check-out date.
        </Form.Control.Feedback>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Guests</Form.Label>
        <Form.Control
          as="select"
          value={guestCount}
          onChange={e => setGuestCount(parseInt(e.target.value))}
          required
        >
          {[...Array(maxGuests)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>
          ))}
        </Form.Control>
      </Form.Group>
      
      <div className="d-grid mb-3">
        <Button 
          variant="outline-primary" 
          onClick={handleCheckAvailability}
          disabled={!checkInDate || !checkOutDate || availability.loading}
        >
          {availability.loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Checking...
            </>
          ) : 'Check Availability'}
        </Button>
      </div>
      
      {availability.error && (
        <Alert variant="danger" className="mb-3">
          {availability.error}
        </Alert>
      )}
      
      {availability.isAvailable && (
        <Alert variant="success" className="mb-3">
          This property is available for the selected dates!
        </Alert>
      )}
      
      {totalNights > 0 && (
        <Card className="mb-3 bg-light">
          <Card.Body>
            <div className="d-flex justify-content-between mb-2">
              <span>£{price} x {totalNights} nights</span>
              <span>£{totalPrice}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>£{totalPrice}</span>
            </div>
          </Card.Body>
        </Card>
      )}
      
      <Form.Group className="mb-3">
        <Form.Label>Special Requests (Optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={specialRequests}
          onChange={e => setSpecialRequests(e.target.value)}
          placeholder="Any special requests or requirements for your stay?"
        />
      </Form.Group>
      
      <div className="d-grid">
        <Button 
          variant="primary" 
          type="submit" 
          size="lg"
          disabled={!availability.isAvailable || !checkInDate || !checkOutDate}
        >
          Book Now
        </Button>
      </div>
      
      {!isAuthenticated && (
        <div className="mt-2 text-center text-muted small">
          <span>You'll need to log in or create an account to complete your booking.</span>
        </div>
      )}
    </Form>
  );
};

export default PropertyReservationForm;