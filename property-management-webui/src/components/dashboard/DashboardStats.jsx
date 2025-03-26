import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaHome, FaCalendarCheck, FaChartLine, FaPercent } from 'react-icons/fa';

const DashboardStats = ({ stats = {} }) => {
  const {
    totalProperties = 0,
    totalRevenue = 0,
    activeBookings = 0,
    occupancyRate = 0,
  } = stats;

  const statItems = [
    {
      title: 'Total Properties',
      value: totalProperties,
      icon: FaHome,
      color: 'primary',
      valuePrefix: '',
      valueSuffix: ''
    },
    {
      title: 'Total Revenue',
      value: totalRevenue,
      icon: FaChartLine,
      color: 'success',
      valuePrefix: '£',
      valueSuffix: ''
    },
    {
      title: 'Active Bookings',
      value: activeBookings,
      icon: FaCalendarCheck,
      color: 'info',
      valuePrefix: '',
      valueSuffix: ''
    },
    {
      title: 'Occupancy Rate',
      value: occupancyRate,
      icon: FaPercent,
      color: 'warning',
      valuePrefix: '',
      valueSuffix: '%'
    }
  ];

  return (
    <Row>
      {statItems.map((item, index) => (
        <Col xl={3} md={6} className="mb-4" key={index}>
          <Card className={`border-left-${item.color} shadow h-100 py-2`}>
            <Card.Body>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <div className={`text-xs font-weight-bold text-${item.color} text-uppercase mb-1`}>
                    {item.title}
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {item.valuePrefix}
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                    {item.valueSuffix}
                  </div>
                </Col>
                <Col className="col-auto">
                  <item.icon className={`text-${item.color} fa-2x`} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStats;