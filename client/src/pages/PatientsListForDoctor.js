import SidebarDoctor from '../components/SidebarDoctor';
import { useState , useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../Styles/appointmentsPatientList.css';
import Axios from 'axios';

const PatientsListDoc = () => {

   const [patients,setPatients] = useState([])
   const [isPopupVisible, setPopupVisible] = useState(false);
   const [patientToDelete, setPatientToDelete] = useState(null);
   const [searchQuery, setSearchQuery] = useState(''); 




   useEffect(() => {
    const storedUserDetails = JSON.parse(localStorage.getItem('user'));
    if (storedUserDetails) {
        // Fetch the list of patients for the connected doctor using Axios
        Axios.get(`http://localhost:5000/doctor/listPatients/${storedUserDetails.id}`)
            .then(response => {
                console.log(response.data);
                setPatients(response.data);
            })
            .catch(error => {
                console.error('Error fetching patients:', error);
            });
    } else {
        console.error('User details not found in local storage.');
    }
}, []); 

const handleDeletePatient = async () => {
    try {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));

        const response = await Axios.delete(`http://localhost:5000/doctor/deletePatient/${storedUserDetails.id}/${patientToDelete}`);
        if (response.status === 200) {
            // Remove the deleted patient from the state
            setPatients(prevPatients => prevPatients.filter(patient => patient._id !== patientToDelete));
        } else {
            console.error('Failed to delete patient');
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
    }
    finally {
        setPopupVisible(false);
    }
}

const deletePatient = (id) => {
    setPatientToDelete(id);
    setPopupVisible(true);
    


  
};
const closePopup = () => {
    setPopupVisible(false);
    setPatientToDelete(null);
  };

  const handleSearch = async () => {
    const storedUserDetails = JSON.parse(localStorage.getItem('user'));

    const res = await Axios.get(`http://localhost:5000/doctor/searchPatients/${storedUserDetails.id}?name=${searchQuery}`)
    setPatients(res.data);
  }

  return (
    <div>
        <SidebarDoctor />
        <div className="containerPat">
            {isPopupVisible && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>Are you sure you want to delete this patient?</p>
                        <button onClick={handleDeletePatient}>Yes</button>
                        <button className="noBtn" onClick={closePopup}>No</button>
                    </div>
                </div>
            )}
             <div className="sr1">
                    <input
                        type="text"
                        placeholder="Search patient by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="sBtn1" onClick={handleSearch}>Search</button>
                </div>

            <table className="tableApp">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.length > 0 ? (
                        patients.map(patient => (
                            <tr key={patient._id}>
                                <td>{patient.firstName} {patient.lastName}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.email}</td>
                                <td>{patient.phone}</td>
                                <td>{patient.address}</td>
                                <td className="actionsApp">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <FontAwesomeIcon icon={faTrash} className="deleteIconApp" onClick={() => deletePatient(patient._id)} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No patients available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);



}

export default PatientsListDoc;