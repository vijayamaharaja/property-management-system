import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Spinner, Alert, Pagination } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { fetchPropertyReviews, createReview, updateReview, deleteReview, resetReviewState } from '../../redux/slices/reviewSlice';

const PropertyReviews = ({ propertyId }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { 
    propertyReviews,
    create,
    update,
    delete: deleteState
  } = useSelector(state => state.reviews);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({ rating: 5, comment: '' });
  
  // Fetch reviews when component mounts or propertyId changes
  useEffect(() => {
    if (propertyId) {
      dispatch(fetchPropertyReviews({ propertyId }));
    }
  }, [dispatch, propertyId]);
  
  // Reset form when create/update/delete operations complete
  useEffect(() => {
    if (create.success || update.success || deleteState.success) {
      setShowReviewForm(false);
      setEditingReview(null);
      setFormData({ rating: 5, comment: '' });
      
      // Reset states
      if (create.success) dispatch(resetReviewState('create'));
      if (update.success) dispatch(resetReviewState('update'));
      if (deleteState.success) dispatch(resetReviewState('delete'));
    }
  }, [create.success, update.success, deleteState.success, dispatch]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRatingChange = (newRating) => {
    setFormData(prev => ({ ...prev, rating: newRating }));
  };
  
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (editingReview) {
      dispatch(updateReview({ 
        reviewId: editingReview.id, 
        reviewData: formData 
      }));
    } else {
      dispatch(createReview({ 
        propertyId, 
        reviewData: formData 
      }));
    }
  };
  
  const handleEditReview = (review) => {
    setEditingReview(review);
    setFormData({ 
      rating: review.rating, 
      comment: review.comment 
    });
    setShowReviewForm(true);
  };
  
  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(reviewId));
    }
  };
  
  const handleCancelForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    setFormData({ rating: 5, comment: '' });
  };
  
  const handlePageChange = (page) => {
    dispatch(fetchPropertyReviews({ 
      propertyId, 
      params: { page } 
    }));
  };
  
  // Check if user can review (hasn't already reviewed)
  const canUserReview = () => {
    if (!isAuthenticated || !user) return false;
    
    // Check if user has already reviewed this property
    return !propertyReviews.data.some(review => 
      review.userId === user.id
    );
  };
  
  // Check if user can edit/delete a review
  const canManageReview = (review) => {
    if (!isAuthenticated || !user) return false;
    return review.userId === user.id;
  };

  if (propertyReviews.loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
      </div>
    );
  }
  
  if (propertyReviews.error) {
    return (
      <Alert variant="danger">
        {propertyReviews.error}
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Guest Reviews</h4>
        
        {isAuthenticated && canUserReview() && !showReviewForm && (
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
            <h5 className="mb-3">{editingReview ? 'Edit Your Review' : 'Your Review'}</h5>
            
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
                  onClick={handleCancelForm}
                  disabled={create.loading || update.loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={create.loading || update.loading}
                >
                  {create.loading || update.loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      {editingReview ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : (
                    editingReview ? 'Update Review' : 'Submit Review'
                  )}
                </Button>
              </div>
              
              {(create.error || update.error) && (
                <Alert variant="danger" className="mt-3">
                  {create.error || update.error}
                </Alert>
              )}
            </Form>
          </Card.Body>
        </Card>
      )}
      
      {propertyReviews.data.length === 0 ? (
        <Alert variant="info">
          No reviews yet. Be the first to review this property!
        </Alert>
      ) : (
        <>
          <div className="mb-3">
            <strong>
              {propertyReviews.data.length} {propertyReviews.data.length === 1 ? 'Review' : 'Reviews'}
            </strong>
          </div>
          
          {propertyReviews.data.map((review) => (
            <Card key={review.id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-bold">{review.userName}</div>
                    <div className="text-muted small">
                      {format(new Date(review.createdAt), 'MMM d, yyyy')}
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
                
                {canManageReview(review) && (
                  <div className="mt-3 d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleEditReview(review)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={deleteState.loading}
                    >
                      {deleteState.loading && deleteState.reviewId === review.id ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                          Deleting...
                        </>
                      ) : 'Delete'}
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
          
          {propertyReviews.totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  disabled={propertyReviews.page === 0}
                  onClick={() => handlePageChange(propertyReviews.page - 1)}
                />
                
                {[...Array(propertyReviews.totalPages).keys()].map(page => (
                  <Pagination.Item
                    key={page}
                    active={page === propertyReviews.page}
                    onClick={() => handlePageChange(page)}
                  >
                    {page + 1}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next
                  disabled={propertyReviews.page === propertyReviews.totalPages - 1}
                  onClick={() => handlePageChange(propertyReviews.page + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyReviews;