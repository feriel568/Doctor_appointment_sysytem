import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarPatient from '../components/SidebarPatient';
import '../Styles/createApp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const CreateAppointment = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSearching, setIsSearching] = useState(true);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/doctor/searchDoctor?search=${searchQuery}`);
      setDoctors(response.data);

      
      if (response.data.length > 0) {
        setSelectedDoctor(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error searching doctors', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async () => {
    const storedUserDetails = JSON.parse(localStorage.getItem('user'));
    try {
      const selectedDateTime = new Date(`${date}T${time}`);
      selectedDateTime.setHours(selectedDateTime.getHours() + 1);
      
      const response = await axios.post(`http://localhost:5000/appointment/patient/${storedUserDetails.id}`, {
        doctor: selectedDoctor,
        day: selectedDateTime.toISOString(),
        time: selectedDateTime.toISOString(),
      });
      
      
      setSuccessMessage('Appointment created successfully!');
      
     
      setPopupVisible(true);
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const closePopup = () => {
    
    setPopupVisible(false);
    setSuccessMessage(null);
  };

  const toggleSearchSelect = () => {
    setIsSearching(!isSearching);
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
         
          {isSearching ? (
            <input
              type="search"
              placeholder="Find a doctor"
              className="doctorSearch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          ) : (
            <select
              className="doctorDropdown"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="" disabled>Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          )}

          {/* Toggle button */}
          <button className='searchIc' onClick={toggleSearchSelect}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
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
            Pick appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;
