import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarDoctor from '../components/SidebarDoctor';
import '../Styles/appointmentsPatientList.css';

const DashDoctor = () => {
  const [totalPatients , setTotalPatients] = useState(0); 
  const [totalAppointmentsDoc , setTotalAppointmentsDoc] = useState(0); 
  const [totalAppsPending , setTotalAppsPending] = useState(0);
  const [totalAppsApproved , setTotalAppsApproved] = useState(0);
  const [totalAppsRefused , setTotalAppsRefused] = useState(0);

  //fetching total number of patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`http://localhost:5000/doctor/getTotalNumberOfPatients/${storedUserDetails.id}`);
        const totalUsersFromServer = response.data;
        setTotalPatients(totalUsersFromServer);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };fetchData();
  }, []);
// fetching total number of appointments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`http://localhost:5000/appointment/doctor/totalAppointments/${storedUserDetails.id}`);
        const totalApps = response.data;
       
        setTotalAppointmentsDoc(totalApps);
      } catch (error) {
        console.error('Error fetching data of apps:', error);
      }
    };fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`http://localhost:5000/appointment/doctor/totalAppointmentsPending/${storedUserDetails.id}`);
        const totalAppsPending = response.data;
        
        setTotalAppsPending(totalAppsPending);
      } catch (error) {
        console.error('Error fetching data of apps:', error);
      }
    };fetchData();
  }, []);
// total apps approved
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`http://localhost:5000/appointment/doctor/totalAppointmentsApproved/${storedUserDetails.id}`);
        const totalAppsApproved = response.data;
        
        setTotalAppsApproved(totalAppsApproved);
      } catch (error) {
        console.error('Error fetching data of apps:', error);
      }
    };fetchData();
  }, []);

// total apps refused
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`http://localhost:5000/appointment/doctor/totalAppointmentsRefused/${storedUserDetails.id}`);
        const totalAppsRefused = response.data;
       
        setTotalAppsRefused(totalAppsRefused);
      } catch (error) {
        console.error('Error fetching data of apps:', error);
      }
    };fetchData();
  }, []);
  return (
    <div>
      <SidebarDoctor />
      <div className="statistics">

<div className="cds">
<h1>Total patients</h1>
  <p>{totalPatients}</p>

</div>
 <div className="cds">
<h1>Total appointments</h1>
  <p>{totalAppointmentsDoc}</p>

</div>
<div className="cds">
<h1>Pending appointments</h1>
  <p>{totalAppsPending}</p>

</div>
<div className="cds">
<h1>Approved appointments</h1>
  <p>{totalAppsApproved}</p>

</div>
<div className="cds">
  <h1>Refused appointments</h1>
  <p>{totalAppsRefused}</p>

</div> 

</div>
    </div>
  );
};

export default DashDoctor;
