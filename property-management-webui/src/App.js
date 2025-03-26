import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './redux/slices/authSlice';
import AppRoutes from './AppRoutes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is authenticated on app load
    dispatch(getCurrentUser());
}, [dispatch]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;