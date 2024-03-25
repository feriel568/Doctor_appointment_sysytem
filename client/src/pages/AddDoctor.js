// AddDoctor.js
import React, { useState } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin.js";
import '../Styles/addDoctor.css';



const AddDoctor = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    address: "",
    phone: "",
    fee: "",
    specialization: "",
    startTime: "",
    endTime: "",
    days : []
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "days") {
      // Handle days separately since it's an array
      const updatedDays = [...formData.days];
      if (e.target.checked) {
        updatedDays.push(value);
      } else {
        const index = updatedDays.indexOf(value);
        if (index !== -1) {
          updatedDays.splice(index, 1);
        }
      }
      setFormData({ ...formData, days: updatedDays });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your server to add the doctor
      const response =await axios.post('http://localhost:5000/doctor/addDoctor', formData);
      if (response.data.message === 'Doctor already exists.') {
        setErrorMessage('Doctor already exists.');
        setPopupVisible(true);
      } else {
        setSuccessMessage('Doctor added successfully');
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Error adding doctor', error);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <div>
      <SidebarAdmin />
      <div className="docForm">
        <h2>Add Doctor</h2>
        {isPopupVisible && (
          <div className={`popup-overlay ${errorMessage ? 'error' : ''}`}>
            <div className="popup-content">
              <p>{successMessage || errorMessage}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="formRow">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="formRow">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="phone">Phone:</label>
            <input
              type="number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="fee">Fee:</label>
            <input
              type="number"
              id="fee"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="specialization">Specialization:</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
            />
          </div>
          <div className="formRow">
  <label>Days of work:</label>
  <div className="checkboxes">
    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
      <div key={day}>
        <label>
          <input
            type="checkbox"
            name="days"
            value={day}
            checked={formData.days.includes(day)}
            onChange={handleChange}
          />
          {day}
        </label>
      </div>
    ))}
  </div>
</div>



          <div className="formRow">
            <label htmlFor="startTime">Start time:</label>
            <input
              type="text"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="endTime">End time:</label>
            <input
              type="text"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>

          {/* Repeat similar structure for other form fields */}
          <button type="submit">Add Doctor</button>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
