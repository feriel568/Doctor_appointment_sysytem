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
import RagisterPatient from './pages/RegisterPatient'
import DashPatient from './pages/DashPatient'
import LoginDoctor from './pages/LoginDoctor';
import DashDoctor from './pages/DashDoctor'
import AppointmentsPatient from './pages/AppointmentsPatient'
import CreateAppointment from './pages/CreateAppointment';
import Docs from './pages/ListDocsP';
 import AppointmentsDocs from './pages/DoctorAppointments'
 import PatientsListDoc from './pages/PatientsListForDoctor';
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
        <Route path="/register" element={<RagisterPatient />} />
        <Route path='/dash_patient' element={<DashPatient />} />
        <Route path='/login_doc' element={<LoginDoctor />} />
        <Route path='/dash_doc' element={<DashDoctor />} />
        <Route path='/appointments_list' element={<AppointmentsPatient />} />
        <Route path='/pick_appointment/:doctorId' element={<CreateAppointment />} />
        <Route path='/docs' element={<Docs />} />
        <Route path='/appsDoc' element={<AppointmentsDocs />} />
        <Route path="/mypatients" element={<PatientsListDoc />} />


        
      </Routes>
    </Router>
  );
};

export default App;
