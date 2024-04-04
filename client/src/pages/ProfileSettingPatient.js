import React, { useState, useEffect } from "react";
import SidebarPatient from "../components/SidebarPatient";
import axios from "axios";

import "../Styles/profileSettingsAdmin.css";

const ProfileSettingsPatient = () => {
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    address: "",
    phone: ""
  });

  const [updateMessage,setUpdateMessage] = useState(null);
  const [isPopupVisible,setPopupVisible] = useState(false); 

  useEffect(() => {
    const fetchPatientData = async () => {
        try {
            const storedUserDetails = JSON.parse(localStorage.getItem('user'));
            const response = await axios.get(`http://localhost:5000/patient/infos/${storedUserDetails.id}`);
            const patientData = response.data;
            setPatientData(patientData); 
        } catch (error) {
            console.error("Error fetching patient data:", error);
        }
    };
    fetchPatientData();
}, []);

const handleUpdate = async (event) => {
    event.preventDefault();

    try {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
        const response = await axios.put(`http://localhost:5000/patient/update/${storedUserDetails.id}`, patientData);
        if (response.data.message === 'Username is already taken') {
            setUpdateMessage('Username is already taken');
            setPopupVisible(true);
        } else {
            storedUserDetails.firstName = patientData.firstName;
            storedUserDetails.lastName = patientData.lastName;

            localStorage.setItem('user', JSON.stringify(storedUserDetails));
        setUpdateMessage('Credentials updated successfully');
        setPopupVisible(true);
        console.log( response.data);
        }
 

    }catch (error) {
        console.error("Error updating patient data:", error);
    }
}

const closePopup = () =>{
    setPopupVisible(false);
    setUpdateMessage(null);
}

const handleChange = (event) => {
    const { name, value } = event.target;
    setPatientData({ ...patientData, [name]: value });
  };


  return (
    <div>
      <SidebarPatient />
      <div className="profileContainer">
      {isPopupVisible && (
            <div className="popup-overlay">
            <div className="popup-content">
              <p>{updateMessage}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
        <div className="frow">
          <label htmlFor="input1">First name:</label>
          <input
            type="text"
            id="input1"
            name="firstName"
            value={patientData.firstName}
            onChange={handleChange}
            
          />
        </div>
        <div className="frow">
          <label htmlFor="input2">Last name:</label>
          <input
            type="text"
            id="input2"
            name="lastName"
            value={patientData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input3">Username:</label>
          <input
            type="text"
            id="input3"
            name="username"
            value={patientData.username}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input4">Email:</label>
          <input
            type="text"
            id="input4"
            name="email"
            value={patientData.email}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input5">Address:</label>
          <input
            type="text"
            id="input5"
            name="address"
            value={patientData.address}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input6">Phone:</label>
          <input
            type="text"
            id="input6"
            name="phone"
            value={patientData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <button className="sBtn" onClick={handleUpdate}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPatient;
