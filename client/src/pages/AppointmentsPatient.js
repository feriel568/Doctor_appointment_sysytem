import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import SidebarPatient from '../components/SidebarPatient';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import '../Styles/appointmentsPatientList.css';

const AppointmentsPatient = () => {
    const [appointments, setAppointments] = useState([]);
    // const [userDetails, setUserDetails] = useState({}); // New state to store user details

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
    

    return (
        <div>
            <SidebarPatient />
            <div className="containerPat">
                <Link to="">
                    <button type="button" className="addApp">
                        + Add appointment
                    </button>
                </Link>

              

                <table className="tableApp">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Doctor</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? (
                            appointments.map(appointment => (
                                <tr key={appointment._id}>
                                    <td>{appointment._id}</td>
                                    <td>{formatDate(appointment.day)}</td>
                                    <td>{formatTime(appointment.time)}</td>
                                    <td>{appointment.doctor.firstName} {appointment.doctor.lastName}</td>
                                    <td>{appointment.state}</td>
                                    
                                    <td className="actionsApp">
                                        <FontAwesomeIcon icon={faPen} className="editIconApp" />&nbsp;&nbsp;&nbsp;&nbsp;
                                        <FontAwesomeIcon icon={faTrash} className="deleteIconApp" />
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
