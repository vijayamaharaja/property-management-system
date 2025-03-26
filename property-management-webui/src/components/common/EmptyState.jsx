import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const EmptyState = ({ 
  title = 'No data found', 
  message = 'There is no data to display at the moment.', 
  icon: Icon = null,
  iconSize = 64,
  action = null,
  className = ''
}) => {
  return (
    <Container className={`text-center py-5 ${className}`}>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          {Icon && (
            <div className="mb-4 text-muted">
              <Icon size={iconSize} />
            </div>
          )}
          
          <h4 className="mb-3">{title}</h4>
          <p className="text-muted mb-4">{message}</p>
          
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EmptyState;