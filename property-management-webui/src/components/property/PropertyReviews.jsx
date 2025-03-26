import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

// Mock reviews data - in a real app, you would fetch these from your API
const mockReviews = [
  {
    id: 1,
    userId: 123,
    userName: 'John D.',
    rating: 5,
    comment: 'Exceptional property with amazing views. Everything was perfect!',
    date: '2025-02-15T14:30:00'
  },
  {
    id: 2,
    userId: 456,
    userName: 'Sarah M.',
    rating: 4,
    comment: 'Great location and very comfortable. Would definitely recommend.',
    date: '2025-01-27T09:15:00'
  },
  {
    id: 3,
    userId: 789,
    userName: 'Michael P.',
    rating: 5,
    comment: 'Spotlessly clean and the host was very responsive. We had a wonderful stay.',
    date: '2025-01-10T18:45:00'
  }
];

const PropertyReviews = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, comment: '' });
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  useEffect(() => {
    // In a real app, you would fetch reviews from your API
    // For now, we'll simulate an API call using setTimeout
    const fetchReviews = () => {
      setLoading(true);
      setTimeout(() => {
        setReviews(mockReviews);
        setLoading(false);
      }, 1000);
    };
    
    fetchReviews();
  }, [propertyId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRatingChange = (newRating) => {
    setFormData(prev => ({ ...prev, rating: newRating }));
  };
  
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    // In a real app, you would submit the review to your API
    // For now, we'll add it to the local state
    const newReview = {
      id: Date.now(),
      userId: user?.id || 999,
      userName: user?.firstName ? `${user.firstName} ${user.lastName.charAt(0)}.` : 'Anonymous',
      rating: formData.rating,
      comment: formData.comment,
      date: new Date().toISOString()
    };
    
    setReviews([newReview, ...reviews]);
    setFormData({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };
  
  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Guest Reviews</h4>
        
        {isAuthenticated && !showReviewForm && (
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setShowReviewForm(true)}
          >
            Write a Review
          </Button>
        )}
      </div>
      
      {showReviewForm && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">Your Review</h5>
            
            <Form onSubmit={handleSubmitReview}>
              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <div className="mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`me-1 ${star <= formData.rating ? 'text-warning' : 'text-muted'}`}
                      style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                      onClick={() => handleRatingChange(star)}
                    />
                  ))}
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  placeholder="Share your experience with this property..."
                  required
                />
              </Form.Group>
              
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Submit Review
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      {reviews.length === 0 ? (
        <Alert variant="info">
          No reviews yet. Be the first to review this property!
        </Alert>
      ) : (
        <div>
          {reviews.map((review) => (
            <Card key={review.id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-bold">{review.userName}</div>
                    <div className="text-muted small">
                      {format(new Date(review.date), 'MMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? 'text-warning' : 'text-muted'}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-3">
                  {review.comment}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyReviews;