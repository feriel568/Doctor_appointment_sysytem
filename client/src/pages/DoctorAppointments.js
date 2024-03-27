import React, { useState, useEffect } from 'react';
import Axios from 'axios';
// import SidebarPatient from '../components/SidebarPatient';
// import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import '../Styles/appointmentsPatientList.css';
import SidebarDoctor from '../components/SidebarDoctor';

const AppointmentsDocs = () => {
    const [appointments, setAppointments] = useState([]);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [isPopupVisible1, setPopupVisible1] = useState(false);

    const [appointmentIdToCheck, setAppointmentIdToCheck] = useState(null);
    const [appointmentToRefuse, setAppointmentToRefuse] = useState(null);

    useEffect(() => {
        // Retrieve user details from local storage
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));

        // Check if user details exist
        if (storedUserDetails) {
            // setUserDetails(storedUserDetails);

            // Fetch appointments for the connected patient using Axios
            Axios.get(`http://localhost:5000/appointment/doctor/${storedUserDetails.id}`)
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
        setAppointmentIdToCheck(null);
      };

      const closePopup1 = () => {
        setPopupVisible1(false);
        setAppointmentToRefuse(null);
      };


      const checkAppointment = (id) => {
        setPopupVisible(true);
        setAppointmentIdToCheck(id);

      
    };
    const refuseAppointment = (id) => {
        setPopupVisible1(true);
        setAppointmentToRefuse(id);
    }
    const confirmCheckAppointment = async () => {
        try {
            const response = await Axios.patch(`http://localhost:5000/appointment/doctor/approve/${appointmentIdToCheck}`);
            console.log(response.data);
            if (response.status === 200) {
                // Update appointments state to reflect the change
                setAppointments(prevAppointments => {
                    return prevAppointments.map(appointment => {
                        if (appointment._id === appointmentIdToCheck) {
                            return {
                                ...appointment,
                                status: 'approved' // Assuming status is updated in the backend response
                            };
                        }
                        return appointment;
                    });
                });
            }
        } catch (err) {
            console.error('Error checking app:', err);
        } finally {
            setAppointmentIdToCheck(null);
            setPopupVisible(false);
        }
    };
    

    const confirmRefuseAppointment = async () => {
        try {
            const response = await Axios.patch(`http://localhost:5000/appointment/doctor/refuse/${appointmentToRefuse}`);
            console.log(response.data);
            if (response.status === 200) {
                // Update appointments state to reflect the change
                setAppointments(prevAppointments => {
                    return prevAppointments.map(appointment => {
                        if (appointment._id === appointmentToRefuse) {
                            return {
                                ...appointment,
                                status: 'refused' // Assuming status is updated in the backend response
                            };
                        }
                        return appointment;
                    });
                });
            }
        } catch (err) {
            console.error('Error checking app:', err);
        } finally {
            setAppointmentToRefuse(null);
            setPopupVisible1(false);
        }}
    
    
    


    


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
            <SidebarDoctor />
            <div className="containerPat">
               
            {isPopupVisible && (
    <div className="popup-overlay">
        <div className="popup-content">
            <p>Are you sure you want to approve this appointment!</p>
                <button onClick={confirmCheckAppointment}>Yes</button>
                <button className="noBtn" onClick={closePopup}>No</button>
        </div>
    </div>
)}

{isPopupVisible1 && (
    <div className="popup-overlay">
        <div className="popup-content">
            <p>Are you sure you want to refuse this appointment!</p>
                <button onClick={confirmRefuseAppointment}>Yes</button>
                <button className="noBtn" onClick={closePopup1}>No</button>
        </div>
    </div>
)}

              

                <table className="tableApp">
                    <thead>
                        <tr>
                        <th>Patient name</th>
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
                                    <td>{appointment.patient.firstName} {appointment.patient.lastName}</td>

                                    <td>{formatDate(appointment.day)}</td>
                                    <td>{formatTime(appointment.time)}</td>
                                    <td>{appointment.patient.phone}</td>
                                    <td className={getClassForStatus(appointment.status)}>{appointment.status}</td>

                                    
                                    <td className="actionsApp">
    {appointment.status !== 'approved' && appointment.status !== 'refused' && ( 
        <FontAwesomeIcon icon={faCheck} className="editIconApp" onClick={() => checkAppointment(appointment._id)} />
    )}&nbsp;&nbsp;&nbsp;&nbsp;
    {appointment.status !== 'approved' && appointment.status !== 'refused' && ( 
        <FontAwesomeIcon icon={faTrash} className="deleteIconApp" onClick={() => refuseAppointment(appointment._id)} />
    )}
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

export default AppointmentsDocs;
