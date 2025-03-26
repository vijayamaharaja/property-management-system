import React from 'react';

const PropertyMap = ({ latitude, longitude, title }) => {
  // In a real application, you would use a mapping library like Google Maps or Leaflet
  // For now, we'll create a placeholder with styling
  
  return (
    <div 
      className="property-map bg-light rounded" 
      style={{ 
        height: '100%', 
        minHeight: '200px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <div className="text-center text-muted">
        <p>Map View</p>
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
        <p>{title}</p>
      </div>
      
      {/* Styling to make it look like a map */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/images/map-placeholder.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
          zIndex: -1
        }}
      />
      
      {/* Map pin */}
      <div 
        style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'red',
          fontSize: '2rem'
        }}
      >
        📍
      </div>
    </div>
  );
};

export default PropertyMap;