import React , {useState , useEffect} from "react";
import axios from "axios";
// import { useNavigate } from 'react-router-dom'; 
import "../Styles/dashAdmin.css"; 

import SidebarAdmin from "../components/SidebarAdmin.js"

export const DashAdmin = () => {

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);  
  const [totalDoctors, setTotalDoctors] = useState(0); 
  const [totalPatients , setTotalPatients] = useState(0); 
  const [totalAppointments, setTotalAppointments] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/getTotalUsers');
        const totalUsersFromServer = response.data;
        setTotalUsers(totalUsersFromServer);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(()=>{
    const fetchData = async ()=> {
      try{
        const res = await axios.get('http://localhost:5000/admin/totalAdmins')
        const totalAdminsFromServer = res.data;
        setTotalAdmins(totalAdminsFromServer)
      }catch(error){
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  } , []);


  useEffect(()=>{
    const fetchData = async ()=> {
      try{
        const res = await axios.get('http://localhost:5000/doctor/totalDoctors')
        const totalDoctorsFromServer = res.data;
        setTotalDoctors(totalDoctorsFromServer)
      }catch(error){
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  } , []);

  
  useEffect(()=>{
    const fetchData = async ()=> {
      try{
        const res = await axios.get('http://localhost:5000/patient/totalPatients')
        const totalPatientsFromServer = res.data;
        setTotalPatients(totalPatientsFromServer)
      }catch(error){
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  } , []);

  useEffect(()=>{
    const fetchData = async ()=> {
      try{
        const res = await axios.get('http://localhost:5000/appointment/all')
        const totalAppointmentsFromServer = res.data;
        setTotalAppointments(totalAppointmentsFromServer)
      }catch(error){
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  } , []);

  return (
   
    <div>
      <SidebarAdmin />
     <div className="statistics">

      <div className="cds">
      <h1>Total users</h1>
        <p>{totalUsers}</p>

      </div>
      <div className="cds">
      <h1>Total admins</h1>
        <p>{totalAdmins}</p>

      </div>
      <div className="cds">
      <h1>Total doctors</h1>
        <p>{totalDoctors}</p>

      </div>
      <div className="cds">
      <h1>Total patients</h1>
        <p>{totalPatients}</p>

      </div>
      <div className="cds">
        <h1>Total appointments</h1>
        <p>{totalAppointments}</p>

      </div>

     </div>

    </div>
  );
};

export default DashAdmin