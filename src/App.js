import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Visitors from './Visitors'; 
import Analysis1 from './Analysis1';
import First from './First';
import FormPage1 from './FormPage1';
import Upload from './Upload';
import Analyze from './Analyze';
import About from './About';
import Dashboard from './dashboard';
import Login from './Login';import ProfileForm from './components/ProfileForm';
import Users from './users';

function App() {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Visitors" element={<Visitors />} />
        <Route path="/First" element={<First />} />
        <Route path="/FormPage1" element={<FormPage1 />} />
        <Route path="/Upload" element={<Upload />} />
        <Route path="/Analyze" element={<Analyze />} />
        <Route path="/analysis1" element={<Analysis1 />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
    </BrowserRouter>
  );
}

export default App;
