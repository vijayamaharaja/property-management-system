import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isPropertyOwner = isAdmin || user?.roles?.includes('ROLE_OWNER');

  return (
    <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/images/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="Property Management Logo"
          />
          Property Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/properties">Properties</Nav.Link>
            {isPropertyOwner && (
              <Nav.Link as={Link} to="/dashboard/properties">My Properties</Nav.Link>
            )}
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <NavDropdown title={`Hello, ${user.firstName || user.username}`} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dashboard/reservations">My Reservations</NavDropdown.Item>
                {isPropertyOwner && (
                  <>
                    <NavDropdown.Item as={Link} to="/dashboard/properties">My Properties</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/dashboard/property-bookings">Booking Requests</NavDropdown.Item>
                    {isAdmin && (
                      <NavDropdown.Item as={Link} to="/admin">Admin Panel</NavDropdown.Item>
                    )}
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" className="me-2">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;


// import React from 'react';
// import { Navbar, Container, Nav } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// const Header = () => {
//   return (
//     <Navbar bg="light" expand="lg">
//       <Container>
//         <Navbar.Brand as={Link} to="/">Property Management</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto">
//             <Nav.Link as={Link} to="/">Home</Nav.Link>
//             <Nav.Link as={Link} to="/login">Login</Nav.Link>
//             <Nav.Link as={Link} to="/register">Register</Nav.Link>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;