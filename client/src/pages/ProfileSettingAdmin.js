import React, { useState, useEffect } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import axios from "axios";

import "../Styles/profileSettingsAdmin.css";

const ProfileSettingsAdmin = () => {
  const [adminData, setAdminData] = useState({
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
    const fetchAdminData = async () => {
        try {
            const storedUserDetails = JSON.parse(localStorage.getItem('user'));
            const response = await axios.get(`http://localhost:5000/admin/infos/${storedUserDetails.id}`);
            const adminData = response.data;
            setAdminData(adminData); 
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };
    fetchAdminData();
}, []);

const handleUpdate = async (event) => {
    event.preventDefault();

    try {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
        const response = await axios.put(`http://localhost:5000/admin/update/${storedUserDetails.id}`, adminData);
        if (response.data.message === 'Username is already taken') {
            setUpdateMessage('Username is already taken');
            setPopupVisible(true);
        } else {
            storedUserDetails.firstName = adminData.firstName;
            storedUserDetails.lastName = adminData.lastName;

            localStorage.setItem('user', JSON.stringify(storedUserDetails));
        setUpdateMessage('Credentials updated successfully');
        setPopupVisible(true);
        console.log( response.data);
        }
 

    }catch (error) {
        console.error("Error updating admin data:", error);
    }
}

const closePopup = () =>{
    setPopupVisible(false);
    setUpdateMessage(null);
}

const handleChange = (event) => {
    const { name, value } = event.target;
    setAdminData({ ...adminData, [name]: value });
  };


  return (
    <div>
      <SidebarAdmin />
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
            value={adminData.firstName}
            onChange={handleChange}
            
          />
        </div>
        <div className="frow">
          <label htmlFor="input2">Last name:</label>
          <input
            type="text"
            id="input2"
            name="lastName"
            value={adminData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input3">Username:</label>
          <input
            type="text"
            id="input3"
            name="username"
            value={adminData.username}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input4">Email:</label>
          <input
            type="text"
            id="input4"
            name="email"
            value={adminData.email}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input5">Address:</label>
          <input
            type="text"
            id="input5"
            name="address"
            value={adminData.address}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input6">Phone:</label>
          <input
            type="text"
            id="input6"
            name="phone"
            value={adminData.phone}
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

export default ProfileSettingsAdmin;
