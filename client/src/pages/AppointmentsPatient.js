import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import SidebarPatient from '../components/SidebarPatient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../Styles/appointmentsPatientList.css';

const AppointmentsPatient = () => {
    const [appointments, setAppointments] = useState([]);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [appointmentIdToDelete, setAppointmentIdToDelete] = useState(null);


    useEffect(() => {
        // Retrieve user details from local storage
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));

        // Check if user details exist
        if (storedUserDetails) {
            // setUserDetails(storedUserDetails);

            // Fetch appointments for the connected patient using Axios
            Axios.get(`http://localhost:5000/appointment/patient/${storedUserDetails.id}`)
                .then(response => setAppointments(response.data))
                .catch(error => console.error('Error fetching appointments:', error));
        } else {
            console.error('User details not found in local storage.');
        }
    }, []);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust the format as needed
    };

    const formatTime = (timeString) => {
        const time = new Date(timeString);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            
            
        };
        time.setHours(time.getHours() - 1); // Subtract one hour
        return time.toLocaleTimeString('en-US',options); // Adjust the format as needed
    };

    const closePopup = () => {
        setPopupVisible(false);
        setAppointmentIdToDelete(null);
      };

      const cancelAppointment = (id) => {
        setPopupVisible(true);
        setAppointmentIdToDelete(id);

      
    };

    const confirmCancelAppointment = async () => {
        try {
            const response = await Axios.delete(`http://localhost:5000/appointment/delete/${appointmentIdToDelete}`);
            setAppointments((prevApps) => prevApps.filter((appointment) => appointment._id !== appointmentIdToDelete));
            console.log(response.data);
        } catch (err) {
            console.error('Error deleting app:', err);
        } finally {
            setPopupVisible(false);
            setAppointmentIdToDelete(null);
        }
    };
    

    const getClassForStatus = (status) => {
        switch (status) {
            case 'approved':
                return 'green';
            case 'refused':
                return 'red';
            case 'pending':
                return 'black';
            default:
                return '';
        }
    };
    

    return (
        <div>
            <SidebarPatient />
            <div className="containerPat">
            {isPopupVisible && (
          <div className="popup-overlay" >
            <div className="popup-content">
              <p>Are you sure you want to cancel this appointment!</p>
              <button onClick={confirmCancelAppointment}>Yes</button>
              <button className="noBtn" onClick={closePopup}>No</button>
            </div>
          </div>
        )}

              

                <table className="tableApp">
                    <thead>
                        <tr>
                        <th>Doctor</th>

                            <th>Date</th>
                            <th>Time</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? (
                            appointments.map(appointment => (
                                <tr key={appointment._id}>
                                    {/* <td>{appointment._id}</td> */}
                                    <td>{appointment.doctor.firstName} {appointment.doctor.lastName}</td>

                                    <td>{formatDate(appointment.day)}</td>
                                    <td>{formatTime(appointment.time)}</td>
                                    <td>{appointment.doctor.phone}</td>

                                    <td className={getClassForStatus(appointment.status)}>{appointment.status}</td>
                                    
                                    <td className="actionsApp">
                                        {/* <FontAwesomeIcon icon={faPen} className="editIconApp" />&nbsp;&nbsp;&nbsp;&nbsp; */}
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <FontAwesomeIcon icon={faTrash} className="deleteIconApp"  onClick={() => cancelAppointment(appointment._id)} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No Appointments available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentsPatient;
