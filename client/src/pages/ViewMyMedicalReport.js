import React, { useState , useEffect} from 'react';
import SidebarPatient from '../components/SidebarPatient';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import "../Styles/profileSettingsAdmin.css";


const ViewMyMedReport = ()=>{

    const [dossiers, setDossiers] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUserDetails = JSON.parse(localStorage.getItem('user'));
                const ptId = storedUserDetails.id;
                
                // Fetch all dossiers for the patient
                const response = await axios.get(`http://localhost:5000/dossier/getAll/${ptId}`);
                const fetchedDossiers = response.data;
                setDossiers(fetchedDossiers);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []);

    return (
        <div>
            <SidebarPatient /> 
            <div className="containerPat">
                <table className="tableApp">
                    <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Medical report</th>
                            {/* <th>Medications</th> */}
                            {/* <th>Actions</th> */}
                            {/* Add more table headers if needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {dossiers.length > 0 ? (
                            dossiers.map(dossier => (
                                <tr key={dossier._id}>
                                   
                                    <td>{dossier.doctor.firstName} {dossier.doctor.lastName}</td>
                                    {/* <td>{dossier.notes}</td>
                                    <td>{dossier.meds}</td> */}
                                    {/* Add more table cells if needed */}
                                    <Link to={`/viewDetails/${dossier._id}`}>
                                    <td> <FontAwesomeIcon icon={faClipboard} /></td>
                                    </Link>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No Medical Reports available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewMyMedReport;
