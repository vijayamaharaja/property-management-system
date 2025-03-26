// import React from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-dark text-light py-4 mt-5">
//       <Container>
//         <Row>
//           <Col md={4} className="mb-3 mb-md-0">
//             <h5>Property Management</h5>
//             <p className="text-muted">
//               Find your perfect property for your next stay or holiday.
//             </p>
//           </Col>
//           <Col md={2} className="mb-3 mb-md-0">
//             <h6>Links</h6>
//             <ul className="list-unstyled">
//               <li><Link to="/" className="text-muted">Home</Link></li>
//               <li><Link to="/properties" className="text-muted">Properties</Link></li>
//               <li><Link to="/about" className="text-muted">About Us</Link></li>
//               <li><Link to="/contact" className="text-muted">Contact</Link></li>
//             </ul>
//           </Col>
//           <Col md={3} className="mb-3 mb-md-0">
//             <h6>Support</h6>
//             <ul className="list-unstyled">
//               <li><Link to="/help" className="text-muted">Help Center</Link></li>
//               <li><Link to="/faq" className="text-muted">FAQs</Link></li>
//               <li><Link to="/terms" className="text-muted">Terms of Service</Link></li>
//               <li><Link to="/privacy" className="text-muted">Privacy Policy</Link></li>
//             </ul>
//           </Col>
//           <Col md={3}>
//             <h6>Connect with Us</h6>
//             <div className="d-flex">
//               <a href="#" className="text-muted me-3"><i className="bi bi-facebook"></i></a>
//               <a href="#" className="text-muted me-3"><i className="bi bi-twitter"></i></a>
//               <a href="#" className="text-muted me-3"><i className="bi bi-instagram"></i></a>
//               <a href="#" className="text-muted"><i className="bi bi-linkedin"></i></a>
//             </div>
//           </Col>
//         </Row>
//         <hr className="my-3 bg-secondary" />
//         <div className="text-center text-muted">
//           <small>&copy; {currentYear} Property Management System. All rights reserved.</small>
//         </div>
//       </Container>
//     </footer>
//   );
// };

// export default Footer;




import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light py-3 mt-5">
      <Container className="text-center">
        <p className="mb-0">© {new Date().getFullYear()} Property Management System</p>
      </Container>
    </footer>
  );
};

export default Footer;