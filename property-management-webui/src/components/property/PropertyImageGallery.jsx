import React, { useState } from 'react';
import { Modal, Carousel } from 'react-bootstrap';

const PropertyImageGallery = ({ images = [], title = 'Property' }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Use a default image if no images are provided
  const imageUrls = images.length > 0 
    ? images 
    : ['/images/property-placeholder.svg'];
  
  const handleImageClick = (index) => {
    setActiveIndex(index);
    setShowModal(true);
  };
  
  const handleClose = () => {
    setShowModal(false);
  };
  
  return (
    <>
      <div className="property-gallery mb-4">
        {imageUrls.length === 1 ? (
          // Single image display
          <div 
            className="property-main-image rounded overflow-hidden"
            style={{ cursor: 'pointer' }}
            onClick={() => handleImageClick(0)}
          >
            <img 
              src={imageUrls[0]} 
              alt={title} 
              className="img-fluid w-100"
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </div>
        ) : (
          // Multiple images display
          <div className="row g-2">
            {/* Main large image */}
            <div className="col-12 col-md-8 mb-2 mb-md-0">
              <div 
                className="property-main-image rounded overflow-hidden"
                style={{ cursor: 'pointer', height: '400px' }}
                onClick={() => handleImageClick(0)}
              >
                <img 
                  src={imageUrls[0]} 
                  alt={`${title} - Main View`} 
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            
            {/* Thumbnail grid */}
            <div className="col-12 col-md-4">
              <div className="row g-2">
                {imageUrls.slice(1, 5).map((img, index) => (
                  <div className="col-6" key={index + 1}>
                    <div 
                      className="property-thumbnail rounded overflow-hidden"
                      style={{ cursor: 'pointer', height: '195px', position: 'relative' }}
                      onClick={() => handleImageClick(index + 1)}
                    >
                      <img 
                        src={img} 
                        alt={`${title} - View ${index + 2}`} 
                        className="img-fluid w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                      
                      {/* "See all photos" overlay on the last thumbnail if there are more than 5 images */}
                      {imageUrls.length > 5 && index === 3 && (
                        <div 
                          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        >
                          <div className="text-white text-center">
                            <div>See all</div>
                            <div>{imageUrls.length} photos</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Image Gallery Modal */}
      <Modal 
        show={showModal} 
        onHide={handleClose} 
        size="lg" 
        centered
        className="gallery-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Carousel
            activeIndex={activeIndex}
            onSelect={(index) => setActiveIndex(index)}
            interval={null}  // Disable auto-slide
            indicators={true}
            className="gallery-carousel"
          >
            {imageUrls.map((img, index) => (
              <Carousel.Item key={index}>
                <div className="gallery-image-container d-flex justify-content-center align-items-center bg-dark">
                  <img
                    className="d-block"
                    src={img}
                    alt={`${title} - View ${index + 1}`}
                    style={{ 
                      maxHeight: '70vh', 
                      maxWidth: '100%', 
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <Carousel.Caption className="bg-dark bg-opacity-75 rounded-pill py-1 px-3" style={{ bottom: '2rem', width: 'auto', left: '50%', transform: 'translateX(-50%)' }}>
                  <span className="small">
                    {index + 1} / {imageUrls.length}
                  </span>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PropertyImageGallery;