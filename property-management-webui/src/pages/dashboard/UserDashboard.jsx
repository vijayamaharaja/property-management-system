import React, { useEffect } from 'react';
// In src/pages/dashboard/UserDashboard.jsx, add this import:
import { Container, Row, Col, Card, Button, Spinner, Alert, Tabs, Tab, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpcomingReservations, fetchAllReservations } from '../../redux/slices/reservationSlice';
import ReservationCard from '../../components/dashboard/ReservationCard';
import EmptyState from '../../components/common/EmptyState';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const upcomingReservations = useSelector(state => state.reservations.upcoming);
  const allReservations = useSelector(state => state.reservations.all);
  
  useEffect(() => {
    dispatch(fetchUpcomingReservations());
    dispatch(fetchAllReservations());
  }, [dispatch]);

  if (!user) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          Please log in to view your dashboard.
        </Alert>
      </Container>
    );
  }

  const isPropertyOwner = user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_OWNER');

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Dashboard</h1>
        
        {isPropertyOwner && (
          <Button as={Link} to="/dashboard/owner" variant="primary">
            Property Owner Dashboard
          </Button>
        )}
      </div>
      
      {/* Welcome Card */}
      <Card className="bg-light mb-4">
        <Card.Body>
          <h4>Welcome back, {user.firstName || user.username}!</h4>
          <p className="mb-0">
            Here you can view your upcoming reservations, booking history, and manage your account.
          </p>
        </Card.Body>
      </Card>
      
      {/* Stats Row */}
      <Row className="mb-4">
        <Col md={4} className="mb-4 mb-md-0">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-4 mb-2">
                {upcomingReservations.loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  upcomingReservations.data.length
                )}
              </div>
              <Card.Title>Upcoming Stays</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4 mb-md-0">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-4 mb-2">
                {allReservations.loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  allReservations.data.filter(r => r.status === 'COMPLETED').length
                )}
              </div>
              <Card.Title>Completed Stays</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-4 mb-2">
                {allReservations.loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  allReservations.data.filter(r => r.status === 'CANCELLED').length
                )}
              </div>
              <Card.Title>Cancelled Bookings</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Tabs for Reservations */}
      <Tabs defaultActiveKey="upcoming" className="mb-4">
        {/* Upcoming Reservations Tab */}
        <Tab eventKey="upcoming" title="Upcoming Reservations">
          <Card className="shadow-sm">
            <Card.Body>
              {upcomingReservations.loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" />
                </div>
              ) : upcomingReservations.error ? (
                <Alert variant="danger">{upcomingReservations.error}</Alert>
              ) : upcomingReservations.data.length === 0 ? (
                <EmptyState
                  title="No upcoming reservations"
                  message="You don't have any upcoming reservations. Start exploring properties to book your next stay!"
                  action={
                    <Button as={Link} to="/properties" variant="primary">
                      Find Properties
                    </Button>
                  }
                />
              ) : (
                <div>
                  <h5 className="mb-3">Your upcoming stays</h5>
                  {upcomingReservations.data.map(reservation => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        {/* All Reservations Tab */}
        <Tab eventKey="all" title="All Reservations">
          <Card className="shadow-sm">
            <Card.Body>
              {allReservations.loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" />
                </div>
              ) : allReservations.error ? (
                <Alert variant="danger">{allReservations.error}</Alert>
              ) : allReservations.data.length === 0 ? (
                <EmptyState
                  title="No reservations found"
                  message="You haven't made any reservations yet. Start exploring properties to book your first stay!"
                  action={
                    <Button as={Link} to="/properties" variant="primary">
                      Find Properties
                    </Button>
                  }
                />
              ) : (
                <div>
                  <h5 className="mb-3">Your reservation history</h5>
                  {allReservations.data.map(reservation => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                  
                  {allReservations.totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                      <Pagination>
                        <Pagination.Prev 
                          disabled={allReservations.page === 0}
                          onClick={() => dispatch(fetchAllReservations({ page: allReservations.page - 1 }))}
                        />
                        
                        {[...Array(allReservations.totalPages).keys()].map(page => (
                          <Pagination.Item 
                            key={page}
                            active={page === allReservations.page}
                            onClick={() => dispatch(fetchAllReservations({ page }))}
                          >
                            {page + 1}
                          </Pagination.Item>
                        ))}
                        
                        <Pagination.Next 
                          disabled={allReservations.page === allReservations.totalPages - 1}
                          onClick={() => dispatch(fetchAllReservations({ page: allReservations.page + 1 }))}
                        />
                      </Pagination>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        {/* Account Settings Tab */}
        <Tab eventKey="settings" title="Account Settings">
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Personal Information</h5>
              
              <Row className="mb-4">
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h6 className="card-subtitle mb-3 text-muted">Contact Information</h6>
                      <p><strong>Username:</strong> {user.username}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Phone:</strong> {user.phoneNumber || 'Not provided'}</p>
                      
                      <Button as={Link} to="/profile/edit" variant="outline-primary" size="sm">
                        Edit Profile
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h6 className="card-subtitle mb-3 text-muted">Security</h6>
                      <p><strong>Last Login:</strong> {new Date().toLocaleDateString()}</p>
                      <p><strong>Account Created:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                      
                      <Button as={Link} to="/profile/change-password" variant="outline-primary" size="sm">
                        Change Password
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <div className="mt-3">
                <h6>Notification Preferences</h6>
                <p className="text-muted">Manage how you receive notifications and updates.</p>
                
                <Button as={Link} to="/profile/notifications" variant="outline-secondary">
                  Manage Notifications
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;