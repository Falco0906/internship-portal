import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AddInternship from './pages/AddInternship';
import ManageInternships from './pages/ManageInternships';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/">Add Internship</Link></li>
          <li><Link to="/manage">Manage Internships</Link></li>
        </ul>
      </nav>
      
      <div className="container">
        <Routes>
          <Route path="/" element={<AddInternship />} />
          <Route path="/manage" element={<ManageInternships />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
