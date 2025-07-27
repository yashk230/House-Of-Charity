import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            House of Charity
          </h1>
          <p className="text-gray-600">
            Welcome to our platform connecting donors and NGOs
          </p>
        </div>
      </div>
    </Router>
  );
}

export default App; 