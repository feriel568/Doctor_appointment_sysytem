// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import DashAdmin from './pages/DashAdmin';
import DoctorsList from './pages/doctorsList';
import AddDoctor from './pages/AddDoctor';
import UpdateDoctor from './pages/UpdateDoctor'
import ListUsers from './pages/ListUsers';
import LandingPagePatient from './pages/LandingPagePatient';
import LoginPatient from './pages/LoginPatient';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/'  element={<LandingPagePatient />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dash_admin" element={<DashAdmin />} />
        <Route path="/doctors_list" element={<DoctorsList />} />
        <Route path="/add_doctor" element={<AddDoctor />} />
        <Route path="/update_doctor/:doctorId" element={<UpdateDoctor />} />
        <Route path="/users_list" element={<ListUsers />} />
        <Route path="/login_patient" element={<LoginPatient />} />


        
      </Routes>
    </Router>
  );
};

export default App;
