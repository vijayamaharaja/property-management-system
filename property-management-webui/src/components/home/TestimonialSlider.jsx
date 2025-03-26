import React, { useState } from 'react';
import { Carousel, Card } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

// Sample testimonials - in a real app, you would fetch these from an API
const testimonials = [
  {
    id: 1,
    name: 'John Smith',
    location: 'London',
    text: 'We had an amazing stay at the Cornwall cottage. Everything was perfect from start to finish. The booking process was seamless and the property was even better than in the photos!',
    rating: 5,
    image: '/images/testimonials/user1.svg'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    location: 'Manchester',
    text: 'The London apartment was in a perfect location for our weekend getaway. It was clean, modern, and had all the amenities we needed. Would definitely book again!',
    rating: 4,
    image: '/images/testimonials/user2.svg'
  },
  {
    id: 3,
    name: 'David Williams',
    location: 'Edinburgh',
    text: 'This was our third booking through Property Management and each one has been excellent. The properties are high quality and the customer service is outstanding.',
    rating: 5,
    image: '/images/testimonials/user3.svg'
  }
];

const TestimonialSlider = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel 
      activeIndex={index}
      onSelect={handleSelect}
      indicators={true}
      controls={true}
      interval={5000}
      className="testimonial-slider bg-light rounded p-3"
    >
      {testimonials.map((testimonial) => (
        <Carousel.Item key={testimonial.id}>
          <Card className="border-0 bg-transparent">
            <Card.Body className="text-center">
              <div className="mb-3">
                <img
                  src={testimonial.image || '/images/testimonials/placeholder.svg'}
                  alt={testimonial.name}
                  className="rounded-circle"
                  width="80"
                  height="80"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < testimonial.rating ? 'text-warning' : 'text-muted'}
                  />
                ))}
              </div>
              <Card.Text className="mb-3 fst-italic">
                "{testimonial.text}"
              </Card.Text>
              <div className="fw-bold">{testimonial.name}</div>
              <div className="text-muted small">{testimonial.location}</div>
            </Card.Body>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default TestimonialSlider;