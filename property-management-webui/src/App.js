import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import RegisterForm from './features/auth/RegisterForm';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4">
            <h1 className="text-xl font-semibold text-gray-800">Property Catalog Service</h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <RegisterForm />
        </main>
      </div>
    </Provider>
  );
}

export default App;
