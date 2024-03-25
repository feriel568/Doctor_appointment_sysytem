import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarPatient from '../components/SidebarPatient';
import '../Styles/createApp.css';
import { useParams } from "react-router-dom";

const CreateAppointment = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    startTime: "",
    endTime: ""
  });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const { doctorId } = useParams();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/doctor/getDoctor/${doctorId}`);
        const doctorData = response.data;
        setFormData(doctorData);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };
    fetchDoctorData();
  }, [doctorId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateAppointment = async () => {
    const storedUserDetails = JSON.parse(localStorage.getItem('user'));

    try {
      const selectedDateTime = new Date(`${date}T${time}`);
    selectedDateTime.setHours(selectedDateTime.getHours() + 1);

    // Extract the date component from selectedDateTime
    const selectedDate = selectedDateTime.toISOString().split('T')[0];

    console.log("selectedDate : " + selectedDate);
    console.log("selectedDateTime : " + selectedDateTime.toISOString());
     
      const response = await axios.post(`http://localhost:5000/appointment/patient/${storedUserDetails.id}`, {
        doctor: formData,
        day: selectedDate,
        time: selectedDateTime.toISOString(),
      });

      

      const message = response.data && response.data.message;
      if (message === 'The doctor does not work on the selected day.' ||
          message === 'An appointment already exists for the selected date and time.' ||
          message === 'The selected time is not available during the doctor\'s working hours.') {
                

        setSuccessMessage(message);
        setPopupVisible(true);
        console.log(isPopupVisible)
      } else {
        
        setSuccessMessage('Appointment created successfully!');
        setPopupVisible(true);
      }
      
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };
  
  




  const closePopup = () => {
    setPopupVisible(false);
    setSuccessMessage(null);
  };

  return (
    <div>
      <SidebarPatient />
      <div className="appCn">
        {isPopupVisible && (
          <div className="popup1">
            <div className="popup-content1">
              <p>{successMessage}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}

        <div className="doctorInput">
          <label className='lb'>Doctor</label>
          <input
            type="text"
            onChange={handleChange}
            className="datePicker"
            value={`Dr. ${formData.firstName} ${formData.lastName}`}
          />
        </div>

        <div className="dateInput">
          <label className='lb'>Date</label>
          <input
            type="date"
            placeholder="Pick a date"
            className="datePicker"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="timeInput">
          <label className='lb'>Time</label>
          <input
            type="time"
            placeholder="Pick a time"
            className="timePicker"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="btnInput">
         
            <button type="submit" className='btnApp' onClick={handleCreateAppointment}>
              Pick Appointment
            </button> 
          
           
         
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;
