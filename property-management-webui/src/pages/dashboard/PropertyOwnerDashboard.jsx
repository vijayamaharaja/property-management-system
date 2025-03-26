import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerProperties, fetchPropertyBookings, fetchPropertyStats } from '../../redux/slices/ownerDashboardSlice';
import PropertyCard from '../../components/property/PropertyCard';
import DashboardStats from '../../components/dashboard/DashboardStats';
import ReservationTable from '../../components/dashboard/ReservationTable';
import RevenueChart from '../../components/dashboard/RevenueChart';

const PropertyOwnerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { 
    properties, 
    bookings, 
    stats, 
    loading, 
    error 
  } = useSelector(state => state.ownerDashboard);
  
  useEffect(() => {
    dispatch(fetchOwnerProperties());
    dispatch(fetchPropertyBookings());
    dispatch(fetchPropertyStats());
  }, [dispatch]);

  if (!user || (!user.roles.includes('ROLE_ADMIN') && !user.roles.includes('ROLE_OWNER'))) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          You do not have permission to access this page. Only property owners and administrators can view this dashboard.
        </Alert>
      </Container>
    );
  }

  if (loading.properties || loading.bookings || loading.stats) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h2 mb-0 text-gray-800">Property Owner Dashboard</h1>
        <Button as={Link} to="/dashboard/properties/add" variant="primary">
          <i className="fas fa-plus fa-sm text-white-50 me-2"></i>
          Add New Property
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-4">
          <Card className="border-left-primary shadow h-100 py-2">
            <Card.Body>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Properties
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalProperties || 0}
                  </div>
                </Col>
                <Col className="col-auto">
                  <i className="fas fa-home fa-2x text-gray-300"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-left-success shadow h-100 py-2">
            <Card.Body>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Revenue
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    £{stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}
                  </div>
                </Col>
                <Col className="col-auto">
                  <i className="fas fa-pound-sign fa-2x text-gray-300"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-left-info shadow h-100 py-2">
            <Card.Body>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Active Bookings
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.activeBookings || 0}
                  </div>
                </Col>
                <Col className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-4">
          <Card className="border-left-warning shadow h-100 py-2">
            <Card.Body>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Occupancy Rate
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.occupancyRate ? `${stats.occupancyRate}%` : 'N/A'}
                  </div>
                </Col>
                <Col className="col-auto">
                  <i className="fas fa-percent fa-2x text-gray-300"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs for Different Dashboard Sections */}
      <Tabs defaultActiveKey="overview" className="mb-4">
        {/* Overview Tab */}
        <Tab eventKey="overview" title="Overview">
          <Row>
            {/* Revenue Chart */}
            <Col lg={8} className="mb-4">
              <Card className="shadow">
                <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Monthly Revenue</h6>
                </Card.Header>
                <Card.Body>
                  <RevenueChart data={stats.monthlyRevenue || []} />
                </Card.Body>
              </Card>
            </Col>

            {/* Booking Status */}
            <Col lg={4} className="mb-4">
              <Card className="shadow">
                <Card.Header className="py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Booking Status</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="text-center">
                    <Col>
                      <div className="h4 mb-0 font-weight-bold text-gray-800">
                        {stats.pendingBookings || 0}
                      </div>
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                        Pending
                      </div>
                    </Col>
                    <Col>
                      <div className="h4 mb-0 font-weight-bold text-gray-800">
                        {stats.confirmedBookings || 0}
                      </div>
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Confirmed
                      </div>
                    </Col>
                    <Col>
                      <div className="h4 mb-0 font-weight-bold text-gray-800">
                        {stats.cancelledBookings || 0}
                      </div>
                      <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                        Cancelled
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <h6 className="font-weight-bold">Upcoming Checkouts</h6>
                    {stats.upcomingCheckouts && stats.upcomingCheckouts.length > 0 ? (
                      <ul className="list-group">
                        {stats.upcomingCheckouts.map((checkout, index) => (
                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <div>{checkout.propertyTitle}</div>
                              <small className="text-muted">{checkout.guestName}</small>
                            </div>
                            <div>{new Date(checkout.checkoutDate).toLocaleDateString()}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No upcoming checkouts in the next 7 days</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Properties Tab */}
        <Tab eventKey="properties" title="My Properties">
          <Card className="shadow mb-4">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">My Properties</h6>
            </Card.Header>
            <Card.Body>
              {properties && properties.length > 0 ? (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {properties.map(property => (
                    <Col key={property.id}>
                      <PropertyCard 
                        property={property} 
                        isOwner={true} 
                        showEditButtons={true}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert variant="info">
                  You don't have any properties yet. Click "Add New Property" to get started.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Bookings Tab */}
        <Tab eventKey="bookings" title="Booking Requests">
          <Card className="shadow mb-4">
            <Card.Header className="py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Recent Booking Requests</h6>
              <Link to="/dashboard/all-bookings" className="btn btn-sm btn-primary">
                View All Bookings
              </Link>
            </Card.Header>
            <Card.Body>
              {bookings && bookings.length > 0 ? (
                <ReservationTable 
                  reservations={bookings} 
                  showPropertyInfo={true} 
                  showActions={true}
                />
              ) : (
                <Alert variant="info">
                  No booking requests found.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Revenue Tab */}
        <Tab eventKey="revenue" title="Revenue">
          <Card className="shadow mb-4">
            <Card.Header className="py-3">
              <h6 className="m-0 font-weight-bold text-primary">Revenue Breakdown</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={8}>
                  <RevenueChart data={stats.monthlyRevenue || []} />
                </Col>
                <Col lg={4}>
                  <Card className="mb-4">
                    <Card.Body>
                      <h5 className="card-title">Revenue by Property</h5>
                      {stats.revenueByProperty && stats.revenueByProperty.length > 0 ? (
                        <Table responsive className="table-sm">
                          <thead>
                            <tr>
                              <th>Property</th>
                              <th>Revenue</th>
                              <th>Bookings</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.revenueByProperty.map((item, index) => (
                              <tr key={index}>
                                <td>{item.propertyTitle}</td>
                                <td>£{item.revenue.toLocaleString()}</td>
                                <td>{item.bookings}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p className="text-muted">No revenue data available</p>
                      )}
                    </Card.Body>
                  </Card>
                  
                  <Card>
                    <Card.Body>
                      <h5 className="card-title">Year-to-Date Summary</h5>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Revenue:</span>
                        <span className="font-weight-bold">£{stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Bookings:</span>
                        <span className="font-weight-bold">{stats.totalBookings || 0}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Average Booking Value:</span>
                        <span className="font-weight-bold">
                          £{stats.averageBookingValue ? stats.averageBookingValue.toLocaleString() : 0}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default PropertyOwnerDashboard;