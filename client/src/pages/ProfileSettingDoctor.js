import React, { useState, useEffect } from "react";
import SidebarDoctor from "../components/SidebarDoctor";
import axios from "axios";
import { useNavigate } from "react-router-dom";


import "../Styles/profileSettingsAdmin.css";

const ProfileSettingsDoctor = () => {
  const navigate = useNavigate()

  const [doctorData, setDoctorData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    address: "",
    phone: "",
    fee: "",
    specialization: "",
    startTime: "",
    endTime: "",
    days : []
  });

  const [updateMessage,setUpdateMessage] = useState(null);
  const [isPopupVisible,setPopupVisible] = useState(false); 
  const [confirmMessage,setConfirmMessage] = useState(null);
  const [isPopupVisible1,setPopupVisible1] = useState(false); 

  useEffect(() => {
    const fetchDoctorData = async () => {
        try {
            const storedUserDetails = JSON.parse(localStorage.getItem('user'));
            const response = await axios.get(`http://localhost:5000/doctor/infos/${storedUserDetails.id}`);
            const docData = response.data;
            setDoctorData(docData); 
        } catch (error) {
            console.error("Error fetching doctor data:", error);
        }
    };
    fetchDoctorData();
}, []);

const handleUpdate = async (event) => {
    event.preventDefault();

    try {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
        const response = await axios.put(`http://localhost:5000/doctor/update/${storedUserDetails.id}`, doctorData);
        if (response.data.message === 'Username is already taken') {
            setUpdateMessage('Username is already taken');
            setPopupVisible(true);
        } else {
            storedUserDetails.firstName = doctorData.firstName;
            storedUserDetails.lastName = doctorData.lastName;

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


const confirmDelete = async ()=> {
  setPopupVisible1(true);
  setConfirmMessage('Are you sure you want to delete your account?');
}



const handleDeleteAccount = async ()=> {
  try {
    const storedUserDetails = JSON.parse(localStorage.getItem('user'));
    const response = await axios.delete(`http://localhost:5000/doctor/delete/${storedUserDetails.id}`);
    console.log("Account deleted",response);
    navigate('/login_doc')

  }catch (error) {
    console.log("Error deleting doctor" , error)
  }
}

const closePopup1 = () =>{
  setPopupVisible1(false);
  setConfirmMessage(null);
}

const handleChange = (event) => {
  const { name, value, type, checked } = event.target;
  if (type === "checkbox") {
      const updatedDays = [...doctorData.days];
      if (checked) {
          updatedDays.push(value);
      } else {
          const index = updatedDays.indexOf(value);
          if (index !== -1) {
              updatedDays.splice(index, 1);
          }
      }
      setDoctorData({ ...doctorData, days: updatedDays });
  } else {
      setDoctorData({ ...doctorData, [name]: value });
  }
};



  return (
    <div>
      <SidebarDoctor />
      <div className="profileContainer">
      {isPopupVisible && (
            <div className="popup-overlay">
            <div className="popup-content">
              <p>{updateMessage}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}

{isPopupVisible1 && (
            <div className="popup-overlay">
            <div className="popup-content">
              <p>{confirmMessage}</p>
              <button onClick={handleDeleteAccount}>Yes</button>

              <button onClick={closePopup1} className="noBtn">No</button>
            </div>
          </div>
        )}
        <div className="boxPS">
        <div className="frow">
          <label htmlFor="input1">First name:</label>
          <input
            type="text"
            id="input1"
            name="firstName"
            value={doctorData.firstName}
            onChange={handleChange}
            
          />
        </div>
        <div className="frow">
          <label htmlFor="input2">Last name:</label>
          <input
            type="text"
            id="input2"
            name="lastName"
            value={doctorData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input3">Username:</label>
          <input
            type="text"
            id="input3"
            name="username"
            value={doctorData.username}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input4">Email:</label>
          <input
            type="text"
            id="input4"
            name="email"
            value={doctorData.email}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input5">Address:</label>
          <input
            type="text"
            id="input5"
            name="address"
            value={doctorData.address}
            onChange={handleChange}
          />
        </div>
        <div className="frow">
          <label htmlFor="input6">Phone:</label>
          <input
            type="text"
            id="input6"
            name="phone"
            value={doctorData.phone}
            onChange={handleChange}
          />
          
        </div>
        <div className="frow">
          <label htmlFor="input6">Fee:</label>
          <input
            type="number"
            id="input6"
            name="fee"
            value={doctorData.fee}
            onChange={handleChange}
          />
          </div>
          <div className="frow">
          <label htmlFor="input6">Specialization:</label>
          <input
            type="text"
            id="input6"
            name="specialization"
            value={doctorData.specialization}
            onChange={handleChange}
          />
          </div>
          <div className="checkDays">
    <label>Days of work:</label>
    <div className="checkboxes">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <div key={day}>
                <label>
                    <input
                        type="checkbox"
                        name="days"
                        value={day}
                        checked={doctorData.days.includes(day)}
                        onChange={handleChange}
                    />
                    {day}
                </label>
            </div>
        ))}
    </div>
</div>

          {/* <div className="frow">
            <label htmlFor="startTime">Start time:</label>
            <input
              type="text"
              id="startTime"
              name="startTime"
              value={doctorData.startTime}
              onChange={handleChange}
            />
          </div> */}

          {/* <div className="frow">
            <label htmlFor="endTime">End time:</label>
            <input
              type="text"
              id="endTime"
              name="endTime"
              value={doctorData.endTime}
              onChange={handleChange}
            />
          </div> */}

<div className="frowBtn">
          <button className="sBtn" onClick={handleUpdate}>Submit</button>
          <button className="delAccount" onClick={confirmDelete}>Delete Account</button>
        </div>
      </div>
      
        </div>
    </div>
  );
};

export default ProfileSettingsDoctor;
