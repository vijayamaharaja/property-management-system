import React, { useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProperties } from '../../redux/slices/propertySlice';
import PropertyCard from './PropertyCard';

const FeaturedProperties = () => {
  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector(state => state.properties.featured);

  useEffect(() => {
    dispatch(fetchFeaturedProperties());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        {error}
      </Alert>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <Alert variant="info" className="my-3">
        No featured properties available at the moment.
      </Alert>
    );
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {properties.map(property => (
        <Col key={property.id}>
          <PropertyCard property={property} />
        </Col>
      ))}
    </Row>
  );
};

export default FeaturedProperties;