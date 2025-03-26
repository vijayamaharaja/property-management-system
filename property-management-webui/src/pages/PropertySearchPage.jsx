import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Pagination, Form, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropertySearchForm from '../components/search/PropertySearchForm';
import PropertyCard from '../components/property/PropertyCard';
import { searchProperties } from '../redux/slices/propertySlice';

const PropertySearchPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { properties, loading, error, totalPages, currentPage } = useSelector(state => state.properties.search);
  
  const [sortOption, setSortOption] = useState('price_asc');

  useEffect(() => {
    // Get search params
    const city = searchParams.get('city') || '';
    const checkInDate = searchParams.get('checkInDate') || '';
    const checkOutDate = searchParams.get('checkOutDate') || '';
    const guests = searchParams.get('guests') || '';
    const bedrooms = searchParams.get('bedrooms') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const type = searchParams.get('type') || '';
    const page = searchParams.get('page') || 0;
    
    // To match backed pagination
    let sortBy = 'pricePerDay';
    let sortDirection = 'asc';
  
    if (sortOption === 'price_desc') {
      sortBy = 'pricePerDay';
      sortDirection = 'desc';
    } else if (sortOption === 'rating_desc') {
      sortBy = 'averageRating';
      sortDirection = 'desc';
    } else if (sortOption === 'newest') {
      sortBy = 'createdAt';
      sortDirection = 'desc';
    }
  
    // Create search query
    const searchQuery = {
      city,
      checkInDate,
      checkOutDate,
      guests,
      bedrooms,
      minPrice,
      maxPrice,
      type,
      page,
      sortBy,
      sortDirection
    };
    
    // Dispatch search action
    dispatch(searchProperties(searchQuery));
  }, [dispatch, searchParams, sortOption]);

  // Handle pagination click
  const handlePageClick = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber);
    window.location.search = params.toString();
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    let items = [];
    const currentPageNum = parseInt(currentPage);
    const totalPagesNum = parseInt(totalPages);
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev" 
        disabled={currentPageNum === 0}
        onClick={() => handlePageClick(currentPageNum - 1)}
      />
    );
    
    // First page
    items.push(
      <Pagination.Item 
        key={0} 
        active={currentPageNum === 0}
        onClick={() => handlePageClick(0)}
      >
        1
      </Pagination.Item>
    );
    
    // Ellipsis if needed
    if (currentPageNum > 2) {
      items.push(<Pagination.Ellipsis key="ellipsis1" />);
    }
    
    // Pages around current page
    for (let number = Math.max(1, currentPageNum); number <= Math.min(currentPageNum + 1, totalPagesNum - 2); number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPageNum}
          onClick={() => handlePageClick(number)}
        >
          {number + 1}
        </Pagination.Item>
      );
    }
    
    // Ellipsis if needed
    if (currentPageNum < totalPagesNum - 3) {
      items.push(<Pagination.Ellipsis key="ellipsis2" />);
    }
    
    // Last page if not already added
    if (totalPagesNum > 1) {
      items.push(
        <Pagination.Item 
          key={totalPagesNum - 1} 
          active={currentPageNum === totalPagesNum - 1}
          onClick={() => handlePageClick(totalPagesNum - 1)}
        >
          {totalPagesNum}
        </Pagination.Item>
      );
    }
    
    // Next button
    items.push(
      <Pagination.Next 
        key="next" 
        disabled={currentPageNum === totalPagesNum - 1}
        onClick={() => handlePageClick(currentPageNum + 1)}
      />
    );
    
    return <Pagination>{items}</Pagination>;
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Find Your Perfect Property</h1>
      
      {/* Search Form */}
      <div className="mb-4">
        <PropertySearchForm />
      </div>
      
      {/* Results Section */}
      <Row>
        {/* Filters Column */}
        <Col lg={3} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Sort Results</Card.Title>
              <Form.Group className="mb-3">
                <Form.Select value={sortOption} onChange={handleSortChange}>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </Form.Select>
              </Form.Group>
              
              {/* Additional filters could be added here */}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Results Column */}
        <Col lg={9}>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : properties.length === 0 ? (
            <Alert variant="info">
              No properties found matching your criteria. Please try adjusting your search.
            </Alert>
          ) : (
            <>
              <p className="mb-3">Showing {properties.length} properties</p>
              <Row xs={1} md={2} className="g-4 mb-4">
                {properties.map(property => (
                  <Col key={property.id}>
                    <PropertyCard 
                      property={property} 
                      checkInDate={searchParams.get('checkInDate')}
                      checkOutDate={searchParams.get('checkOutDate')}
                      guests={searchParams.get('guests')}
                    />
                  </Col>
                ))}
              </Row>
              <div className="d-flex justify-content-center">
                {renderPagination()}
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PropertySearchPage;