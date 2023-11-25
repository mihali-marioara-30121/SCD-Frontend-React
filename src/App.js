
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeManagementPage from './components/EmployeeManagementPage'; // Create this component
import LoginPage from './components/LoginPage';

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/employeeManagement" element={<EmployeeManagementPage />} />
    </Routes>
  </Router>
  );
};

export default App;
